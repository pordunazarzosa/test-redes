import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { config } from "@/data/banco";
import { useBanco } from "@/data/useBanco";
import { barajar, barajarOpciones, generarExamen } from "@/domain/sorteo";
import { compararTemas } from "@/lib/temas";
import { useExamen } from "@/store/examen";

export default function Configurar() {
  const navigate = useNavigate();
  const iniciar = useExamen((s) => s.iniciar);
  const [minutos, setMinutos] = useState(config.minutosPorDefecto);
  const { banco } = useBanco(); // preguntas del proyecto + importadas

  // Modo práctica
  const temas = useMemo(() => [...new Set(banco.map((p) => p.tema))].sort(compararTemas), [banco]);
  const [elegidos, setElegidos] = useState<string[]>([]);
  const [cuantas, setCuantas] = useState(10);
  const [conTiempo, setConTiempo] = useState(false);
  const disponibles = banco.filter((p) => elegidos.includes(p.tema)).length;

  function empezarSimulacro() {
    const ps = generarExamen(banco, config.reparto, config.numPreguntas);
    iniciar(ps, minutos, "simulacro");
    navigate("/examen");
  }

  function empezarPractica() {
    const ps = barajar(banco.filter((p) => elegidos.includes(p.tema)))
      .slice(0, cuantas)
      .map(barajarOpciones);
    iniciar(ps, conTiempo ? minutos : null, "practica");
    navigate("/examen");
  }

  function alternarTema(tema: string, marcado: boolean) {
    setElegidos((lista) => (marcado ? [...lista, tema] : lista.filter((t) => t !== tema)));
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4">
      <h1 className="text-2xl font-semibold">Nuevo examen</h1>

      <Card>
        <CardHeader>
          <CardTitle>Tiempo</CardTitle>
          <CardDescription>Máximo {config.minutosMax} minutos.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Slider min={5} max={config.minutosMax} step={5} value={[minutos]} onValueChange={([v]) => setMinutos(v)} />
          <p className="tabular-nums">{minutos} min</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Simulacro</CardTitle>
          <CardDescription>
            {config.numPreguntas} preguntas repartidas por tema. Acierto +{config.puntosAcierto}, fallo −
            {(config.puntosAcierto / config.divisorFallo).toFixed(4)}, en blanco 0.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={empezarSimulacro} disabled={banco.length === 0}>
            Empezar simulacro
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Práctica por temas</CardTitle>
          <CardDescription>Corrección inmediata al responder.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-2">
            {temas.map((t) => (
              <label key={t} className="flex cursor-pointer items-center gap-2">
                <Checkbox checked={elegidos.includes(t)} onCheckedChange={(v) => alternarTema(t, v === true)} />
                {t} ({banco.filter((p) => p.tema === t).length})
              </label>
            ))}
          </div>

          <label className="flex items-center gap-2">
            Número de preguntas
            <input
              type="number"
              min={1}
              max={Math.max(1, disponibles)}
              value={cuantas}
              onChange={(e) => setCuantas(Math.max(1, Number(e.target.value)))}
              className="w-20 rounded-md border bg-transparent px-2 py-1"
            />
            <span className="text-sm text-muted-foreground">({disponibles} disponibles)</span>
          </label>

          <label className="flex cursor-pointer items-center gap-2">
            <Checkbox checked={conTiempo} onCheckedChange={(v) => setConTiempo(v === true)} />
            Con temporizador
          </label>

          <Button onClick={empezarPractica} disabled={disponibles === 0}>
            Empezar práctica
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
