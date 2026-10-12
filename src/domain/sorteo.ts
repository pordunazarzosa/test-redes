import type { Pregunta } from "./pregunta";

export function barajar<T>(lista: T[], aleatorio: () => number = Math.random): T[] {
  const a = [...lista];
  for (let i = a.length - 1; i > 0; i--) {       // Fisher–Yates
    const j = Math.floor(aleatorio() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * pesos: cantidades o porcentajes por tema → nº de preguntas por tema que suman `total`.
 *
 * Cada tema recibe primero la parte entera que le toca. Las preguntas que sobran se sortean:
 * un tema con 0,44 preguntas «de derecho» recibe una extra en el 44 % de los exámenes.
 * Así hasta los temas con menos peso salen alguna vez y, a la larga, se respetan los porcentajes.
 * (Técnica: muestreo sistemático sobre las partes decimales.)
 */
export function repartirCupos(
  pesos: Record<string, number>,
  total: number,
  aleatorio: () => number = Math.random,
): Record<string, number> {
  const suma = Object.values(pesos).reduce((s, v) => s + v, 0);
  const exactos = Object.entries(pesos).map(([tema, v]) => ({ tema, v: (v / suma) * total }));
  const cupos: Record<string, number> = Object.fromEntries(exactos.map((e) => [e.tema, Math.floor(e.v)]));
  const sobran = total - Object.values(cupos).reduce((s, v) => s + v, 0);

  // Partes decimales en orden aleatorio, colocadas una detrás de otra en una recta.
  // Se elige un punto de partida al azar y se toman `sobran` puntos separados 1 unidad:
  // el tema en cuyo tramo cae cada punto se lleva una pregunta extra.
  const restos = barajar(exactos, aleatorio).map((e) => ({ tema: e.tema, r: e.v - Math.floor(e.v) }));
  let punto = aleatorio();
  let acumulado = 0;
  let repartidas = 0;
  for (const { tema, r } of restos) {
    acumulado += r;
    if (repartidas < sobran && punto < acumulado) {
      cupos[tema]++;
      repartidas++;
      punto++;
    }
  }
  // Por si el redondeo con decimales deja alguna sin repartir
  for (const { tema } of [...restos].sort((a, b) => b.r - a.r)) {
    if (repartidas >= sobran) break;
    if (cupos[tema] === Math.floor((pesos[tema] / suma) * total)) {
      cupos[tema]++;
      repartidas++;
    }
  }
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