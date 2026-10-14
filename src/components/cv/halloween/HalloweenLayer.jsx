import { useEffect, useMemo, useState } from "react";
import "./halloween.css";
import { Bat, Bolt, Garland, Spider, Web } from "./HalloweenArt";

/**
 * Capa fija de efectos Halloween (no se puede tocar, no tapa nada):
 * guirnalda + telarañas con arañas colgando + murciélagos + rayos suaves.
 * Se monta una sola vez en Layout.jsx, solo cuando el tema está activo.
 */

const BATS = [
  { top: "14%", size: 54, dur: 34, delay: -6 },
  { top: "34%", size: 40, dur: 46, delay: -24 },
  { top: "62%", size: 46, dur: 40, delay: -14 },
];

function prefersReducedMotion() {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

/** Rayo: un destello suave cada 18–40 s, nunca seguido, y se saltea si la pestaña está oculta. */
function Lightning() {
  const [flash, setFlash] = useState(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    let timer;
    const schedule = (first) => {
      const wait = first ? 7000 + Math.random() * 6000 : 18000 + Math.random() * 22000;
      timer = setTimeout(() => {
        if (!document.hidden) {
          setFlash({ id: Date.now(), x: 12 + Math.random() * 76 });
        }
        schedule(false);
      }, wait);
    };
    schedule(true);
    return () => clearTimeout(timer);
  }, []);

  if (!flash) return null;
  return (
    <div key={flash.id} onAnimationEnd={(e) => e.target.classList.contains("hw-flash") && setFlash(null)}>
      <div className="hw-flash" style={{ "--fx": `${flash.x}%` }} />
      <Bolt className="hw-bolt" style={{ left: `${flash.x}%` }} />
    </div>
  );
}

function HangingSpider({ side, offset, len, delay, size }) {
  const pos = side === "left" ? { left: offset } : { right: offset };
  return (
    <div
      className="hw-spider-thread"
      style={{ ...pos, "--len": `${len}px`, animationDelay: `${delay}s`, width: size }}
    >
      <Spider className="hw-spider-body" style={{ width: size, height: "auto", animationDelay: `${delay}s` }} />
    </div>
  );
}

export default function HalloweenLayer() {
  const bats = useMemo(() => BATS, []);
  return (
    <div className="hw-layer" aria-hidden="true">
      {/* todo lo que cuelga arranca debajo de la navbar (64 px) */}
      <div className="absolute inset-x-0" style={{ top: 64 }}>
      {/* guirnalda bajo la navbar */}
      <Garland className="absolute left-0 top-0 w-full" style={{ opacity: 0.95, transform: "scaleY(0.72)", transformOrigin: "top" }} />

      {/* telarañas en los dos rincones */}
      <Web className="absolute left-0 top-0 w-[84px] sm:w-[120px] md:w-[150px]" />
      <Web className="absolute right-0 top-0 w-[84px] sm:w-[120px] md:w-[150px]" flip />

      {/* arañas que cuelgan y se balancean */}
      <HangingSpider side="left" offset={46} len={78} delay={0} size={30} />
      <HangingSpider side="right" offset={64} len={110} delay={-2.2} size={26} />

      </div>

      {/* murciélagos */}
      {bats.map((b, i) => (
        <div
          key={i}
          className="hw-bat"
          style={{ top: b.top, "--dur": `${b.dur}s`, "--delay": `${b.delay}s` }}
        >
          <Bat style={{ width: b.size, height: "auto" }} />
        </div>
      ))}

      <Lightning />
    </div>
  );
}
