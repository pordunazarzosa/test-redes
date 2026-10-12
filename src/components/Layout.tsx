import { useState } from "react";
import { NavLink, Outlet } from "react-router";
import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { aplicarTema, temaGuardado, type Tema } from "@/lib/tema";

const siguiente: Record<Tema, Tema> = { sistema: "claro", claro: "oscuro", oscuro: "sistema" };
const iconos = { claro: Sun, oscuro: Moon, sistema: Monitor };

const enlaces = [
  { to: "/", texto: "Inicio" },
  { to: "/configurar", texto: "Nuevo examen" },
  { to: "/historial", texto: "Historial" },
  { to: "/importar", texto: "Importar" },
];

export default function Layout() {
  const [tema, setTema] = useState<Tema>(temaGuardado);
  const Icono = iconos[tema];

  function cambiarTema() {
    const t = siguiente[tema];
    aplicarTema(t);
    setTema(t);
  }

  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-4 p-4">
          <span className="font-semibold">Test Redes II</span>
          <nav className="flex flex-wrap gap-1">
            {enlaces.map((e) => (
              <NavLink
                key={e.to}
                to={e.to}
                end={e.to === "/"}
                className={({ isActive }) =>
                  "rounded-md px-3 py-1.5 text-sm " +
                  (isActive ? "bg-muted font-medium" : "text-muted-foreground hover:text-foreground")
                }
              >
                {e.texto}
              </NavLink>
            ))}
          </nav>
          <Button variant="outline" size="sm" className="ml-auto" onClick={cambiarTema}>
            <Icono /> Tema: {tema}
          </Button>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
