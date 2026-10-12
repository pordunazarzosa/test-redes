import { leerMatriz } from "@/lib/matriz";

/** Texto de una opción. Si es una matriz "[a b ; c d]", la dibuja con corchetes como en el examen. */
export default function OpcionTexto({ texto }: { texto: string }) {
  const filas = leerMatriz(texto);
  if (!filas) return <span>{texto}</span>;

  return (
    <span role="img" aria-label={`Matriz ${texto}`} className="relative inline-block px-2.5 py-1 align-middle">
      {/* corchetes [ ] */}
      <span aria-hidden className="absolute inset-y-0 left-0 w-1.5 border-y-2 border-l-2 border-current" />
      <span aria-hidden className="absolute inset-y-0 right-0 w-1.5 border-y-2 border-r-2 border-current" />
      <span
        className="grid gap-x-4 gap-y-0.5 text-right font-mono tabular-nums"
        style={{ gridTemplateColumns: `repeat(${filas[0].length}, auto)` }}
      >
        {filas.flat().map((valor, i) => (
          <span key={i}>{valor}</span>
        ))}
      </span>
    </span>
  );
}
