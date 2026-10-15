// Prueba a Stocky con las preguntas de pruebas/preguntas.json usando la API de verdad.
// Uso: npm run probar                  (todas, con controles automáticos)
//      npm run probar -- factura       (solo las que tengan "factura" en el tema o el texto)
//      npm run probar -- --juez        (además, un juez califica cada respuesta del 1 al 5)
// Necesita la clave en la variable ANTHROPIC_API_KEY o en el archivo .dev.vars.
// Cada corrida cuesta centavos de dólar; con --juez, aproximadamente el doble.
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildRequest, DEFAULT_MODEL } from "../src/stocky.js";
import { SYSTEM_PROMPT } from "../src/conocimiento.generated.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const devVars = join(root, ".dev.vars");
if (!process.env.ANTHROPIC_API_KEY && existsSync(devVars)) {
  const line = readFileSync(devVars, "utf8").split(/\r?\n/).find((l) => l.startsWith("ANTHROPIC_API_KEY="));
  if (line) process.env.ANTHROPIC_API_KEY = line.slice("ANTHROPIC_API_KEY=".length).trim();
}
if (!process.env.ANTHROPIC_API_KEY) {
  console.error("Falta la clave: creá .dev.vars con ANTHROPIC_API_KEY=... o exportá la variable.");
  process.exit(1);
}

const args = process.argv.slice(2);
const useJudge = args.includes("--juez");
const filter = (args.find((a) => !a.startsWith("--")) || "").toLowerCase();
const model = process.env.MODEL || DEFAULT_MODEL;
const client = new Anthropic();
const plain = (t) => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const messagesFor = (c) => c.conversacion || [{ role: "user", content: c.pregunta }];
const label = (c) => c.pregunta || messagesFor(c).filter((m) => m.role === "user").map((m) => m.content).join(" → ");
const cases = JSON.parse(readFileSync(join(root, "pruebas", "preguntas.json"), "utf8"))
  .filter((c) => !filter || plain(`${c.tema} ${label(c)}`).includes(plain(filter)));

const check = (c, answer) => {
  const problems = [];
  const text = plain(answer);
  if (c.incluye && !c.incluye.some((k) => text.includes(plain(k)))) problems.push(`debería mencionar: ${c.incluye.join(" / ")}`);
  for (const k of c.no_incluye || []) if (text.includes(plain(k))) problems.push(`no debería decir: "${k}"`);
  const derivo = /\[\[DERIVAR:/.test(answer);
  if (c.deriva === true && !derivo) problems.push("debería derivar al equipo");
  if (c.deriva === false && derivo) problems.push("derivó sin necesidad");
  return problems;
};

// Juez: compara la respuesta con el conocimiento de Stocky y la califica.
const JUDGE_PROMPT = `Sos un supervisor de atención al cliente. Evaluás respuestas de Stocky, el asistente virtual de Profesional Stock, contra su guía oficial (abajo). Calificá del 1 al 5:
- exactitud: 5 si todo lo que afirma está respaldado por la guía; 1 si inventa precios, funciones, plazos o políticas.
- utilidad: 5 si resuelve o encamina la consulta con un próximo paso claro.
- tono: 5 si es cálido, rioplatense (con "vos"), claro y del largo justo.
- derivacion: 5 si deriva al equipo exactamente cuando la guía lo pide (con la marca [[DERIVAR: ...]]) y no deriva cuando puede resolverlo solo.
Respondé solo con un objeto JSON en una línea, sin texto alrededor: {"exactitud":n,"utilidad":n,"tono":n,"derivacion":n,"comentario":"una frase con lo más importante a mejorar"}

GUÍA OFICIAL DE STOCKY:
${SYSTEM_PROMPT}`;

const judge = async (c, answer) => {
  const transcript = messagesFor(c).map((m) => `${m.role === "user" ? "Cliente" : "Stocky"}: ${m.content}`).join("\n");
  const response = await client.messages.create({
    model,
    max_tokens: 2000,
    output_config: { effort: "low" },
    system: [{ type: "text", text: JUDGE_PROMPT, cache_control: { type: "ephemeral" } }],
    messages: [{ role: "user", content: `Conversación:\n${transcript}\n\nRespuesta de Stocky a evaluar:\n${answer}` }]
  });
  const text = response.content.filter((b) => b.type === "text").map((b) => b.text).join("");
  const match = text.match(/\{[\s\S]*\}/);
  try { return JSON.parse(match ? match[0] : text); } catch { return { comentario: `respuesta del juez ilegible: ${text.slice(0, 120)}` }; }
};

const run = async (c) => {
  try {
    const response = await client.beta.messages.create(buildRequest(messagesFor(c), model));
    const answer = response.content.filter((b) => b.type === "text").map((b) => b.text).join("").trim();
    if (response.stop_reason === "refusal") return { c, answer: "(rechazada por el modelo)", problems: ["el modelo rechazó la pregunta"] };
    const result = { c, answer, problems: check(c, answer), cached: response.usage.cache_read_input_tokens || 0 };
    if (useJudge) {
      result.nota = await judge(c, answer);
      const low = ["exactitud", "utilidad", "tono", "derivacion"].filter((k) => typeof result.nota[k] === "number" && result.nota[k] <= 3);
      if (low.length) result.problems.push(`el juez puso nota baja en ${low.join(", ")}: ${result.nota.comentario || ""}`);
    }
    return result;
  } catch (error) {
    return { c, answer: "", problems: [`error de la API: ${error.message}`] };
  }
};

console.log(`Probando ${cases.length} casos con ${model}${useJudge ? " y juez" : ""}...\n`);
const results = [];
for (let i = 0; i < cases.length; i += 4) results.push(...await Promise.all(cases.slice(i, i + 4).map(run)));

let ok = 0;
const totals = { exactitud: 0, utilidad: 0, tono: 0, derivacion: 0 };
let judged = 0;
for (const r of results) {
  const passed = r.problems.length === 0;
  if (passed) ok++;
  console.log(`${passed ? "✔" : "✘"} [${r.c.tema}] ${label(r.c)}`);
  console.log(`  ${r.answer.replace(/\n/g, "\n  ")}`);
  if (r.nota && typeof r.nota.exactitud === "number") {
    judged++;
    for (const k of Object.keys(totals)) totals[k] += r.nota[k] || 0;
    console.log(`  Juez: exactitud ${r.nota.exactitud} · utilidad ${r.nota.utilidad} · tono ${r.nota.tono} · derivación ${r.nota.derivacion}`);
  }
  for (const p of r.problems) console.log(`  → ${p}`);
  console.log("");
}
console.log(`Resultado: ${ok}/${results.length} casos sin problemas.`);
if (judged) console.log(`Promedios del juez: ${Object.entries(totals).map(([k, v]) => `${k} ${(v / judged).toFixed(1)}`).join(" · ")}`);
console.log(`Tokens leídos de caché: ${results.reduce((s, r) => s + (r.cached || 0), 0)} (si es 0 en todas, el caché no está funcionando).`);
writeFileSync(join(root, "pruebas", "ultimo-resultado.json"), JSON.stringify(results.map((r) => ({ tema: r.c.tema, conversacion: messagesFor(r.c), respuesta: r.answer, nota: r.nota, problemas: r.problems })), null, 2));
console.log("Detalle guardado en pruebas/ultimo-resultado.json");
