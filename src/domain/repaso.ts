type IntentoResumido = {
  fecha: number;
  detalle: { preguntaId: string; respuesta: number | null; correcta: number }[];
};

/**
 * Ids de las preguntas que fallaste la última vez que las respondiste.
 * Las dejadas en blanco no cuentan: se mira la respuesta anterior.
 */
export function idsFalladas(intentos: IntentoResumido[]): string[] {
  const fallo = new Map<string, boolean>(); // id → ¿la última respuesta fue un fallo?
  const recientesPrimero = [...intentos].sort((a, b) => b.fecha - a.fecha);
  for (const intento of recientesPrimero) {
    for (const d of intento.detalle) {
      if (fallo.has(d.preguntaId) || d.respuesta === null) continue;
      fallo.set(d.preguntaId, d.respuesta !== d.correcta);
    }
  }
  return [...fallo].filter(([, fallada]) => fallada).map(([id]) => id);
}
