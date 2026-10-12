import { db, type Intento, type PreguntaImportada } from "./db";

type Copia = {
  app: "test-redes";
  version: 1;
  fecha: number;
  intentos: Intento[];
  preguntas: PreguntaImportada[];
};

/** Descarga un JSON con el historial y las preguntas importadas. */
export async function exportarCopia() {
  const copia: Copia = {
    app: "test-redes",
    version: 1,
    fecha: Date.now(),
    intentos: await db.intentos.toArray(),
    preguntas: await db.preguntas.toArray(),
  };
  const url = URL.createObjectURL(new Blob([JSON.stringify(copia)], { type: "application/json" }));
  const dia = new Date().toISOString().slice(0, 10);
  const enlace = Object.assign(document.createElement("a"), { href: url, download: `copia-test-redes-${dia}.json` });
  enlace.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Restaura una copia. Lo que ya existe con el mismo id se sustituye; lo demás se conserva. */
export async function importarCopia(archivo: File): Promise<string> {
  const datos = JSON.parse((await archivo.text()).replace(/^\uFEFF/, "")) as Partial<Copia>;
  const intentos = datos.intentos;
  const preguntas = Array.isArray(datos.preguntas) ? datos.preguntas : [];
  if (datos.app !== "test-redes" || !Array.isArray(intentos)) {
    throw new Error("Este archivo no es una copia de seguridad de la app.");
  }
  await db.transaction("rw", db.intentos, db.preguntas, async () => {
    await db.intentos.bulkPut(intentos);
    await db.preguntas.bulkPut(preguntas);
  });
  return `Restaurados ${intentos.length} intentos y ${preguntas.length} preguntas importadas.`;
}
