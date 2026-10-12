import { describe, it, expect } from "vitest";
import { idsFalladas } from "./repaso";

const d = (preguntaId: string, respuesta: number | null, correcta = 0) => ({ preguntaId, respuesta, correcta });

describe("idsFalladas", () => {
  it("devuelve las falladas en el último intento", () => {
    const intentos = [{ fecha: 1, detalle: [d("a", 0), d("b", 2), d("c", 3)] }];
    expect(idsFalladas(intentos).sort()).toEqual(["b", "c"]);
  });
  it("si luego la aciertas, ya no sale", () => {
    const intentos = [
      { fecha: 1, detalle: [d("a", 2)] },
      { fecha: 2, detalle: [d("a", 0)] },
    ];
    expect(idsFalladas(intentos)).toEqual([]);
  });
  it("en blanco no cuenta: mira la respuesta anterior", () => {
    const intentos = [
      { fecha: 1, detalle: [d("a", 2)] },
      { fecha: 2, detalle: [d("a", null)] },
    ];
    expect(idsFalladas(intentos)).toEqual(["a"]);
  });
});
