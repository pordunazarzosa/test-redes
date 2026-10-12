import type { Pregunta } from "./pregunta";

export function barajar<T>(lista: T[]): T[] {
  const a = [...lista];
  for (let i = a.length - 1; i > 0; i--) {       // Fisher–Yates
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** pesos: cantidades o porcentajes por tema → nº de preguntas por tema que suman `total` */
export function repartirCupos(pesos: Record<string, number>, total: number): Record<string, number> {
  const suma = Object.values(pesos).reduce((s, v) => s + v, 0);
  const exactos = Object.entries(pesos).map(([tema, v]) => ({ tema, v: (v / suma) * total }));
  const cupos = Object.fromEntries(exactos.map((e) => [e.tema, Math.floor(e.v)]));
  const sobran = total - Object.values(cupos).reduce((s, v) => s + v, 0);
  exactos.sort((a, b) => (b.v % 1) - (a.v % 1));
  for (let i = 0; i < sobran; i++) cupos[exactos[i].tema]++;
  return cupos;
}

/** Mantiene al final opciones como «Ninguna de las otras» o «Todas las anteriores» */
const FIJA = /^(ninguna|todas)\b/i;
export function barajarOpciones(p: Pregunta): Pregunta {
  const fijarUltima = FIJA.test(p.opciones[3]);
  const orden = fijarUltima ? [...barajar([0, 1, 2]), 3] : barajar([0, 1, 2, 3]);
  return { ...p, opciones: orden.map((i) => p.opciones[i]), correcta: orden.indexOf(p.correcta) };
}

export function generarExamen(banco: Pregunta[], pesos: Record<string, number>, total = 20): Pregunta[] {
  const cupos = repartirCupos(pesos, total);
  const elegidas = Object.entries(cupos).flatMap(([tema, n]) =>
    barajar(banco.filter((p) => p.tema === tema)).slice(0, n),
  );
  // Si a un tema le faltan preguntas, completa con otras al azar
  const usadas = new Set(elegidas.map((p) => p.id));
  const relleno = barajar(banco.filter((p) => !usadas.has(p.id))).slice(0, total - elegidas.length);
  return barajar([...elegidas, ...relleno]).map(barajarOpciones);
}