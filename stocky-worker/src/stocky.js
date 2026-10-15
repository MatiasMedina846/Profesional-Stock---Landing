// Arma el pedido a Claude para Stocky. Lo usan el Worker y las pruebas, así responden igual.
import { SYSTEM_PROMPT } from "./conocimiento.generated.js";

export const DEFAULT_MODEL = "claude-opus-5-5";
const MODELS_WITH_FALLBACK = ["claude-opus-5-5", "claude-sonnet-5-5"];
const DAYS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

// Situación horaria en Argentina, para que Stocky sepa si el equipo está disponible.
export const teamStatus = (now = new Date()) => {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Argentina/Buenos_Aires", weekday: "short", hour: "numeric", minute: "2-digit", hourCycle: "h23", day: "2-digit", month: "2-digit"
  }).formatToParts(now).map((p) => [p.type, p.value]));
  const dayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.weekday);
  const hour = Number(parts.hour);
  const open = dayIndex >= 1 && dayIndex <= 6 && hour >= 9 && hour < 18;
  const nextOpen = open ? "" : (dayIndex === 6 && hour >= 18) || dayIndex === 0 ? "el lunes a partir de las 9" : hour < 9 ? "hoy a partir de las 9" : "mañana a partir de las 9";
  return `Ahora en Argentina es ${DAYS[dayIndex]} ${parts.day}/${parts.month}, ${parts.hour}:${parts.minute} h. ` +
    (open ? "El equipo está en horario de atención (lunes a sábado de 9 a 18 h): si derivás, decí que le van a responder por WhatsApp en cuanto lo vean."
          : `El equipo está fuera de horario: si derivás, decí que le van a responder ${nextOpen}, y resolvé todo lo que puedas ahora.`);
};

export const buildRequest = (messages, model = DEFAULT_MODEL, now = new Date()) => {
  const params = {
    model,
    max_tokens: 2500,
    output_config: { effort: "medium" },
    system: [
      // Bloque fijo: queda en caché y cada pregunta lo cobra mucho más barato.
      { type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } },
      // Bloque que cambia (hora), después del caché.
      { type: "text", text: teamStatus(now) }
    ],
    messages
  };
  // Si el modelo rechaza un pedido por sus filtros de seguridad, la API lo reintenta en otro modelo.
  if (MODELS_WITH_FALLBACK.includes(model)) {
    params.betas = ["server-side-fallback-2026-07-01"];
    params.fallbacks = "default";
  }
  return params;
};
