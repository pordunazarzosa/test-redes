import { useRef } from "react";
import { Navigate, useNavigate } from "react-router";
import { useExamen } from "@/store/examen";
import { config } from "@/data/banco";
import { db } from "@/data/db";
import { corregir } from "@/domain/corregir";
import { useCuentaAtras, mmss } from "@/hooks/useCuentaAtras";
import { Button } from "@/components/ui/button";
import ImagenPregunta from "@/components/ImagenPregunta";
import OpcionTexto from "@/components/OpcionTexto";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const LETRAS = "ABCD";

export default function Examen() {
  const { modo, preguntas, respuestas, marcadas, actual, inicio, finEn, responder, marcar, ir } = useExamen();
  const navigate = useNavigate();
  const entregado = useRef(false); // evita guardar dos veces (botón + fin del tiempo)

  // Guarda el intento en la base de datos (tarea 3.1) y va a resultados
  async function entregar() {
    if (entregado.current) return;
    entregado.current = true;
    const r = corregir(preguntas, respuestas, config.puntosAcierto, config.divisorFallo);
    try {
      await db.intentos.add({
        fecha: Date.now(),
        modo,
        ...r,
        duracionSeg: inicio ? Math.round((Date.now() - inicio) / 1000) : 0,
        detalle: preguntas.map((p, i) => ({
          preguntaId: p.id,
          tema: p.tema,
          respuesta: respuestas[i],
          correcta: p.correcta,
        })),
      });
    } catch (e) {
      console.error("No se pudo guardar el intento", e);
    }
    navigate("/resultados");
  }

  const restante = useCuentaAtras(finEn, entregar);
  const p = preguntas[actual];
  if (!p) return <Navigate to="/configurar" />;

  const elegida = respuestas[actual];
  // En práctica, la pregunta se corrige en cuanto se responde
  const corregida = modo === "practica" && elegida !== null;
  const esUltima = actual === preguntas.length - 1;

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4">
      <header className="flex items-center justify-between">
        <span>
          {modo === "practica" ? "Práctica" : "Simulacro"} · Pregunta {actual + 1} de {preguntas.length}
        </span>
        {finEn && (
          <span className={"font-mono tabular-nums" + (restante < 5 * 60_000 ? " text-red-600 dark:text-red-400" : "")}>
            {mmss(restante)}
          </span>
        )}
      </header>

      <Card className="space-y-4 p-6">
        <p className="whitespace-pre-line">{p.enunciado}</p>
        {p.imagen && <ImagenPregunta key={p.imagen} imagen={p.imagen} className="mx-auto max-h-80" />}

        <RadioGroup
          value={elegida?.toString() ?? ""}
          onValueChange={(v) => responder(actual, Number(v))}
          disabled={corregida}
        >
          {p.opciones.map((o, i) => (
            <label
              key={i}
              className={[
                "flex items-center gap-3 rounded-md border p-3",
                corregida ? "cursor-default" : "cursor-pointer",
                corregida && i === p.correcta && "border-green-600 bg-green-600/10",
                corregida && i === elegida && i !== p.correcta && "border-red-600 bg-red-600/10",
              ].filter(Boolean).join(" ")}
            >
              <RadioGroupItem value={String(i)} />
              <span className="flex items-center gap-2">
                {LETRAS[i]}) <OpcionTexto texto={o} />
              </span>
            </label>
          ))}
        </RadioGroup>

        {corregida && (
          <div className="space-y-1 rounded-md bg-muted p-3 text-sm">
            <p className="font-medium">
              {elegida === p.correcta ? "¡Correcto!" : `Incorrecto. La respuesta correcta es la ${LETRAS[p.correcta]}.`}
            </p>
            {p.explicacion && <p className="text-muted-foreground">{p.explicacion}</p>}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {!corregida && (
            <Button variant="outline" onClick={() => responder(actual, null)}>Dejar en blanco</Button>
          )}
          <Button variant="outline" onClick={() => marcar(actual)}>
            {marcadas[actual] ? "Quitar marca" : "Marcar para revisar"}
          </Button>
          {!esUltima && (
            <Button variant="outline" onClick={() => ir(actual + 1)}>Siguiente</Button>
          )}
          <Button className="ml-auto" onClick={entregar}>
            {modo === "practica" ? "Terminar" : "Entregar"}
          </Button>
        </div>
      </Card>

      <nav className="grid grid-cols-5 gap-2 sm:grid-cols-10" aria-label="Preguntas">
        {preguntas.map((q, i) => {
          const r = respuestas[i];
          const enPractica = modo === "practica" && r !== null;
          return (
            <button
              key={i}
              onClick={() => ir(i)}
              className={[
                "h-10 rounded-md border text-sm tabular-nums",
                i === actual && "ring-2 ring-primary",
                !enPractica && r !== null && "bg-primary text-primary-foreground",
                enPractica && r === q.correcta && "bg-green-600 text-white",
                enPractica && r !== q.correcta && "bg-red-600 text-white",
                marcadas[i] && "border-amber-500",
              ].filter(Boolean).join(" ")}
            >
              {i + 1}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
