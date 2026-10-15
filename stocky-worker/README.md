# Stocky con IA

Stocky es el asistente de la página. Con este servidor responde **cualquier duda** usando Claude (la IA de Anthropic): asesora a los interesados, explica cómo usar el sistema, resuelve problemas paso a paso y, cuando algo necesita a Matías o Mateo, deja el caso armado para mandarlo por WhatsApp o email con un botón.

La página está en GitHub Pages, que solo publica archivos: no puede guardar una clave de API en secreto. Por eso Stocky le habla a este pequeño servidor en **Cloudflare Workers** (gratis), que guarda la clave, le pasa a Claude todo lo que sabe y devuelve la respuesta en vivo.

```
Visitante → página (GitHub Pages) → Worker de Cloudflare (guarda la clave) → API de Claude
```

Mientras el Worker no esté configurado, Stocky responde con sus respuestas fijas. Si el Worker falla o se queda sin saldo, vuelve a esas respuestas solo.

## Cómo está armado

| Carpeta o archivo | Para qué sirve |
|---|---|
| `conocimiento/` | **Todo lo que sabe Stocky**, en archivos de texto por tema. Es lo único que hay que editar para "entrenarlo". |
| `pruebas/preguntas.json` | Preguntas de prueba con lo que Stocky debe (y no debe) responder. |
| `pruebas/probar.js` | Corre las pruebas contra la IA y marca qué falla. |
| `src/` | El servidor: solo acepta pedidos de tu página, limita a 8 preguntas por minuto por visitante y avisa a Stocky si el equipo está o no en horario. |
| `wrangler.toml` | Configuración: páginas permitidas, modelo y límite por visitante. |

### Los archivos de conocimiento

- `00-instrucciones.md`: personalidad, cómo conversa, cómo resuelve problemas, **cuándo y cómo deriva al equipo** y lo que nunca debe hacer.
- `05-ejemplos.md`: conversaciones modelo. Es lo que más define cómo responde: si querés cambiar su estilo, cambiá estos ejemplos.
- `15-ventas-y-objeciones.md`: cómo acompañar a un interesado y responder objeciones ("es caro", "son nuevos", "no sé de computación").
- `10-producto.md`: qué es, funciones, pantallas y lo que todavía no tiene.
- `20-precios-y-licencias.md`: prueba, planes, cómo recomendar uno y cómo se compra.
- `30-instalacion-y-activacion.md`: descarga, SmartScreen y activación.
- `40-problemas-frecuentes.md`: guías para resolver problemas.
- `50-uso-diario.md`: cómo se hacen las tareas en el programa.
- `60-empresa-y-contacto.md`: equipo, horarios, contacto y privacidad.
- `70-vocabulario.md`: cómo hablan los comerciantes (fiado, posnet, arqueo, QR) y a qué función corresponde.

Se pueden agregar archivos nuevos (por ejemplo `45-errores-conocidos.md`): se suman solos en orden por nombre.

## Entrenarlo: el ciclo

1. **Probar**: `npm run probar` corre los 61 casos de prueba (incluye charlas de varios mensajes) y muestra cada respuesta con ✔ o ✘. Para un tema solo: `npm run probar -- factura`. Para que además un **juez** califique cada respuesta del 1 al 5 en exactitud, utilidad, tono y derivación: `npm run probar -- --juez`.
2. **Corregir**: si una respuesta está mal, falta o le falta info, editá el archivo de `conocimiento/` que corresponda (en castellano, como se lo explicarías a un empleado nuevo).
3. **Sumar casos**: cada vez que un cliente pregunte algo nuevo o Stocky responda mal, agregá esa pregunta a `pruebas/preguntas.json` con lo que debería decir.
4. **Publicar**: `npm run deploy`.

Una corrida completa cuesta alrededor de USD 1 (el doble con el juez). Apuntá a que todos los casos den ✔ y los promedios del juez estén en 4,5 o más.

### Lo que Stocky todavía no sabe (y hoy deriva)

Completar esto en `conocimiento/` es lo que más lo va a mejorar, porque solo ustedes lo saben:

- [ ] Dónde está exactamente la opción de **copia de seguridad** y cómo se **restaura** una copia.
- [ ] Qué hacer si alguien **olvidó la contraseña** de la cuenta.
- [ ] Cómo se **habilita la licencia** después de pagar (¿es automático? ¿cuánto tarda?).
- [ ] Cómo se **pasa la licencia a otra computadora** y si tiene costo.
- [ ] **Precio de la renovación** de actualizaciones y soporte después de los 12 meses.
- [ ] Política de **devoluciones** y si entregan **factura** por la compra.
- [ ] Si varias computadoras del plan Negocio o Empresarial **comparten los datos** o cada una tiene los suyos.
- [ ] **Errores conocidos** del programa y su solución (mensaje exacto → qué hacer).
- [ ] Dónde se abre el **manual** dentro del programa y otros **atajos de teclado** además de F12.

## Puesta en marcha (una sola vez)

### Lo que necesitás

1. **Node.js 22 o superior.** Tu compu tiene la 20: instalá la versión LTS desde [nodejs.org](https://nodejs.org).
2. **Una cuenta de Anthropic con saldo**, para la clave de API: [console.anthropic.com](https://console.anthropic.com). La API es prepaga. Fijá un límite de gasto mensual en *Settings → Limits*.
3. **Una cuenta gratuita de Cloudflare**: [dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up).

### Pasos

Desde una terminal, en esta carpeta (`stocky-worker`):

```bash
npm install
```

```bash
npx wrangler login
```

Cargá la clave de API como secreto (te la pide en pantalla; nunca la pegues en un archivo del repositorio):

```bash
npx wrangler secret put ANTHROPIC_API_KEY
```

Publicá el servidor:

```bash
npm run deploy
```

Al terminar te muestra una dirección parecida a `https://stocky.tu-usuario.workers.dev`. Copiala en `index.html`, en esta línea:

```js
const ASSISTANT_API_URL = "https://stocky.tu-usuario.workers.dev";
```

Publicá la página (commit y push) y listo.

Para correr las pruebas en tu compu, creá un archivo `.dev.vars` en esta carpeta (ya está excluido de git) con:

```
ANTHROPIC_API_KEY=tu-clave
```

## Cuánto cuesta (aproximado)

Cada pregunta usa unos 10.000 tokens de entrada (casi todo es el conocimiento de Stocky, que queda en caché y sale mucho más barato) y entre 300 y 800 de salida.

| Modelo (`MODEL` en `wrangler.toml`) | Por pregunta | 1.000 preguntas |
|---|---|---|
| `claude-opus-5-5` (el más capaz, configurado por defecto) | ~USD 0,017 | ~USD 17 |
| `claude-haiku-5-5` (rápido y económico) | ~USD 0,0006 | ~USD 0,60 |

Son estimaciones: el costo real depende del largo de las conversaciones y lo ves en la consola de Anthropic, en *Usage*. Para probar otro modelo antes de cambiarlo: `MODEL=claude-haiku-5-5 npm run probar`. Para cambiarlo, editá `MODEL` en `wrangler.toml` y publicá con `npm run deploy`.

Cloudflare Workers es gratis hasta 100.000 pedidos por día.

## Otras configuraciones

- **Dominio propio**: sumalo a `ALLOWED_ORIGINS` en `wrangler.toml` (separado por coma) y publicá.
- **Probar el servidor en tu compu**: `npm run dev` y, mientras pruebes, poné `http://localhost:8787` en `ASSISTANT_API_URL`.
