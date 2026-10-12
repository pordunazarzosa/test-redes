import { PreguntaSchema, type Pregunta } from "@/domain/pregunta";
import config from "@/content/examen.config.json";

const archivos = import.meta.glob("/src/content/preguntas/*.json", { eager: true, import: "default" });

export const errores: string[] = [];
export const bancoBase: Pregunta[] = Object.entries(archivos).flatMap(([ruta, datos]) =>
  (datos as unknown[]).flatMap((item, i) => {
    const r = PreguntaSchema.safeParse(item);
    if (r.success) return [r.data];
    errores.push(`${ruta} #${i + 1}: ${r.error.issues.map((e) => `${e.path.join(".")} ${e.message}`).join("; ")}`);
    return [];
  }),
);

export { config };