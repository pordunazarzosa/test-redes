import { describe, it, expect } from "vitest";
import { validarPreguntas } from "./importar";

const buena = {
  id: "P1",
  tema: "t01",
  enunciado: "¿2 + 2?",
  opciones: ["3", "4", "5", "Ninguna de las otras"],
  correcta: 1,
};

describe("validarPreguntas", () => {
  it("acepta una pregunta correcta", () => {
    const r = validarPreguntas([buena]);
    expect(r.validas).toHaveLength(1);
    expect(r.errores).toHaveLength(0);
  });
  it("rechaza 3 opciones y correcta vacía", () => {
    const r = validarPreguntas([{ ...buena, opciones: ["a", "b", "c"] }, { ...buena, id: "P2", correcta: null }]);
    expect(r.validas).toHaveLength(0);
    expect(r.errores).toHaveLength(2);
  });
  it("detecta ids repetidos", () => {
    const r = validarPreguntas([buena, buena]);
    expect(r.validas).toHaveLength(1);
    expect(r.errores[0]).toMatch(/repetido/);
  });
  it("exige una lista", () => {
    expect(validarPreguntas({ hola: 1 }).errores).toHaveLength(1);
  });
});
