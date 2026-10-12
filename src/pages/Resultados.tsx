import { Link, Navigate } from "react-router";
import { Button } from "@/components/ui/button";
import { urlImagen } from "@/lib/imagen";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { config } from "@/data/banco";
import { corregir } from "@/domain/corregir";
import { compararTemas } from "@/lib/temas";
import { useExamen } from "@/store/examen";

const LETRAS = "ABCD";
const formato = (n: number) => n.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function Resultados() {
  const { preguntas, respuestas, limpiar } = useExamen();
  if (preguntas.length === 0) return <Navigate to="/" />;

  const r = corregir(preguntas, respuestas, config.puntosAcierto, config.divisorFallo);

  // Aciertos por tema
  const porTema = new Map<string, { total: number; ok: number }>();
  preguntas.forEach((p, i) => {
    const t = porTema.get(p.tema) ?? { total: 0, ok: 0 };
    t.total++;
    if (respuestas[i] === p.correcta) t.ok++;
    porTema.set(p.tema, t);
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4">
      <Card>
        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">Nota</p>
          <p className="text-5xl font-semibold tabular-nums">{formato(r.nota)}</p>
          <p className="text-sm text-muted-foreground">sobre {formato(preguntas.length * config.puntosAcierto)}</p>
          <div className="grid grid-cols-3 gap-2 tabular-nums">
            <div className="rounded-md bg-green-600/10 p-3">
              <p className="text-2xl font-semibold text-green-700 dark:text-green-400">{r.aciertos}</p>
              <p className="text-sm">Aciertos</p>
            </div>
            <div className="rounded-md bg-red-600/10 p-3">
              <p className="text-2xl font-semibold text-red-700 dark:text-red-400">{r.fallos}</p>
              <p className="text-sm">Fallos</p>
            </div>
            <div className="rounded-md bg-muted p-3">
              <p className="text-2xl font-semibold">{r.blancos}</p>
              <p className="text-sm">En blanco</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Por tema</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm tabular-nums">
            <thead className="text-left text-muted-foreground">
              <tr>
                <th className="py-1 font-medium">Tema</th>
                <th className="py-1 font-medium">Preguntas</th>
                <th className="py-1 font-medium">Aciertos</th>
                <th className="py-1 font-medium">%</th>
              </tr>
            </thead>
            <tbody>
              {[...porTema].sort(([a], [b]) => compararTemas(a, b)).map(([tema, t]) => (
                <tr key={tema} className="border-t">
                  <td className="py-1">{tema}</td>
                  <td className="py-1">{t.total}</td>
                  <td className="py-1">{t.ok}</td>
                  <td className="py-1">{Math.round((t.ok / t.total) * 100)} %</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold">Revisión</h2>
      {preguntas.map((p, i) => {
        const elegida = respuestas[i];
        return (
          <Card key={p.id + i}>
            <CardContent className="space-y-3">
              <p className="whitespace-pre-line">
                <span className="font-semibold">{i + 1}.</span> {p.enunciado}
              </p>
              {p.imagen && (
                <img src={urlImagen(p.imagen)} alt="Figura de la pregunta" className="mx-auto max-h-60" />
              )}
              <ul className="space-y-1">
                {p.opciones.map((o, k) => {
                  const esCorrecta = k === p.correcta;
                  const esFallo = k === elegida && !esCorrecta;
                  return (
                    <li
                      key={k}
                      className={[
                        "rounded-md border p-2 text-sm",
                        esCorrecta && "border-green-600 bg-green-600/10",
                        esFallo && "border-red-600 bg-red-600/10",
                      ].filter(Boolean).join(" ")}
                    >
                      {LETRAS[k]}) {o}
                      {k === elegida && <span className="ml-2 font-medium">← tu respuesta</span>}
                    </li>
                  );
                })}
              </ul>
              {elegida === null && <p className="text-sm text-muted-foreground">La dejaste en blanco.</p>}
              {p.explicacion && <p className="text-sm text-muted-foreground">{p.explicacion}</p>}
            </CardContent>
          </Card>
        );
      })}

      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <Link to="/configurar" onClick={limpiar}>Nuevo examen</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/" onClick={limpiar}>Volver al inicio</Link>
        </Button>
      </div>
    </div>
  );
}
