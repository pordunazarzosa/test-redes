import { describe, it, expect } from "vitest";
import { corregir } from "./corregir";
import type { Pregunta } from "./pregunta";

const p = (correcta: number): Pregunta => ({ id: "x", tema: "t", enunciado: "?", opciones: ["a", "b", "c", "d"], correcta });
const veinte = Array.from({ length: 20 }, () => p(0));

describe("corregir", () => {
  it("20 aciertos = 10", () => {
    expect(corregir(veinte, veinte.map(() => 0)).nota).toBe(10);
  });
  it("en blanco no resta", () => {
    expect(corregir(veinte, veinte.map(() => null)).nota).toBe(0);
  });
  it("3 fallos anulan 1 acierto", () => {
    const r = [0, 1, 1, 1, ...Array(16).fill(null)];
    expect(corregir(veinte, r).nota).toBe(0);
  });
  it("10 aciertos, 6 fallos y 4 en blanco = 4", () => {
    const r = [...Array(10).fill(0), ...Array(6).fill(2), ...Array(4).fill(null)];
    expect(corregir(veinte, r)).toEqual({ aciertos: 10, fallos: 6, blancos: 4, nota: 4 });
  });
});