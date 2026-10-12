import Dexie, { type EntityTable } from "dexie";
import type { Pregunta, Respuesta } from "@/domain/pregunta";

export interface Intento {
  id?: number;
  fecha: number;
  modo: "simulacro" | "practica";
  nota: number;
  aciertos: number;
  fallos: number;
  blancos: number;
  duracionSeg: number;
  detalle: { preguntaId: string; tema: string; respuesta: Respuesta; correcta: number }[];
}

export interface PreguntaImportada extends Pregunta {
  importadaEn: number;
  imagenBlob?: Blob;          // imagen que venía en el ZIP
}

export const db = new Dexie("test-redes") as Dexie & {
  intentos: EntityTable<Intento, "id">;
  preguntas: EntityTable<PreguntaImportada, "id">;
};

db.version(1).stores({
  intentos: "++id, fecha, modo",   // ++id = autonumérico; el resto, índices para buscar
  preguntas: "id, tema",
});