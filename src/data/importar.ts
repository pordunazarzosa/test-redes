import JSZip from "jszip";
import { PreguntaSchema, type Pregunta } from "@/domain/pregunta";
import { db } from "./db";

export type Analisis = {
  total: number;          // preguntas que traía el archivo
  validas: Pregunta[];    // las que se pueden añadir
  errores: string[];      // motivo de cada pregunta descartada
};

const TIPOS_IMAGEN: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
};

const soloError = (mensaje: string): Analisis => ({ total: 0, validas: [], errores: [mensaje] });

/** Valida una lista de preguntas ya leída de un JSON. Las inválidas se descartan con su motivo. */
export function validarPreguntas(datos: unknown): Analisis {
  if (!Array.isArray(datos)) {
    return soloError("El archivo debe contener una lista de preguntas: [ { … }, { … } ]");
  }
  const validas: Pregunta[] = [];
  const errores: string[] = [];
  const ids = new Set<string>();

  datos.forEach((item, i) => {
    const id = (item as { id?: unknown } | null)?.id;
    const ref = `Pregunta ${i + 1}` + (typeof id === "string" ? ` (${id})` : "");
    const r = PreguntaSchema.safeParse(item);
    if (!r.success) {
      const motivos = r.error.issues.map((e) => (e.path.length ? `${e.path.join(".")}: ` : "") + e.message);
      errores.push(`${ref} › ${motivos.join("; ")}`);
    } else if (ids.has(r.data.id)) {
      errores.push(`${ref} › id repetido dentro del archivo`);
    } else {
      ids.add(r.data.id);
      validas.push(r.data);
    }
  });

  return { total: datos.length, validas, errores };
}

/** Lee un .json (lista de preguntas) o un .zip (preguntas.json + carpeta img/) y lo valida. */
export async function analizarArchivo(archivo: File): Promise<Analisis> {
  const nombre = archivo.name.toLowerCase();
  try {
    if (nombre.endsWith(".json")) return validarPreguntas(leerJson(await archivo.text()));
    if (nombre.endsWith(".zip")) return await analizarZip(archivo);
    return soloError("Formato no admitido: elige un archivo .json o .zip");
  } catch (e) {
    return soloError(`No se pudo leer el archivo: ${e instanceof Error ? e.message : String(e)}`);
  }
}

// Quita la marca BOM que añaden algunos editores de Windows al principio del archivo
const leerJson = (texto: string): unknown => JSON.parse(texto.replace(/^\uFEFF/, ""));

async function analizarZip(archivo: File): Promise<Analisis> {
  const zip = await JSZip.loadAsync(archivo);
  const json = Object.values(zip.files).find((f) => !f.dir && /(^|\/)preguntas\.json$/i.test(f.name));
  if (!json) return soloError("El ZIP debe contener un archivo llamado preguntas.json");

  const carpeta = json.name.slice(0, -"preguntas.json".length); // por si el JSON está dentro de una carpeta
  const analisis = validarPreguntas(leerJson(await json.async("string")));

  // Cada imagen del ZIP se incrusta en la pregunta como data: URL
  const validas: Pregunta[] = [];
  for (const p of analisis.validas) {
    if (!p.imagen || /^(data:|https?:)/.test(p.imagen)) {
      validas.push(p);
      continue;
    }
    const f = zip.file(carpeta + p.imagen) ?? zip.file(p.imagen);
    if (!f) {
      analisis.errores.push(`${p.id} › no se encuentra la imagen «${p.imagen}» dentro del ZIP`);
      continue;
    }
    const extension = p.imagen.split(".").pop()?.toLowerCase() ?? "";
    const base64 = await f.async("base64");
    validas.push({ ...p, imagen: `data:${TIPOS_IMAGEN[extension] ?? "application/octet-stream"};base64,${base64}` });
  }
  return { ...analisis, validas };
}

/** Guarda las preguntas en la base de datos del navegador (si el id ya existe, la sustituye). */
export async function guardarPreguntas(preguntas: Pregunta[]): Promise<number> {
  const ahora = Date.now();
  await db.preguntas.bulkPut(preguntas.map((p) => ({ ...p, importadaEn: ahora })));
  return preguntas.length;
}

export const borrarImportadas = () => db.preguntas.clear();
