import { Link, useNavigate } from "react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { errores } from "@/data/banco";
import { db } from "@/data/db";
import { useBanco } from "@/data/useBanco";
import { idsFalladas } from "@/domain/repaso";
import { barajar, barajarOpciones } from "@/domain/sorteo";
import { useExamen } from "@/store/examen";

const formatoNota = (n: number) => n.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function Inicio() {
  const navigate = useNavigate();
  const iniciar = useExamen((s) => s.iniciar);
  const { banco, numImportadas } = useBanco();
  const intentos = useLiveQuery(() => db.intentos.orderBy("fecha").reverse().toArray(), []) ?? [];

  // Resumen del progreso
  const simulacros = intentos.filter((i) => i.modo === "simulacro");
  const ultimos5 = simulacros.slice(0, 5);
  const media = ultimos5.length ? ultimos5.reduce((s, i) => s + i.nota, 0) / ultimos5.length : null;

  const porTema = new Map<string, { total: number; ok: number }>();
  for (const it of intentos) {
    for (const d of it.detalle) {
      const t = porTema.get(d.tema) ?? { total: 0, ok: 0 };
      t.total++;
      if (d.respuesta === d.correcta) t.ok++;
      porTema.set(d.tema, t);
    }
  }
  const temaFlojo = [...porTema]
    .map(([tema, t]) => ({ tema, pct: Math.round((t.ok / t.total) * 100) }))
    .sort((a, b) => a.pct - b.pct)[0];

  // Repaso de falladas (tarea 3.4)
  const falladas = new Set(idsFalladas(intentos));
  const paraRepasar = banco.filter((p) => falladas.has(p.id));

  function repasar() {
    iniciar(barajar(paraRepasar).map(barajarOpciones), null, "practica");
    navigate("/examen");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4">
      <h1 className="text-2xl font-semibold">Test Redes II</h1>
      <p className="text-muted-foreground">
        {banco.length} preguntas disponibles
        {numImportadas > 0 && ` (${numImportadas} importadas)`}.
      </p>

      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <Link to="/configurar">Nuevo examen</Link>
        </Button>
        <Button variant="outline" onClick={repasar} disabled={paraRepasar.length === 0}>
          Repasar falladas ({paraRepasar.length})
        </Button>
      </div>

      {intentos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tu progreso</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 tabular-nums sm:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Último examen</p>
              <p className="text-2xl font-semibold">{formatoNota(intentos[0].nota)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Media últimos {ultimos5.length || 5} simulacros</p>
              <p className="text-2xl font-semibold">{media === null ? "—" : formatoNota(media)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tema más flojo</p>
              <p className="text-2xl font-semibold">{temaFlojo ? `${temaFlojo.tema} · ${temaFlojo.pct} %` : "—"}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {errores.length > 0 && (
        <div className="rounded-md border border-destructive p-4 text-sm">
          <p className="font-medium">{errores.length} preguntas del proyecto con errores (no se usan):</p>
          <ul className="mt-2 list-disc pl-5">
            {errores.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
