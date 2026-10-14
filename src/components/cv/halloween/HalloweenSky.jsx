import { motion } from "framer-motion";
import { HALLOWEEN_VEG } from "@/lib/halloween";
import { Cat, Ghost, Hills, Moon, Sparkle } from "./HalloweenArt";

/**
 * Fondo de la Home en modo Halloween (reemplaza a <FloatingCharacters />).
 * 3 planos como pide el manual de marca:
 *   lejos: cielo + luna + estrellas · medio: colinas y árboles secos · cerca: verduras terror flotando
 * Todo con colores planos y contorno; no compite con el contenido (va detrás, z-0).
 */

const STARS = [
  [8, 8, 14], [22, 4, 10], [40, 10, 12], [58, 5, 9], [74, 12, 13], [92, 7, 10],
  [14, 26, 10], [34, 30, 8], [66, 24, 9], [88, 30, 12], [50, 18, 8], [4, 44, 9],
];

// x/y en %, size en px (máx), delay para que no se muevan todas juntas
const FLOATERS = [
  { id: "tomate", x: -4, y: 7, size: 112, anim: "rock", delay: 0 },
  { id: "brocoli", x: 82, y: 5, size: 104, anim: "float", delay: 1 },
  { id: "zanahoria", x: -3, y: 47, size: 92, anim: "breathe", delay: 0.5 },
  { id: "berenjena", x: 84, y: 45, size: 100, anim: "float", delay: 1.5 },
  { id: "choclo", x: 3, y: 74, size: 86, anim: "rock", delay: 0.8 },
  { id: "cebolla", x: 79, y: 72, size: 92, anim: "breathe", delay: 2 },
  { id: "calabaza", x: 58, y: 84, size: 78, anim: "float", delay: 1.2 },
  { id: "rabanito", x: 24, y: 86, size: 74, anim: "rock", delay: 0.3 },
];

const VARIANTS = {
  float: (d) => ({ y: [0, -16, 0], rotate: [-4, 4, -4], transition: { duration: 4 + d, repeat: Infinity, ease: "easeInOut" } }),
  rock: (d) => ({ rotate: [-9, 9, -9], y: [0, -7, 0], transition: { duration: 1.2 + d * 0.2, repeat: Infinity, ease: "easeInOut" } }),
  breathe: (d) => ({ scale: [1, 1.07, 1], rotate: [-2, 2, -2], transition: { duration: 3.5 + d, repeat: Infinity, ease: "easeInOut" } }),
};

export default function HalloweenSky() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true" style={{ background: "#1a0a2e" }}>
      {/* lejos: luna y estrellas */}
      <Moon className="absolute" style={{ left: "38%", top: "7%", width: "clamp(56px, 13vw, 110px)", height: "auto" }} />
      {STARS.map(([x, y, s], i) => (
        <Sparkle
          key={i}
          className="hw-twinkle absolute"
          style={{ left: `${x}%`, top: `${y}%`, width: s, height: s, animationDelay: `${(i % 5) * 0.6}s` }}
        />
      ))}
      <Ghost className="hw-drift absolute" style={{ left: "58%", top: "30%", width: 46, height: "auto", opacity: 0.85 }} />

      {/* medio: colinas */}
      <Hills className="absolute left-0 bottom-0 w-full" style={{ height: "clamp(120px, 22vh, 190px)" }} />
      <Cat className="absolute" style={{ left: "6%", bottom: "calc(clamp(120px, 22vh, 190px) * 0.34)", width: "clamp(48px, 12vw, 72px)", height: "auto" }} />

      {/* cerca: verduras terror */}
      {FLOATERS.map((f) => (
        <motion.img
          key={f.id}
          src={HALLOWEEN_VEG[f.id]}
          alt=""
          className="absolute select-none pointer-events-none object-contain"
          style={{ left: `${f.x}%`, top: `${f.y}%`, width: `clamp(${Math.round(f.size * 0.62)}px, ${f.size / 4}vw, ${f.size}px)`, opacity: 0.92, zIndex: 1 }}
          animate={VARIANTS[f.anim](f.delay)}
        />
      ))}
    </div>
  );
}
