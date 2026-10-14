import { useEffect, useLayoutEffect, useState } from "react";

/**
 * Tema Halloween del Club.
 *
 * Se prende solo por fecha (hora local del visitante, igual que los banners):
 *   - ON : lunes 19/10/2026
 *   - OFF: domingo 1/11/2026 (el 31/10 todavía está prendido)
 *
 * Para otro año o para otro tema (Navidad, Primavera...) alcanza con copiar
 * este archivo y cambiar las fechas.
 *
 * Para PROBAR antes de la fecha:
 *   club.cualquierverdurarock.com/?halloween=1   -> lo fuerza prendido (queda mientras dure la pestaña)
 *   club.cualquierverdurarock.com/?halloween=0   -> lo fuerza apagado
 */
export const HALLOWEEN_ON = "2026-10-19"; // inclusive
export const HALLOWEEN_OFF = "2026-11-01"; // desde este día ya NO se muestra

const STORAGE_KEY = "cv-halloween-preview";

function todayLocal() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function readPreview() {
  if (typeof window === "undefined") return null;
  try {
    const q = new URLSearchParams(window.location.search).get("halloween");
    if (q === "1" || q === "0") {
      window.sessionStorage.setItem(STORAGE_KEY, q);
      return q;
    }
    return window.sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function isHalloweenActive() {
  const preview = readPreview();
  if (preview === "1") return true;
  if (preview === "0") return false;
  const t = todayLocal();
  return t >= HALLOWEEN_ON && t < HALLOWEEN_OFF;
}

// useLayoutEffect en el navegador (evita parpadeo), useEffect si no hay window
const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** true mientras el tema está activo. También marca <html class="theme-halloween"> */
export function useHalloween() {
  const [active, setActive] = useState(() => isHalloweenActive());

  useIso(() => {
    document.documentElement.classList.toggle("theme-halloween", active);
  }, [active]);

  // por si alguien deja la pestaña abierta justo al cruzar la fecha
  useEffect(() => {
    const id = setInterval(() => setActive(isHalloweenActive()), 60 * 1000);
    return () => clearInterval(id);
  }, []);

  return active;
}

// Verduras versión terror (public/assets/halloween/*.webp)
export const HALLOWEEN_VEG = {
  tomate: "/assets/halloween/tomate.webp",
  berenjena: "/assets/halloween/berenjena.webp",
  zanahoria: "/assets/halloween/zanahoria.webp",
  brocoli: "/assets/halloween/brocoli.webp",
  cebolla: "/assets/halloween/cebolla.webp",
  choclo: "/assets/halloween/choclo.webp",
  calabaza: "/assets/halloween/calabaza.webp",
  rabanito: "/assets/halloween/rabanito.webp",
};

/** Devuelve la imagen terror si el tema está activo; si no, la original */
export function vegImage(id, original, active) {
  return active && HALLOWEEN_VEG[id] ? HALLOWEEN_VEG[id] : original;
}
