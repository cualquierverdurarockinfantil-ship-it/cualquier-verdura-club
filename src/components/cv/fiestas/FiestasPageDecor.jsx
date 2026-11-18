import { useEffect, useRef, useState } from "react";
import { FIESTAS_VEG, FIESTAS_KIDS } from "@/lib/fiestas";

/**
 * Stickers de fiestas en los márgenes de TODAS las páginas (menos la Home, que tiene los suyos).
 * Va detrás del contenido (z-index -1), no se puede tocar y se reparte a lo largo de toda la página:
 * verduras y chicos con gorro, arbolitos decorados, renos, trineo, regalos, pan dulce y esferas.
 */
const O = "/assets/fiestas/orn/";
const POOL = [
  { src: FIESTAS_VEG.tomate, s: 104, a: "rock" },
  { src: O + "arbolito.svg", s: 92, a: "breathe" },
  { src: FIESTAS_KIDS.nio3, s: 112, a: "float" },
  { src: O + "regalo.svg", s: 66, a: "float" },
  { src: O + "reno.svg", s: 88, a: "rock" },
  { src: FIESTAS_VEG.berenjena, s: 100, a: "float" },
  { src: O + "trineo.svg", s: 122, a: "breathe" },
  { src: FIESTAS_KIDS.nio1, s: 112, a: "float" },
  { src: O + "esfera-roja.svg", s: 58, a: "float" },
  { src: O + "arbolito.svg", s: 84, a: "rock" },
  { src: FIESTAS_VEG.brocoli, s: 96, a: "breathe" },
  { src: O + "pan-dulce.svg", s: 70, a: "float" },
  { src: FIESTAS_KIDS.nio5, s: 108, a: "rock" },
  { src: O + "reno.svg", s: 80, a: "float" },
  { src: FIESTAS_VEG.calabaza, s: 92, a: "breathe" },
  { src: O + "regalo.svg", s: 62, a: "rock" },
];
const STEP = 520; // distancia vertical entre un sticker y el siguiente

export default function FiestasPageDecor() {
  const ref = useRef(null);
  const [h, setH] = useState(0);
  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return undefined;
    const measure = () => setH(el.scrollHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const n = Math.max(0, Math.floor((h - 360) / STEP));
  return (
    <div ref={ref} className="fi-decor" aria-hidden="true">
      {Array.from({ length: n }, (_, i) => {
        const p = POOL[i % POOL.length];
        const left = i % 2 === 0;
        return (
          <img
            key={i}
            src={p.src}
            alt=""
            draggable={false}
            className={`fi-decor-item fi-decor-${p.a}`}
            style={{
              top: 180 + i * STEP,
              [left ? "left" : "right"]: `calc(var(--fi-gut) * ${i % 3 === 0 ? 0.2 : 0.6} - 18px)`,
              width: `calc(${p.s}px * var(--fi-k))`,
              height: `calc(${p.s}px * var(--fi-k))`,
              animationDelay: `${-(i % 5)}s`,
            }}
          />
        );
      })}
    </div>
  );
}
