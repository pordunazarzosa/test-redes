import { useEffect, useRef, useState } from "react";

export function useCuentaAtras(finEn: number | null, alAcabar: () => void) {
  const [restante, setRestante] = useState(() => (finEn ? Math.max(0, finEn - Date.now()) : 0));
  const callback = useRef(alAcabar);
  callback.current = alAcabar;

  useEffect(() => {
    if (!finEn) return;
    const tick = () => {
      const r = finEn - Date.now();
      setRestante(Math.max(0, r));
      if (r <= 0) { clearInterval(id); callback.current(); }
    };
    const id = setInterval(tick, 250);
    tick();
    return () => clearInterval(id);
  }, [finEn]);

  return restante; // milisegundos
}

export const mmss = (ms: number) => {
  const s = Math.ceil(ms / 1000);
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), seg = s % 60;
  return (h ? `${h}:` : "") + `${String(m).padStart(2, "0")}:${String(seg).padStart(2, "0")}`;
};