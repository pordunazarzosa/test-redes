/**
 * Reconoce una matriz escrita como "[−1 −1 ; −1 1]" (filas separadas por «;»).
 * Devuelve sus filas, o null si el texto no es una matriz.
 */
export function leerMatriz(texto: string): string[][] | null {
  const m = /^\[(.+)\]$/.exec(texto.trim());
  if (!m || !m[1].includes(";")) return null;
  const filas = m[1].split(";").map((f) => f.trim().split(/\s+/));
  const columnas = filas[0].length;
  if (filas.length < 2 || columnas < 2 || filas.some((f) => f.length !== columnas || f.some((c) => !c))) return null;
  return filas;
}
