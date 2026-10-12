export type Tema = "claro" | "oscuro" | "sistema";

export function aplicarTema(t: Tema) {
  const oscuro = t === "oscuro" || (t === "sistema" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", oscuro);
  localStorage.setItem("tema", t);
}

export const temaGuardado = (): Tema => (localStorage.getItem("tema") as Tema) ?? "sistema";