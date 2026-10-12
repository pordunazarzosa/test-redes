import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { exportarCopia, importarCopia } from "@/data/copia";
import { db } from "@/data/db";
import { compararTemas } from "@/lib/temas";

const formatoNota = (n: number) => n.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const formatoFecha = (ms: number) => new Date(ms).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" });
const formatoDuracion = (s: number) => `${Math.floor(s / 60)} min ${s % 60} s`;

export default function Historial() {
  // useLiveQuery se actualiza solo cuando cambia la base de datos
  const intentos = useLiveQuery(() => db.intentos.orderBy("fecha").reverse().toArray(), []);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [confirmarBorrado, setConfirmarBorrado] = useState(false);
  if (!intentos) return null; // todavía cargando

  async function borrarHistorial() {
    await db.intentos.clear();
    setConfirmarBorrado(false);
    setMensaje("Historial borrado.");
  }

  async function restaurar(archivo: File | undefined) {
    if (!archivo) return;
    try {
      setMensaje(await importarCopia(archivo));
    } catch (e) {
      setMensaje(e instanceof Error ? e.message : "No se pudo leer la copia.");
    }
  }

  // Aciertos por tema sumando el detalle de todos los intentos
  const porTema = new Map<string, { total: number; ok: number }>();
  for (const it of intentos) {
    for (const d of it.detalle) {
      const t = porTema.get(d.tema) ?? { total: 0, ok: 0 };
      t.total++;
      if (d.respuesta === d.correcta) t.ok++;
      porTema.set(d.tema, t);
    }
  }
  const temas = [...porTema]
    .map(([tema, t]) => ({ tema, ...t, pct: Math.round((t.ok / t.total) * 100) }))
    .sort((a, b) => compararTemas(a.tema, b.tema)); // Tema 1, Tema 2 …

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4">
      <h1 className="text-2xl font-semibold">Historial</h1>

      {intentos.length === 0 ? (
        <p className="text-muted-foreground">Aún no has hecho ningún examen. Cuando entregues uno, aparecerá aquí.</p>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Aciertos por tema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {temas.map((t) => (
                <div key={t.tema} className="space-y-1">
                  <div className="flex justify-between text-sm tabular-nums">
                    <span>{t.tema}</span>
                    <span className="text-muted-foreground">
                      {t.ok}/{t.total} · {t.pct} %
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-primary" style={{ width: `${t.pct}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Intentos ({intentos.length})</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm tabular-nums">
                <thead className="text-left text-muted-foreground">
                  <tr>
                    <th className="py-1 pr-3 font-medium">Fecha</th>
                    <th className="py-1 pr-3 font-medium">Modo</th>
                    <th className="py-1 pr-3 font-medium">Nota</th>
                    <th className="py-1 pr-3 font-medium">✓ / ✗ / –</th>
                    <th className="py-1 font-medium">Duración</th>
                  </tr>
                </thead>
                <tbody>
                  {intentos.map((it) => (
                    <tr key={it.id} className="border-t">
                      <td className="py-1 pr-3">{formatoFecha(it.fecha)}</td>
                      <td className="py-1 pr-3">{it.modo === "simulacro" ? "Simulacro" : "Práctica"}</td>
                      <td className="py-1 pr-3 font-medium">{formatoNota(it.nota)}</td>
                      <td className="py-1 pr-3">
                        {it.aciertos} / {it.fallos} / {it.blancos}
                      </td>
                      <td className="py-1">{formatoDuracion(it.duracionSeg)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </>
      )}
      {/* Copia de seguridad (tarea 3.5) */}
      <Card>
        <CardHeader>
          <CardTitle>Copia de seguridad</CardTitle>
          <CardDescription>
            El historial y las preguntas importadas se guardan solo en este navegador. Exporta una copia de vez en
            cuando para no perderlos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => void exportarCopia()}>
              Exportar copia
            </Button>
            <Button variant="outline" asChild>
              <label className="cursor-pointer">
                Restaurar copia
                <input
                  type="file"
                  accept=".json"
                  className="sr-only"
                  onChange={(e) => {
                    void restaurar(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </label>
            </Button>
          </div>
          {mensaje && <p className="text-sm">{mensaje}</p>}
        </CardContent>
      </Card>

      {/* Borrar historial */}
      <Card>
        <CardHeader>
          <CardTitle>Borrar historial</CardTitle>
          <CardDescription>
            Elimina todos los intentos y las estadísticas. Las preguntas importadas no se borran. Si quieres conservar
            una copia, expórtala antes.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2">
          {!confirmarBorrado ? (
            <Button variant="outline" disabled={intentos.length === 0} onClick={() => setConfirmarBorrado(true)}>
              Borrar historial
            </Button>
          ) : (
            <>
              <span className="text-sm">¿Borrar los {intentos.length} intentos? No se puede deshacer.</span>
              <Button variant="destructive" onClick={borrarHistorial}>
                Sí, borrar
              </Button>
              <Button variant="outline" onClick={() => setConfirmarBorrado(false)}>
                Cancelar
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
