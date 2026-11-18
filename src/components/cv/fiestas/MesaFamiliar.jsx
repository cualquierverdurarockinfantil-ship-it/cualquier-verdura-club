import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FIESTAS_VEG, FIESTAS_KIDS } from "@/lib/fiestas";
import { GarlandTile } from "./FiestasArt";

/**
 * La mesa de Navidad del Club: toda la banda y los fans reunidos alrededor de una mesa larga,
 * festejando en familia. Se ven de la cintura para arriba (la mesa les tapa el resto).
 * Aparecen de a uno, asomando desde atrás de la mesa, y después se quedan saltando de alegría.
 * Se usa en la Home mientras dura el tema Fiestas (reemplaza a los 5 chicos que aparecían sueltos).
 */

const K = "#1a1a1a";

// [imagen, centro en % del ancho, bottom en % del alto, tamaño, capa]
//   tamaño: { w } = ancho en % del ancho  |  { h } = alto en % del alto
const CAST = [
  // fila del fondo
  [FIESTAS_VEG.tomate, 12, 59, { w: 21 }, 1],
  [FIESTAS_VEG.berenjena, 37, 61, { w: 19 }, 1],
  [FIESTAS_VEG.zanahoria, 63, 59, { w: 15 }, 1],
  [FIESTAS_VEG.brocoli, 88, 61, { w: 17 }, 1],
  // fila del medio
  [FIESTAS_VEG.cebolla, 21, 45, { w: 20 }, 2],
  [FIESTAS_VEG.choclo, 42, 44, { w: 15 }, 2],
  [FIESTAS_VEG.calabaza, 62, 45, { w: 21 }, 2],
  [FIESTAS_VEG.rabanito, 83, 44, { w: 19 }, 2],
  // fila de adelante: los chicos
  [FIESTAS_KIDS.nio1, 9, 22, { h: 33 }, 4],
  [FIESTAS_KIDS.nio2, 30, 22, { h: 33 }, 4],
  [FIESTAS_KIDS.nio3, 51, 22, { h: 35 }, 4],
  [FIESTAS_KIDS.nio4, 72, 22, { h: 33 }, 4],
  [FIESTAS_KIDS.nio5, 92, 22, { h: 33 }, 4],
];

const TOASTS = ["¡Salud! 🥂", "¡Feliz Navidad!", "¡Buen provecho!", "¡Felices fiestas!", "¡Que no falte el pan dulce!"];

function Character({ src, cx, bottom, size, z, i, reduce }) {
  const style = {
    position: "absolute",
    left: `${cx}%`,
    bottom: `${bottom}%`,
    zIndex: z,
    transform: "translateX(-50%)",
    ...(size.w ? { width: `${size.w}%`, height: "auto" } : { height: `${size.h}%`, width: "auto" }),
  };
  return (
    <div style={style}>
      <motion.div
        // asoma desde atrás de la mesa, de a uno
        initial={reduce ? false : { y: "70%", opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ type: "spring", stiffness: 140, damping: 14, delay: 0.15 + i * 0.16 }}
        style={{ height: "100%" }}
      >
        <motion.img
          src={src}
          alt=""
          draggable={false}
          className="block select-none"
          style={size.h ? { height: "100%", width: "auto" } : { width: "100%", height: "auto" }}
          // festejando: saltitos y movimientos de brindis
          animate={reduce ? undefined : { y: [0, -6 - (i % 3) * 2, 0], rotate: [-2.5, 2.5, -2.5] }}
          transition={{ duration: 1.5 + (i % 4) * 0.25, repeat: Infinity, ease: "easeInOut", delay: i * 0.13 }}
        />
      </motion.div>
    </div>
  );
}

