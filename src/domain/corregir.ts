import type { Pregunta, Respuesta } from "./pregunta";

export type Resultado = { aciertos: number; fallos: number; blancos: number; nota: number };

export function corregir(
  preguntas: Pregunta[],
  respuestas: Respuesta[],
  acierto = 0.5,
  divisorFallo = 3,
): Resultado {
  const fallo = -acierto / divisorFallo; // −0,5/3 = −0,1667
  let aciertos = 0, fallos = 0, blancos = 0;
  preguntas.forEach((p, i) => {
    const r = respuestas[i];
    if (r === null || r === undefined) blancos++;
    else if (r === p.correcta) aciertos++;
    else fallos++;
  });
  const nota = aciertos * acierto + fallos * fallo;
  return { aciertos, fallos, blancos, nota: Math.round(nota * 100) / 100 };
}