import { useMemo } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import type { Pregunta } from "@/domain/pregunta";
import { bancoBase } from "./banco";
import { db } from "./db";

/**
 * Banco completo: preguntas del proyecto (src/content/preguntas) + importadas desde la app.
 * Si una importada tiene el mismo id que una del proyecto, la sustituye.
 */
export function useBanco(): { banco: Pregunta[]; numImportadas: number } {
  const importadas = useLiveQuery(() => db.preguntas.toArray(), []);
  const banco = useMemo(() => {
    if (!importadas) return bancoBase;
    const ids = new Set(importadas.map((p) => p.id));
    return [...bancoBase.filter((p) => !ids.has(p.id)), ...importadas];
  }, [importadas]);
  return { banco, numImportadas: importadas?.length ?? 0 };
}
