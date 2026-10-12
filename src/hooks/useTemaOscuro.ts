import { useSyncExternalStore } from "react";

// Vigila la clase "dark" del <html>, que es la que pone aplicarTema()
function suscribir(avisar: () => void) {
  const observador = new MutationObserver(avisar);
  observador.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observador.disconnect();
}

/** true si la app está en tema oscuro. Se actualiza solo al cambiar de tema. */
export function useTemaOscuro(): boolean {
  return useSyncExternalStore(suscribir, () => document.documentElement.classList.contains("dark"));
}
