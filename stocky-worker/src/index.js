// Stocky: servidor intermedio entre la página y la API de Claude.
// Guarda la clave de API (nunca llega al navegador), limita el abuso
// y devuelve la respuesta en partes para que se vea escribir en vivo.
import Anthropic from "@anthropic-ai/sdk";
import { buildRequest, DEFAULT_MODEL } from "./stocky.js";

const MAX_TURNS = 16;          // mensajes de historial que se envían como máximo
const MAX_CHARS = 800;         // largo máximo de cada mensaje del visitante

const corsHeaders = (origin) => ({
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
  Vary: "Origin"
});

const json = (body, status, origin) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...corsHeaders(origin) } });

// Acepta solo una conversación bien formada: turnos alternados, empieza y termina en el visitante.
const cleanMessages = (input) => {
  if (!Array.isArray(input) || input.length === 0) return null;
  const messages = input.slice(-MAX_TURNS).map((m) => ({
    role: m && m.role === "assistant" ? "assistant" : "user",
    content: String((m && m.content) || "").trim().slice(0, m && m.role === "assistant" ? 3000 : MAX_CHARS)
  })).filter((m) => m.content);
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== "user") return null;
  for (let i = 1; i < messages.length; i++) if (messages[i].role === messages[i - 1].role) return null;
  return messages;
};

export default {
  async fetch(request, env, ctx) {
    const allowed = (env.ALLOWED_ORIGINS || "").split(",").map((o) => o.trim()).filter(Boolean);
    const origin = request.headers.get("Origin") || "";
    if (!allowed.includes(origin)) return new Response("Origen no permitido", { status: 403 });
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(origin) });
    if (request.method !== "POST") return json({ error: "method" }, 405, origin);

    const ip = request.headers.get("CF-Connecting-IP") || "anon";
    if (env.LIMITER) {
      const { success } = await env.LIMITER.limit({ key: ip });
      if (!success) return json({ error: "rate_limit" }, 429, origin);
    }

    let body;
    try { body = await request.json(); } catch { return json({ error: "bad_request" }, 400, origin); }
    const messages = cleanMessages(body && body.messages);
    if (!messages) return json({ error: "bad_request" }, 400, origin);

    const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
    const params = buildRequest(messages, env.MODEL || DEFAULT_MODEL);

    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();
    const send = (data) => writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));

    const run = async () => {
      try {
        const stream = client.beta.messages.stream(params);
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") await send({ t: event.delta.text });
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") await send({ error: "refusal" });
        await send({ done: true });
      } catch (error) {
        const code = error instanceof Anthropic.RateLimitError ? "busy"
          : error instanceof Anthropic.AuthenticationError ? "config"
          : error instanceof Anthropic.APIError ? "api"
          : "network";
        console.error("Stocky:", code, error && error.message);
        await send({ error: code });
      } finally {
        await writer.close();
      }
    };
    ctx.waitUntil(run());

    return new Response(readable, {
      headers: { "Content-Type": "text/event-stream; charset=utf-8", "Cache-Control": "no-store", ...corsHeaders(origin) }
    });
  }
};
