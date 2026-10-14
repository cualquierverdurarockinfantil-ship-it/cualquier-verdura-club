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

// Textos de las verduras en versión terror (página Verduras)
export const HALLOWEEN_VEG_INFO = {
  tomate: {
    role: "El líder de la noche",
    personality:
      "Salió de la huerta a medianoche y desde entonces nadie lo para. Grita más fuerte que un trueno y siempre es el primero en subir al escenario embrujado.",
    curiosity: "Sus cuernitos son antenas: capta el rock desde tres cementerios de distancia.",
  },
  berenjena: {
    role: "Rebelde de ultratumba",
    personality:
      "Misteriosa y con colmillos de vampira. Nunca sigue las reglas... ni siquiera las del más allá.",
    curiosity: "Sus pulseras con pinches espantan a los fantasmas aburridos.",
  },
  zanahoria: {
    role: "La momia explosiva",
    personality:
      "Vendada de pies a cabeza pero con una energía que no frena ni una maldición. Canta tan fuerte que despierta a las momias del barrio.",
    curiosity: "Dicen que bajo las vendas guarda el mejor solo de voz del Antiguo Egipto.",
  },
  brocoli: {
    role: "El monstruo tranquilo",
    personality:
      "Un Frankenbrócoli de tornillos y costuras que se toma todo con paciencia. Pero cuando agarra los palillos, tiembla hasta el cementerio.",
    curiosity: "Los tornillos de su cuello sirven para afinar la batería.",
  },
  cebolla: {
    role: "La dulce que da miedito",
    personality:
      "Con sus costuras y sus dientes filosos parece de terror, pero es pura ternura. Sus melodías hechizan hasta a las brujas.",
    curiosity: "Si llorás al verla, es que el hechizo funcionó.",
  },
  choclo: {
    role: "El conde punk",
    personality:
      "Cresta punk, capa de vampiro y cero ganas de dormir de día. Siempre listo para el mosh de medianoche.",
    curiosity: "Dicen que cada granito de su cabeza es un diente que se salvó del ajo.",
  },
  calabaza: {
    role: "La reina de la Noche de Brujas",
    personality:
      "Con los brazos en alto y una sonrisa llena de dientes, enciende la fiesta como una linterna. El público grita cuando ella se ilumina.",
    curiosity: "Sus manos en alto llaman a los espíritus del rock, y siempre contestan.",
  },
  rabanito: {
    role: "El monstruito sorpresa",
    personality:
      "Peludo, con la lengua larga y pulseras de pinches. Chiquito, pero con la mala onda más simpática del jardín.",
    curiosity: "Es el favorito de los más chiquitos: lo único que da miedo es lo mucho que dan ganas de abrazarlo.",
  },
};

/** Devuelve la verdura con imagen y textos terror si el tema está activo */
export function spookyVeg(veg, active) {
  if (!active) return veg;
  const info = HALLOWEEN_VEG_INFO[veg.id];
  return { ...veg, image: HALLOWEEN_VEG[veg.id] || veg.image, ...(info || {}) };
}

// Dibujos para colorear de Halloween (solo se muestran mientras dura el tema)
export const HALLOWEEN_DRAWINGS = [
  { id: "tomate", title: "Tomate Cornudo" },
  { id: "berenjena", title: "Berenjena Vampira" },
  { id: "zanahoria", title: "Zanahoria Momia" },
  { id: "brocoli", title: "Brócoli Frankenstein" },
  { id: "cebolla", title: "Cebolla Dientuda" },
  { id: "choclo", title: "Choclo Drácula" },
  { id: "calabaza", title: "Calabaza Embrujada" },
  { id: "rabanito", title: "Rabanito Monstruo" },
].map((d) => ({
  ...d,
  thumbnail: HALLOWEEN_VEG[d.id],
  pdfUrl: `/assets/dibujos/halloween-${d.id}.pdf`,
}));
export const HALLOWEEN_PACK_URL = "/assets/dibujos/halloween-pack.pdf";

// Chicos disfrazados (public/assets/halloween/nios/nio1..5.webp)
export const HALLOWEEN_KIDS = {
  nio1: "/assets/halloween/nios/nio1.webp", // bruja
  nio2: "/assets/halloween/nios/nio2.webp", // diablito
  nio3: "/assets/halloween/nios/nio3.webp", // gatita negra
  nio4: "/assets/halloween/nios/nio4.webp", // sombrero calabaza
  nio5: "/assets/halloween/nios/nio5.webp", // murciélago
};

/** Recibe la ruta original (/assets/nios/nio3.png) y devuelve la disfrazada si el tema está activo */
export function kidImage(src, active) {
  if (!active || !src) return src;
  const m = /nio(\d)/.exec(src);
  return (m && HALLOWEEN_KIDS["nio" + m[1]]) || src;
}

// Atrapá la Calabaza: queda FIJO en Juegos junto a los 4 originales (también después del 1/11)
export const CATCH_GAME = {
  id: "atrapa-calabaza",
  title: "Atrapá la Calabaza",
  description: "Caen calabazas del cielo: atrapalas, esquivá fantasmas y murciélagos, ¡y no te dejes engañar por las verdes!",
  icon: "🎃",
  color: "#f97316",
  available: true,
};

// Especiales que SOLO aparecen en /juegos mientras dura el tema (19/10 al 31/10)
export const HALLOWEEN_GAMES = [
  {
    id: "h-misteriosa",
    title: "Verdura Disfrazada",
    description: "Mirá la silueta y adiviná qué verdura monstruo se esconde.",
    icon: "🦇",
    color: "#a855f7",
    available: true,
  },
  {
    id: "h-memoria",
    title: "Casa Embrujada",
    description: "Memoria en equipo: encontrá las parejas antes de que salga la luna.",
    icon: "🏚️",
    color: "#22c55e",
    available: true,
  },
];
