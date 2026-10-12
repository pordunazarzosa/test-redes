import { describe, it, expect } from "vitest";
import config from "@/content/examen.config.json";
import { barajarOpciones, repartirCupos } from "./sorteo";
import type { Pregunta } from "./pregunta";

const suma = (c: Record<string, number>) => Object.values(c).reduce((s, v) => s + v, 0);

describe("repartirCupos", () => {
  it("siempre reparte exactamente el total", () => {
    for (let i = 0; i < 1000; i++) expect(suma(repartirCupos(config.reparto, 20))).toBe(20);
  });

  it("con pesos exactos no sortea nada", () => {
    expect(repartirCupos({ a: 50, b: 30, c: 20 }, 20)).toEqual({ a: 10, b: 6, c: 4 });
  });

  it("los temas pequeños salen alguna vez y se respetan los porcentajes a la larga", () => {
    const veces = 20000;
    const acumulado: Record<string, number> = {};
    for (let i = 0; i < veces; i++) {
      for (const [tema, n] of Object.entries(repartirCupos(config.reparto, 20))) {
        acumulado[tema] = (acumulado[tema] ?? 0) + n;
      }
    }
    const totalPesos = suma(config.reparto);
    for (const [tema, peso] of Object.entries(config.reparto)) {
      const esperado = (peso / totalPesos) * 20; // preguntas por examen
      expect(acumulado[tema] / veces).toBeCloseTo(esperado, 1);
      expect(acumulado[tema]).toBeGreaterThan(0); // ningún tema queda fuera para siempre
    }
  });
});

describe("barajarOpciones", () => {
  it("la respuesta correcta sigue siendo la misma opción", () => {
    const p: Pregunta = { id: "x", tema: "t", enunciado: "?", opciones: ["a", "b", "c", "Ninguna de las otras"], correcta: 1 };
    for (let i = 0; i < 50; i++) {
      const q = barajarOpciones(p);
      expect(q.opciones[q.correcta]).toBe("b");
      expect(q.opciones[3]).toBe("Ninguna de las otras");
    }
  });
});
