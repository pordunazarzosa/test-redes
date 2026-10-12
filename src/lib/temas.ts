/** Ordena nombres de tema por su número: Tema 1, Tema 2 … Tema 10 (y no Tema 1, Tema 10, Tema 2…) */
export const compararTemas = (a: string, b: string) => a.localeCompare(b, "es", { numeric: true });
