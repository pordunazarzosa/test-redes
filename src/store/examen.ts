import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Pregunta, Respuesta } from "@/domain/pregunta";

export type Modo = "simulacro" | "practica";

type EstadoExamen = {
  modo: Modo;
  preguntas: Pregunta[];
  respuestas: Respuesta[];
  marcadas: boolean[];
  actual: number;
  inicio: number | null;
  finEn: number | null;               // hora (ms) en que se acaba; null = sin tiempo
  iniciar: (ps: Pregunta[], minutos: number | null, modo: Modo) => void;
  responder: (i: number, r: Respuesta) => void;
  marcar: (i: number) => void;
  ir: (i: number) => void;
  limpiar: () => void;
};

const vacio = { preguntas: [], respuestas: [], marcadas: [], actual: 0, inicio: null, finEn: null };

export const useExamen = create<EstadoExamen>()(
  persist(
    (set) => ({
      modo: "simulacro",
      ...vacio,
      iniciar: (ps, minutos, modo) =>
        set({
          modo,
          preguntas: ps,
          respuestas: ps.map(() => null),
          marcadas: ps.map(() => false),
          actual: 0,
          inicio: Date.now(),
          finEn: minutos ? Date.now() + minutos * 60_000 : null,
        }),
      responder: (i, r) => set((s) => ({ respuestas: s.respuestas.map((x, k) => (k === i ? r : x)) })),
      marcar: (i) => set((s) => ({ marcadas: s.marcadas.map((x, k) => (k === i ? !x : x)) })),
      ir: (i) => set({ actual: i }),
      limpiar: () => set(vacio),
    }),
    { name: "examen-en-curso" },        // se guarda en localStorage automáticamente
  ),
);