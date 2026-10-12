import { z } from "zod";

export const PreguntaSchema = z.object({
    id: z.string().min(1),                              // "E37-P12"
    tema: z.string().min(1),                            // "t03"
    enunciado: z.string().min(1),
    imagen: z.string().optional(),                      // "img/Examen37_P12_pag261.png"
    opciones: z.array(z.string().min(1)).length(4),
    correcta: z.number().int().min(0).max(3),           // índice: 0 = A … 3 = D
    explicacion: z.string().optional(),
    origen: z
        .object({ examen: z.number(), pregunta: z.number(), paginaPdf: z.number() })
        .partial()
        .optional(),
});

export const BancoSchema = z.array(PreguntaSchema);
export type Pregunta = z.infer<typeof PreguntaSchema>;
export type Respuesta = number | null;        // null = en blanco