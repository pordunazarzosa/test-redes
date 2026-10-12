import { Navigate, useNavigate } from "react-router";
import { useExamen } from "@/store/examen";
import { useCuentaAtras, mmss } from "@/hooks/useCuentaAtras";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Examen() {
  const { preguntas, respuestas, marcadas, actual, finEn, responder, marcar, ir } = useExamen();
  const navigate = useNavigate();
  const entregar = () => navigate("/resultados");
  const restante = useCuentaAtras(finEn, entregar);
  const p = preguntas[actual];
  if (!p) return <Navigate to="/configurar" />;

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4">
      <header className="flex items-center justify-between">
        <span>Pregunta {actual + 1} de {preguntas.length}</span>
        {finEn && <span className="font-mono tabular-nums">{mmss(restante)}</span>}
      </header>

      <Card className="space-y-4 p-6">
        <p className="whitespace-pre-line">{p.enunciado}</p>
        {p.imagen && (
          <img src={import.meta.env.BASE_URL + p.imagen} alt="Figura de la pregunta" className="mx-auto max-h-80" />
        )}
        <RadioGroup value={respuestas[actual]?.toString() ?? ""} onValueChange={(v) => responder(actual, Number(v))}>
          {p.opciones.map((o, i) => (
            <label key={i} className="flex cursor-pointer items-center gap-3 rounded-md border p-3">
              <RadioGroupItem value={String(i)} />
              <span>{"ABCD"[i]}) {o}</span>
            </label>
          ))}
        </RadioGroup>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => responder(actual, null)}>Dejar en blanco</Button>
          <Button variant="outline" onClick={() => marcar(actual)}>
            {marcadas[actual] ? "Quitar marca" : "Marcar para revisar"}
          </Button>
          <Button className="ml-auto" onClick={entregar}>Entregar</Button>
        </div>
      </Card>

      <nav className="grid grid-cols-5 gap-2 sm:grid-cols-10" aria-label="Preguntas">
        {preguntas.map((_, i) => (
          <button
            key={i}
            onClick={() => ir(i)}
            className={[
              "h-10 rounded-md border text-sm tabular-nums",
              i === actual && "ring-2 ring-primary",
              respuestas[i] !== null && "bg-primary text-primary-foreground",
              marcadas[i] && "border-amber-500",
            ].filter(Boolean).join(" ")}
          >
            {i + 1}
          </button>
        ))}
      </nav>
    </div>
  );
}