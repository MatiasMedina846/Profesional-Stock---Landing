// Junta los archivos de la carpeta "conocimiento" (en orden por nombre) en un solo
// texto que usa el Worker. Se ejecuta solo antes de publicar o probar.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const folder = join(root, "conocimiento");
const files = readdirSync(folder).filter((name) => name.endsWith(".md")).sort();
const text = files.map((name) => readFileSync(join(folder, name), "utf8").trim()).join("\n\n---\n\n");

writeFileSync(
  join(root, "src", "conocimiento.generated.js"),
  `// Archivo generado por scripts/armar-conocimiento.js a partir de la carpeta "conocimiento". No editar a mano.\nexport const SYSTEM_PROMPT = ${JSON.stringify(text)};\n`
);
console.log(`Conocimiento de Stocky armado: ${files.length} archivos, ${text.length} caracteres.`);