/** la mesa vista de frente: mantel a cuadros, pan dulce, copas, velas y platos */
function Mesa() {
  return (
    <svg viewBox="0 0 400 104" className="absolute bottom-0 left-0 w-full block" style={{ zIndex: 5, overflow: "visible" }} aria-hidden="true" preserveAspectRatio="none">
      <defs>
        <pattern id="fi-mantel" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="#dc2626" />
          <rect width="10" height="20" fill="#fff" opacity=".22" />
          <rect width="20" height="10" fill="#fff" opacity=".22" />
        </pattern>
      </defs>
      {/* frente del mantel */}
      <path d="M0 42 H400 V104 H0 Z" fill="url(#fi-mantel)" stroke={K} strokeWidth="3" />
      <path d="M0 96 q10 8 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 V104 H0Z" fill="#b91c1c" stroke={K} strokeWidth="2" />
      {/* tapa de la mesa */}
      <path d="M0 42 L14 8 H386 L400 42 Z" fill="#fff7ed" stroke={K} strokeWidth="3" strokeLinejoin="round" />
      <rect x="26" y="20" width="348" height="12" rx="6" fill="#15803d" stroke={K} strokeWidth="2.4" />
      {/* platos */}
      {[58, 126, 274, 342].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy="27" rx="21" ry="7" fill="#fff" stroke={K} strokeWidth="2.4" />
          <ellipse cx={x} cy="26" rx="12" ry="4" fill="#fde68a" stroke={K} strokeWidth="1.6" />
        </g>
      ))}
      {/* fuente con ensalada */}
      <ellipse cx="164" cy="26" rx="18" ry="7" fill="#fff" stroke={K} strokeWidth="2.4" />
      <g stroke={K} strokeWidth="1.6">
        <circle cx="156" cy="22" r="4" fill="#ef4444" />
        <circle cx="164" cy="20" r="4" fill="#22c55e" />
        <circle cx="172" cy="22" r="4" fill="#facc15" />
      </g>
      {/* pan dulce al medio */}
      <image href="/assets/fiestas/orn/pan-dulce.svg" x="184" y="-22" width="32" height="32" />
      {/* copas y velas */}
      {[96, 296].map((x) => (
        <image key={x} href="/assets/fiestas/orn/copa.svg" x={x - 12} y="-8" width="24" height="24" />
      ))}
      {[232, 322].map((x) => (
        <image key={x} href="/assets/fiestas/orn/vela.svg" x={x - 11} y="-6" width="22" height="22" />
      ))}
    </svg>
  );
}

export default function MesaFamiliar() {
  const reduce = useReducedMotion();
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((v) => (v + 1) % TOASTS.length), 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="relative w-full mx-auto overflow-hidden rounded-3xl"
      style={{
        maxWidth: 760,
        aspectRatio: "1 / 0.86",
        background: "linear-gradient(#0b2545 0%, #12385e 55%, #14532d 100%)",
        border: "4px solid #1a1a1a",
        boxShadow: "8px 8px 0 #14532d",
      }}
    >
      {/* guirnalda de luces colgando del techo */}
      <div className="absolute left-0 right-0 top-0 flex overflow-hidden" style={{ zIndex: 6, opacity: 0.97 }} aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <GarlandTile key={i} offset={i} style={{ width: 160, height: 54, flex: "0 0 160px" }} />
        ))}
      </div>

      {/* destellos dorados de fondo */}
      {[[8, 30], [24, 20], [48, 14], [72, 26], [90, 18], [34, 38], [82, 40]].map(([x, y], i) => (
        <span key={i} className="absolute pointer-events-none" style={{ left: `${x}%`, top: `${y}%`, color: "#fde68a", fontSize: i % 2 ? 14 : 10, opacity: 0.7 }}>✦</span>
      ))}

      {CAST.map(([src, cx, bottom, size, z], i) => (
        <Character key={src} src={src} cx={cx} bottom={bottom} size={size} z={z} i={i} reduce={reduce} />
      ))}

      {/* aparador de atrás: tapa los pies de la banda y hace de "otra mesa" con adornos */}
      <div
        className="absolute left-0 right-0"
        style={{
          bottom: "41%",
          height: "9%",
          zIndex: 3,
          background: "linear-gradient(#a16207 0 35%, #78350f 35% 100%)",
          borderTop: "3px solid #1a1a1a",
          borderBottom: "3px solid #1a1a1a",
        }}
        aria-hidden="true"
      />

      <Mesa />

      {/* brindis */}
      <div className="absolute inset-x-0 bottom-[3%] flex justify-center pointer-events-none" style={{ zIndex: 7 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={t}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="font-bangers tracking-wider text-base sm:text-xl px-4 py-1 rounded-full"
            style={{ background: "#fffbeb", color: "#1a1a1a", border: "3px solid #1a1a1a", boxShadow: "3px 3px 0 #dc2626" }}
          >
            {TOASTS[t]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
