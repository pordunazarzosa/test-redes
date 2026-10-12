import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { analizarArchivo, borrarImportadas, guardarPreguntas, type Analisis } from "@/data/importar";
import { useBanco } from "@/data/useBanco";

const MAX_ERRORES = 50;

const EJEMPLO = `[
  {
    "id": "E01-P04",
    "tema": "t01",
    "enunciado": "¿Cuántos bits caben en un canal…?",
    "imagen": "img/figura.png",
    "opciones": ["1000 bits", "2000 bits", "3000 bits", "20000 bits"],
    "correcta": 1,
    "explicacion": "Opcional"
  }
]`;

export default function Importar() {
  const { numImportadas } = useBanco();
  const [archivo, setArchivo] = useState<string | null>(null);
  const [analisis, setAnalisis] = useState<Analisis | null>(null);
  const [leyendo, setLeyendo] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [encima, setEncima] = useState(false);
  const [confirmarBorrado, setConfirmarBorrado] = useState(false);

  async function procesar(f: File | undefined) {
    if (!f) return;
    setArchivo(f.name);
    setMensaje(null);
    setAnalisis(null);
    setLeyendo(true);
    setAnalisis(await analizarArchivo(f));
    setLeyendo(false);
  }

  async function añadir() {
    if (!analisis) return;
    const n = await guardarPreguntas(analisis.validas);
    setMensaje(`Añadidas ${n} preguntas. Ya aparecen en los exámenes.`);
    setAnalisis(null);
    setArchivo(null);
  }

  async function borrarTodas() {
    await borrarImportadas();
    setConfirmarBorrado(false);
    setMensaje("Preguntas importadas borradas.");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4">
      <h1 className="text-2xl font-semibold">Importar preguntas</h1>

      <Card>
        <CardHeader>
          <CardTitle>Elegir archivo</CardTitle>
          <CardDescription>
            Un <b>.json</b> con una lista de preguntas, o un <b>.zip</b> con <code>preguntas.json</code> y una carpeta{" "}
            <code>img/</code> con las imágenes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setEncima(true);
            }}
            onDragLeave={() => setEncima(false)}
            onDrop={(e) => {
              e.preventDefault();
              setEncima(false);
              void procesar(e.dataTransfer.files[0]);
            }}
            className={
              "flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed p-8 text-center text-sm " +
              (encima ? "border-primary bg-muted" : "border-muted-foreground/30")
            }
          >
            <span className="font-medium">Arrastra aquí el archivo o pulsa para elegirlo</span>
            <span className="text-muted-foreground">{archivo ?? ".json o .zip"}</span>
            <input
              type="file"
              accept=".json,.zip"
              className="sr-only"
              onChange={(e) => {
                void procesar(e.target.files?.[0]);
                e.target.value = ""; // permite volver a elegir el mismo archivo
              }}
            />
          </label>

          <details className="text-sm">
            <summary className="cursor-pointer text-muted-foreground">Ver formato de cada pregunta</summary>
            <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-3 text-xs">{EJEMPLO}</pre>
            <p className="mt-2 text-muted-foreground">
              <code>correcta</code> es la posición de la opción buena: 0 = A, 1 = B, 2 = C, 3 = D. <code>imagen</code> y{" "}
              <code>explicacion</code> son opcionales.
            </p>
          </details>

          {leyendo && <p className="text-sm text-muted-foreground">Leyendo y validando…</p>}
          {mensaje && <p className="rounded-md bg-green-600/10 p-3 text-sm">{mensaje}</p>}
        </CardContent>
      </Card>

      {analisis && (
        <Card>
          <CardHeader>
            <CardTitle>
              {analisis.validas.length} de {analisis.total} preguntas válidas
            </CardTitle>
            {analisis.errores.length > 0 && (
              <CardDescription>
                {analisis.errores.length} no se añadirán. Corrígelas en el archivo y vuelve a importarlo.
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {analisis.errores.length > 0 && (
              <ul className="max-h-72 list-disc space-y-1 overflow-y-auto rounded-md border border-destructive/50 p-3 pl-7 text-sm">
                {analisis.errores.slice(0, MAX_ERRORES).map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
                {analisis.errores.length > MAX_ERRORES && (
                  <li className="text-muted-foreground">…y {analisis.errores.length - MAX_ERRORES} más.</li>
                )}
              </ul>
            )}
            <div className="flex flex-wrap gap-2">
              <Button onClick={añadir} disabled={analisis.validas.length === 0}>
                Añadir {analisis.validas.length} preguntas
              </Button>
              <Button variant="outline" onClick={() => setAnalisis(null)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Preguntas importadas: {numImportadas}</CardTitle>
          <CardDescription>Se guardan en este navegador. Las del proyecto no se pueden borrar desde aquí.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2">
          {!confirmarBorrado ? (
            <Button variant="outline" disabled={numImportadas === 0} onClick={() => setConfirmarBorrado(true)}>
              Borrar las importadas
            </Button>
          ) : (
            <>
              <span className="text-sm">¿Borrar las {numImportadas} preguntas importadas?</span>
              <Button variant="destructive" onClick={borrarTodas}>
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
