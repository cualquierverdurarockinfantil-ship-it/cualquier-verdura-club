import { useEffect, useLayoutEffect, useState } from "react";

/**
 * Tema FIESTAS (Navidad, Año Nuevo y Reyes) del Club — Navidad argentina:
 * verano, noche de luces de colores, pino, familia reunida y mesa larga. Sin nieve.
 *
 * Se prende solo por fecha (hora local del visitante, igual que Halloween y los banners):
 *   - ON : martes 8/12/2026 a las 00:00 (día que se arma el arbolito)
 *   - OFF: lunes 11/1/2027 (queda prendido hasta el domingo 10/1 inclusive)
 *
 * Convive con el tema Halloween (src/lib/halloween.js) sin pisarlo: cada tema tiene su
 * archivo, su clase en <html> (theme-halloween / theme-fiestas) y sus fechas.
 *
 * Para PROBAR antes de la fecha:
 *   club.cualquierverdurarock.com/?fiestas=1   -> lo fuerza prendido (queda mientras dure la pestaña)
 *   club.cualquierverdurarock.com/?fiestas=0   -> lo fuerza apagado
 *
 * Los juegos de fiestas con fecha propia se desbloquean con FIESTAS_GAMES[].from.
 */
export const FIESTAS_ON = "2026-12-08"; // inclusive, desde las 00:00 hora local
export const FIESTAS_OFF = "2027-01-11"; // desde este día ya NO se muestra (se ve hasta el 10/1 inclusive)

const STORAGE_KEY = "cv-fiestas-preview";

function todayLocal() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function readPreview() {
  if (typeof window === "undefined") return null;
  try {
    const q = new URLSearchParams(window.location.search).get("fiestas");
    if (q === "1" || q === "0") {
      window.sessionStorage.setItem(STORAGE_KEY, q);
      return q;
    }
    return window.sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function isFiestasActive() {
  const preview = readPreview();
  if (preview === "1") return true;
  if (preview === "0") return false;
  const t = todayLocal();
  return t >= FIESTAS_ON && t < FIESTAS_OFF;
}

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** true mientras el tema está activo. También marca <html class="theme-fiestas"> */
export function useFiestas() {
  const [active, setActive] = useState(() => isFiestasActive());

  useIso(() => {
    document.documentElement.classList.toggle("theme-fiestas", active);
  }, [active]);

  // por si alguien deja la pestaña abierta justo al cruzar la medianoche del 8/12
  useEffect(() => {
    const id = setInterval(() => setActive(isFiestasActive()), 30 * 1000);
    return () => clearInterval(id);
  }, []);

  return active;
}

// Verduras con gorro de Papá Noel / astas de reno (public/assets/fiestas/*.webp)
export const FIESTAS_VEG = {
  tomate: "/assets/fiestas/tomate.webp",
  berenjena: "/assets/fiestas/berenjena.webp",
  zanahoria: "/assets/fiestas/zanahoria.webp",
  brocoli: "/assets/fiestas/brocoli.webp",
  cebolla: "/assets/fiestas/cebolla.webp",
  choclo: "/assets/fiestas/choclo.webp",
  calabaza: "/assets/fiestas/calabaza.webp",
  rabanito: "/assets/fiestas/rabanito.webp",
};

/** Devuelve la imagen navideña si el tema está activo; si no, la que venga (original o de otro tema) */
export function fiestasVegImage(id, current, active) {
  return active && FIESTAS_VEG[id] ? FIESTAS_VEG[id] : current;
}

// Chicos con gorro (public/assets/fiestas/nios/nio1..5.webp)
export const FIESTAS_KIDS = {
  nio1: "/assets/fiestas/nios/nio1.webp",
  nio2: "/assets/fiestas/nios/nio2.webp",
  nio3: "/assets/fiestas/nios/nio3.webp",
  nio4: "/assets/fiestas/nios/nio4.webp",
  nio5: "/assets/fiestas/nios/nio5.webp",
};

/** Recibe la ruta original (/assets/nios/nio3.png) y devuelve la de fiestas si el tema está activo */
export function fiestasKidImage(src, active) {
  if (!active || !src) return src;
  const m = /nio(\d)/.exec(src);
  return (m && FIESTAS_KIDS["nio" + m[1]]) || src;
}

// Adornos para los stickers del arbolito (public/assets/fiestas/orn/*.svg)
export const FIESTAS_ORNAMENTS = [
  "esfera-roja",
  "esfera-dorada",
  "esfera-celeste",
  "estrella",
  "regalo",
  "campana",
  "pan-dulce",
  "copa",
  "vela",
].map((id) => ({ id, src: `/assets/fiestas/orn/${id}.svg` }));

// Juegos de fiestas (se ven solo mientras dura el tema). `from` = fecha desde la que se muestra
// (omitir para que estén desde el 8/12). Cuando estén listos los otros dos se suman acá.
export const FIESTAS_GAMES = [
  {
    id: "f-arbolito",
    title: "Armá el Arbolito",
    description: "Llená el pino de verduras, chicos y adornos: ¡gana el que más stickers ponga! Tienen que tocar el árbol y no pueden pisarse. Tenés 1 minuto y medio.",
    icon: "🎄",
    color: "#16a34a",
    available: true,
  },
];

/** Juegos de fiestas visibles hoy (respeta `from`; en modo prueba ?fiestas=1 se ven todos) */
export function fiestasGamesToday() {
  const preview = readPreview();
  const t = todayLocal();
  return FIESTAS_GAMES.filter((g) => !g.from || preview === "1" || t >= g.from);
}
