import { useState } from "react";
import { useTemaOscuro } from "@/hooks/useTemaOscuro";
import { nombreArchivo, urlImagen, versionOscura } from "@/lib/imagen";

type Props = { imagen: string; className?: string };

/**
 * Imagen de una pregunta.
 * - En tema oscuro usa la versión _dark si existe; si no, la normal (y lo indica en pequeño).
 * - Si la imagen no carga, muestra «Image not found: archivo».
 * Úsalo con key={imagen} para que se reinicie al cambiar de pregunta.
 */
export default function ImagenPregunta({ imagen, className }: Props) {
  const oscuro = useTemaOscuro();
  const [fallidas, setFallidas] = useState<string[]>([]); // URLs que no han cargado

  const normal = urlImagen(imagen);
  const rutaOscura = versionOscura(imagen);
  const oscura = rutaOscura ? urlImagen(rutaOscura) : null;

  const usarOscura = oscuro && oscura !== null && !fallidas.includes(oscura);
  const src = usarOscura ? oscura : normal;
  const noEncontrada = !usarOscura && fallidas.includes(normal);
  const faltaOscura = oscuro && oscura !== null && fallidas.includes(oscura) && !noEncontrada;

  return (
    <div className="space-y-1">
      {noEncontrada ? (
        <p className="rounded-md border border-dashed border-red-600 p-3 text-center text-sm text-red-700 dark:text-red-400">
          Image not found: {nombreArchivo(imagen)}
        </p>
      ) : (
        <img
          src={src}
          alt="Figura de la pregunta"
          className={className}
          onError={() => setFallidas((lista) => (lista.includes(src) ? lista : [...lista, src]))}
        />
      )}
      {faltaOscura && rutaOscura && (
        <p className="text-center text-xs text-muted-foreground">Dark image not found: {nombreArchivo(rutaOscura)}</p>
      )}
    </div>
  );
}
