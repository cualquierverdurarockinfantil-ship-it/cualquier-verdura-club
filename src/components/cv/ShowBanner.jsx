import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

/**
 * Banner "Próximo show" — Tacuarock Halloween.
 * Se prende solo el 19/10/2026 y se apaga el 1/11/2026 (hora local del visitante),
 * igual que el tema Halloween del Club. Para probar antes: ?halloween=1  (y ?halloween=0 lo apaga).
 *
 * PARA EDITAR: todo lo que cambia está en SHOW (acá abajo).
 * El show es en el Teatro Español (entrada por Café Cervantes), llueva o no.
 */
const SHOW = {
  id: "tacuarock-halloween-2026-teatro",
  name: "Tacuarock Halloween",
  when: "Sábado 31/10 · 18 h",
  venue: "Teatro Español",
  access: "Entrada por Café Cervantes",
  free: true,
  on: "2026-10-19", // inclusive
  off: "2026-11-01", // desde este día ya no se muestra
};

const PREVIEW_KEY = "cv-halloween-preview";
function readPreview() {
  try {
    const q = new URLSearchParams(window.location.search).get("halloween");
    if (q === "1" || q === "0") {
      window.sessionStorage.setItem(PREVIEW_KEY, q);
      return q;
    }
    return window.sessionStorage.getItem(PREVIEW_KEY);
  } catch {
    return null;
  }
}
function isActive() {
  const p = readPreview();
  if (p === "1") return true;
  if (p === "0") return false;
  const d = new Date();
  const t = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return t >= SHOW.on && t < SHOW.off;
}
const DISMISS_KEY = `cv-show-banner-${SHOW.id}`;
function wasDismissed() {
  try {
    if (readPreview() === "1") return false; // en modo prueba siempre se ve
    return !!window.localStorage.getItem(DISMISS_KEY);
  } catch {
    return false;
  }
}

function MiniPumpkin() {
  return (
    <svg viewBox="0 0 64 60" width="44" height="41" aria-hidden="true" className="shrink-0">
      <path d="M32 14 C30 8 33 4 38 3" fill="none" stroke="#1a1a1a" strokeWidth="7" strokeLinecap="round" />
      <path d="M32 14 C30 8 33 4 38 3" fill="none" stroke="#22c55e" strokeWidth="3.4" strokeLinecap="round" />
      <ellipse cx="32" cy="36" rx="27" ry="21" fill="#f97316" stroke="#1a1a1a" strokeWidth="3.4" />
      <path d="M32 16 C22 24 22 48 32 56 C42 48 42 24 32 16Z" fill="#fb923c" stroke="#1a1a1a" strokeWidth="2.2" />
      <path d="M19 30 l8 3 -8 4z M45 30 l-8 3 8 4z" fill="#1a1a1a" />
      <path d="M21 44 q11 8 22 0 l-3 -3 -3 3 -3 -3 -3 3 -3 -3 -3 3 -3 -3z" fill="#facc15" stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function details() {
  const place = SHOW.venue;
  return { place, line: `${SHOW.when} · ${place}${SHOW.free ? " · Entrada libre" : ""}` };
}

function Band({ onClose, action }) {
  const { line } = details();
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      style={{ overflow: "hidden", position: "relative", zIndex: 40 }}
    >
      <div
        className="relative px-4 py-3 pr-11"
        style={{ background: "#1a0a2e", borderBottom: "4px solid #f97316", boxShadow: "0 4px 0 #7e22ce" }}
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <MiniPumpkin />
            <span
              className="font-bangers tracking-wider text-sm px-3 py-1 rounded-full whitespace-nowrap"
              style={{ background: "#facc15", color: "#1a0a2e", border: "2px solid #1a1a1a", boxShadow: "2px 2px 0 #1a1a1a" }}
            >
              PRÓXIMO SHOW
            </span>
          </div>
          <div>
            <p
              className="font-bangers tracking-wide text-2xl md:text-3xl leading-none"
              style={{ color: "#e4def0", textShadow: "0 0 10px rgba(216,200,240,.7), 2px 2px 0 #7e22ce" }}
            >
              {SHOW.name}
            </p>
            <p className="font-fredoka text-sm md:text-base mt-1" style={{ color: "#fdba74" }}>{line}</p>
            <p className="font-fredoka text-xs md:text-sm" style={{ color: "#d8c8f0" }}>
              {SHOW.access}
            </p>
          </div>
          {action}
        </div>
        <button
          onClick={onClose}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-white/10"
          aria-label="Cerrar aviso del show"
          style={{ color: "#fff7ed" }}
        >
          <X size={18} />
        </button>
      </div>
    </motion.div>
  );
}

const pillStyle = { background: "#f97316", color: "#2e1065", border: "2px solid #1a1a1a", boxShadow: "2px 2px 0 #1a1a1a" };

export default function ShowBanner() {
  const [on] = useState(isActive);
  const [closed, setClosed] = useState(wasDismissed);
  if (!on || closed) return null;
  const close = () => {
    try { window.localStorage.setItem(DISMISS_KEY, "1"); } catch { /* sin storage: solo se cierra ahora */ }
    setClosed(true);
  };
  return (
    <AnimatePresence>
      <Band
        onClose={close}
        action={
          <Link to="/shows" className="font-bangers tracking-wide text-base px-4 py-1.5 rounded-full whitespace-nowrap" style={pillStyle}>
            Más info
          </Link>
        }
      />
    </AnimatePresence>
  );
}
