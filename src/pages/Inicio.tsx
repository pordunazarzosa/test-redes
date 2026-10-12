import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { bancoBase, errores } from "@/data/banco";

export default function Inicio() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4">
      <h1 className="text-2xl font-semibold">Test Redes II</h1>
      <p>{bancoBase.length} preguntas cargadas.</p>

      {errores.length > 0 && (
        <div className="rounded-md border border-destructive p-4 text-sm">
          <p className="font-medium">{errores.length} preguntas con errores (no se usan):</p>
          <ul className="mt-2 list-disc pl-5">
            {errores.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <Button asChild>
        <Link to="/configurar">Empezar</Link>
      </Button>
    </div>
  );
}
