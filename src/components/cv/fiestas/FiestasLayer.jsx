import { useEffect, useMemo, useState } from "react";
import "./fiestas.css";
import { GarlandTile } from "./FiestasArt";

/**
 * Capa fija de efectos de Fiestas (no se puede tocar, no tapa nada):
 * guirnalda de luces de colores bajo la navbar + luciérnagas de noche de verano.
 * Se monta una sola vez en Layout.jsx, solo cuando el tema está activo.
 */

const FIREFLIES = [
  { left: "8%", top: "30%", dur: 17, delay: -3 },
  { left: "22%", top: "70%", dur: 21, delay: -9 },
  { left: "41%", top: "46%", dur: 19, delay: -14 },
  { left: "63%", top: "24%", dur: 23, delay: -5 },
  { left: "78%", top: "64%", dur: 18, delay: -11 },
  { left: "91%", top: "40%", dur: 22, delay: -7 },
];

export default function FiestasLayer({ isHome = false }) {
  const [tiles, setTiles] = useState(8);
  // en la Home la navbar aparece recién al bajar un poco: hasta entonces la guirnalda cuelga del borde de arriba
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const garlandTop = isHome && !scrolled ? 0 : 64;
  useEffect(() => {
    const calc = () => setTiles(Math.ceil(window.innerWidth / 160) + 1);
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);
  const arr = useMemo(() => Array.from({ length: tiles }, (_, i) => i), [tiles]);

  return (
    <div className="fi-layer" aria-hidden="true">
      {/* guirnalda bajo la navbar (64 px) */}
      <div className="fi-garland" style={{ top: garlandTop, transition: "top 0.3s ease-in-out" }}>
        {arr.map((i) => (
          <GarlandTile key={i} offset={i} style={{ width: 160, height: 54, flex: "0 0 160px" }} />
        ))}
      </div>

      {/* luciérnagas */}
      {FIREFLIES.map((f, i) => (
        <span key={i} className="fi-firefly" style={{ left: f.left, top: f.top, "--dur": `${f.dur}s`, "--delay": `${f.delay}s` }} />
      ))}
    </div>
  );
}
