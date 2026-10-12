import { describe, it, expect } from "vitest";
import { leerMatriz } from "./matriz";

describe("leerMatriz", () => {
  it("reconoce una matriz 2x2", () => {
    expect(leerMatriz("[−1 −1 ; −1 1]")).toEqual([["−1", "−1"], ["−1", "1"]]);
  });
  it("no confunde texto normal ni tramas TDM", () => {
    expect(leerMatriz("Ninguna de las otras opciones es correcta")).toBeNull();
    expect(leerMatriz("[_ _ _ A]  [S _ _ Z]  [E _ E A]  [Y _ T T]")).toBeNull();
    expect(leerMatriz("[1 2 ; 3]")).toBeNull();
  });
});
