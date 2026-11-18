import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import GameRulesButton from "./GameRulesButton";
import { FIESTAS_VEG, FIESTAS_KIDS, FIESTAS_ORNAMENTS } from "@/lib/fiestas";

/**
 * ARMÁ EL ARBOLITO
 * Un pino y una bandeja de stickers (verduras, chicos y adornos). Arrastrá los stickers al árbol:
 *  - tienen que TOCAR el pino (aunque sea el borde del sticker con el borde del árbol)
 *  - no pueden pisarse entre sí
 * Si no se puede soltar, el sticker se ve en gris. Tocá un sticker puesto para sacarlo, o arrastralo para moverlo.
 * Dura 1 minuto: al terminar, cuenta los que quedaron. Después podés sacarle una foto al arbolito con un saludo.
 */

const W = 400; // el escenario es 400 x 500 "unidades"; todo se mide en esas unidades
const H = 500;
const S = 64; // lado de cada sticker (todos iguales)
const GAME_SECONDS = 60;
const BEST_KEY = "cv-fiestas-arbolito-best";
const TOUCH_LIFT = 40; // en celular el sticker se levanta un poco para que el dedo no lo tape

/* ---------- el pino: 3 pisos + tronco (una sola fuente para dibujar, probar choques y sacar la foto) ---------- */
const TIERS = [
  { ax: 200, ay: 40, hw: 78, by: 172, fill: "#22c55e" },
  { ax: 200, ay: 116, hw: 108, by: 300, fill: "#16a34a" },
  { ax: 200, ay: 226, hw: 146, by: 440, fill: "#15803d" },
];
const TRUNK = { x: 174, y: 438, w: 52, h: 40 };

function tierPath({ ax, ay, hw, by }) {
  const n = 5;
  const w = (2 * hw) / n;
  let d = `M${ax} ${ay} L${ax + hw} ${by}`;
  for (let i = 0; i < n; i++) {
    const x = ax + hw - i * w;
    d += ` Q${x - w / 2} ${by + 17} ${x - w} ${by}`;
  }
  return d + " Z";
}
const TIER_PATHS = TIERS.map(tierPath);
const STAR_PATH = (() => {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? 17 : 7.5;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    pts.push(`${(200 + r * Math.cos(a)).toFixed(1)} ${(30 + r * Math.sin(a)).toFixed(1)}`);
  }
  return "M" + pts.join(" L") + " Z";
})();

function inTriangle(px, py, { ax, ay, hw, by }) {
  if (py < ay || py > by) return false;
  const half = ((py - ay) / (by - ay)) * hw;
  return Math.abs(px - ax) <= half;
}
function inTree(px, py) {
  if (TIERS.some((t) => inTriangle(px, py, t))) return true;
  return px >= TRUNK.x && px <= TRUNK.x + TRUNK.w && py >= TRUNK.y && py <= TRUNK.y + TRUNK.h;
}
/** El sticker toca el pino si algún punto de su cuadrado cae sobre el árbol */
function touchesTree(cx, cy) {
  const n = 6;
  const inset = S * 0.06;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const px = cx - S / 2 + inset + (i / (n - 1)) * (S - 2 * inset);
      const py = cy - S / 2 + inset + (j / (n - 1)) * (S - 2 * inset);
      if (inTree(px, py)) return true;
    }
  }
  return false;
}
function overlaps(cx, cy, others) {
  const lim = S * 0.8;
  return others.some((o) => Math.abs(o.x - cx) < lim && Math.abs(o.y - cy) < lim);
}
const inBounds = (cx, cy) => cx >= S / 2 && cx <= W - S / 2 && cy >= S / 2 && cy <= H - S / 2;

// destellos dorados de 4 puntas, solo en el cielo (nada de puntitos blancos: no hay nieve en Argentina)
const STARS = [
  [26, 34, 7], [74, 80, 5], [120, 24, 6], [158, 64, 4], [252, 26, 6], [304, 76, 5], [352, 32, 7], [378, 96, 4],
  [38, 150, 5], [92, 196, 4], [332, 156, 5], [366, 214, 4], [112, 118, 4], [290, 128, 4],
];
const sparkle = (x, y, r) =>
  `M${x} ${y - r} Q${x + r * 0.18} ${y - r * 0.18} ${x + r} ${y} Q${x + r * 0.18} ${y + r * 0.18} ${x} ${y + r} Q${x - r * 0.18} ${y + r * 0.18} ${x - r} ${y} Q${x - r * 0.18} ${y - r * 0.18} ${x} ${y - r} Z`;

/* ---------- los stickers disponibles ---------- */
const VEG_IDS = ["tomate", "berenjena", "zanahoria", "brocoli", "cebolla", "choclo", "calabaza", "rabanito"];
const STICKERS = [
  ...VEG_IDS.map((id) => ({ id: "v-" + id, src: FIESTAS_VEG[id], label: id })),
  ...[1, 2, 3, 4, 5].map((n) => ({ id: "k-" + n, src: FIESTAS_KIDS["nio" + n], label: "chico " + n })),
  ...FIESTAS_ORNAMENTS.map((o) => ({ id: "o-" + o.id, src: o.src, label: o.id })),
];
const SRC_BY_ID = Object.fromEntries(STICKERS.map((s) => [s.id, s.src]));

function readBest() {
  try {
    return Number(window.localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}
function saveBest(v) {
  try {
    window.localStorage.setItem(BEST_KEY, String(v));
  } catch {
    /* sin almacenamiento: no pasa nada */
  }
}

function resultMessage(n) {
  if (n >= 22) return "¡Arbolito de la abuela, con todo! 🎄✨";
  if (n >= 15) return "¡Qué arbolazo! La familia entera lo mira.";
  if (n >= 8) return "¡Va tomando forma el pino!";
  if (n >= 1) return "¡Un arbolito tímido, pero con onda!";
  return "El pino quedó pelado… ¡probá de nuevo!";
}

/* ---------- la foto final (canvas 1080 x 1350) ---------- */
function loadImg(src) {
  return new Promise((resolve) => {
    const im = new Image();
    im.onload = () => resolve(im);
    im.onerror = () => resolve(null);
    im.src = src;
  });
}

async function buildPhoto(placed, name) {
  const cw = 1080;
  const ch = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = cw;
  canvas.height = ch;
  const g = canvas.getContext("2d");

  try {
    await Promise.all([document.fonts.load("110px Bangers"), document.fonts.load("40px Fredoka")]);
  } catch {
    /* si no cargan las fuentes se usa la de respaldo */
  }

  // cielo de noche de verano
  const sky = g.createLinearGradient(0, 0, 0, ch);
  sky.addColorStop(0, "#0b2545");
  sky.addColorStop(0.7, "#12385e");
  sky.addColorStop(1, "#14532d");
  g.fillStyle = sky;
  g.fillRect(0, 0, cw, ch);

  // estrellitas
  g.fillStyle = "#fde68a";
  STARS.forEach(([x, y, r], i) => {
    g.globalAlpha = 0.6 + (i % 3) * 0.15;
    g.save();
    g.translate((x / W) * cw - (x / W) * 0, (y / H) * 1000 + 230);
    g.scale(2.6, 2.6);
    g.fill(new Path2D(sparkle(0, 0, r)));
    g.restore();
  });
  g.globalAlpha = 1;

  // guirnalda de luces arriba
  const colors = ["#ef4444", "#facc15", "#22c55e", "#38bdf8", "#f472b6", "#fb923c"];
  g.strokeStyle = "#1a1a1a";
  g.lineWidth = 5;
  g.beginPath();
  for (let x = 0; x <= cw; x += 4) {
    const y = 18 + 34 * Math.abs(Math.sin((x / cw) * Math.PI * 6));
    if (x === 0) g.moveTo(x, y);
    else g.lineTo(x, y);
  }
  g.stroke();
  for (let i = 0; i < 12; i++) {
    const x = 45 + i * 90;
    const y = 18 + 34 * Math.abs(Math.sin((x / cw) * Math.PI * 6));
    g.fillStyle = colors[i % colors.length];
    g.lineWidth = 3;
    g.beginPath();
    g.ellipse(x, y + 20, 11, 15, 0, 0, Math.PI * 2);
    g.fill();
    g.stroke();
  }

  // título
  g.textAlign = "center";
  g.textBaseline = "alphabetic";
  const title = name ? `¡Felices fiestas, ${name}!` : "¡Felices fiestas!";
  g.font = `${title.length > 20 ? 92 : 118}px Bangers, Impact, sans-serif`;
  g.lineJoin = "round";
  g.lineWidth = 16;
  g.strokeStyle = "#dc2626";
  g.strokeText(title, cw / 2, 190);
  g.fillStyle = "#fffbeb";
  g.fillText(title, cw / 2, 190);

  // escenario del arbolito: 400x500 unidades -> 720x900
  const k = 1.8;
  const ox = (cw - W * k) / 2;
  const oy = 215;
  g.save();
  g.translate(ox, oy);
  g.scale(k, k);

  // pasto
  g.fillStyle = "#166534";
  g.strokeStyle = "#1a1a1a";
  g.lineWidth = 3;
  g.beginPath();
  g.ellipse(200, 482, 190, 20, 0, 0, Math.PI * 2);
  g.fill();
  g.stroke();

  g.lineJoin = "round";
  g.lineWidth = 3.4;
  g.fillStyle = "#92400e";
  g.fillRect(TRUNK.x, TRUNK.y, TRUNK.w, TRUNK.h);
  g.strokeRect(TRUNK.x, TRUNK.y, TRUNK.w, TRUNK.h);
  for (let i = TIERS.length - 1; i >= 0; i--) {
    const p = new Path2D(TIER_PATHS[i]);
    g.fillStyle = TIERS[i].fill;
    g.fill(p);
    g.stroke(p);
  }
  const star = new Path2D(STAR_PATH);
  g.fillStyle = "#facc15";
  g.fill(star);
  g.stroke(star);

  // stickers puestos
  const srcs = [...new Set(placed.map((p) => SRC_BY_ID[p.type]))];
  const imgs = {};
  await Promise.all(srcs.map(async (s) => (imgs[s] = await loadImg(s))));
  placed.forEach((p) => {
    const im = imgs[SRC_BY_ID[p.type]];
    if (!im) return;
    const r = Math.min(S / im.width, S / im.height);
    const w = im.width * r;
    const h = im.height * r;
    g.drawImage(im, p.x - w / 2, p.y - h / 2, w, h);
  });
  g.restore();

  // pie: saludo + logo
  g.fillStyle = "#fffbeb";
  g.font = "44px Fredoka, Arial, sans-serif";
  g.fillText("Que la pasen en familia, con la mesa llena 🎄", cw / 2, 1190);
  const plateW = 760;
  const plateH = 104;
  const px = (cw - plateW) / 2;
  const py = 1216;
  g.fillStyle = "#fffbeb";
  g.strokeStyle = "#1a1a1a";
  g.lineWidth = 5;
  g.beginPath();
  g.roundRect(px, py, plateW, plateH, 26);
  g.fill();
  g.stroke();
  const logo = await loadImg("/assets/letras-horizontal.svg");
  if (logo) {
    const lw = 620;
    const lh = lw * (240.2 / 1826.09);
    g.drawImage(logo, (cw - lw) / 2, py + (plateH - lh) / 2, lw, lh);
  } else {
    g.fillStyle = "#1a1a1a";
    g.font = "56px Bangers, Impact, sans-serif";
    g.fillText("Cualquier Verdura", cw / 2, py + 70);
  }

  return canvas.toDataURL("image/png");
}

/* ---------- el juego ---------- */
export default function ArmarArbolito() {
  const [phase, setPhase] = useState("intro"); // intro | play | end
  const [placed, setPlaced] = useState([]); // [{id, type, x, y}]
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS);
  const [drag, setDrag] = useState(null); // {type, fromId, cx, cy, valid, moved}
  const [best, setBest] = useState(() => readBest());
  const [newBest, setNewBest] = useState(false);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoBusy, setPhotoBusy] = useState(false);

  const stageRef = useRef(null);
  const areaRef = useRef(null);
  const [area, setArea] = useState({ w: 320, h: 400 });
  const dragRef = useRef(null);
  const placedRef = useRef([]);
  const phaseRef = useRef("intro");
  const idRef = useRef(1);
  const endAtRef = useRef(0);

  placedRef.current = placed;
  phaseRef.current = phase;

  const sizePx = useCallback(() => {
    const r = stageRef.current?.getBoundingClientRect();
    return r ? (S / W) * r.width : 56;
  }, []);

  /** posición de un punto de pantalla en unidades del escenario */
  const toUnits = useCallback((clientX, clientY) => {
    const r = stageRef.current.getBoundingClientRect();
    return { x: ((clientX - r.left) / r.width) * W, y: ((clientY - r.top) / r.height) * H, rect: r };
  }, []);

  const evaluate = useCallback(
    (cx, cy, fromId) => {
      const { x, y } = toUnits(cx, cy);
      const others = placedRef.current.filter((p) => p.id !== fromId);
      const valid = inBounds(x, y) && touchesTree(x, y) && !overlaps(x, y, others);
      return { x, y, valid };
    },
    [toUnits]
  );

  /* empezar a arrastrar (desde la bandeja o un sticker ya puesto) */
  const beginDrag = (e, type, fromId = null) => {
    if (phaseRef.current !== "play" || dragRef.current) return;
    if (e.button !== undefined && e.button !== 0) return;
    e.preventDefault();
    const lift = e.pointerType === "touch" ? TOUCH_LIFT : 0;
    const liftPx = (lift / W) * stageRef.current.getBoundingClientRect().width;
    const cx = e.clientX;
    const cy = e.clientY - liftPx;
    const { valid } = evaluate(cx, cy, fromId);
    const d = { type, fromId, cx, cy, liftPx, startX: e.clientX, startY: e.clientY, valid, moved: false };
    dragRef.current = d;
    setDrag(d);
  };

  /* mover / soltar (listeners de ventana, leen siempre el estado más nuevo por refs) */
  useEffect(() => {
    const onMove = (e) => {
      const d = dragRef.current;
      if (!d) return;
      const cx = e.clientX;
      const cy = e.clientY - d.liftPx;
      const moved = d.moved || Math.hypot(e.clientX - d.startX, e.clientY - d.startY) > 8;
      const { valid } = evaluate(cx, cy, d.fromId);
      const nd = { ...d, cx, cy, valid, moved };
      dragRef.current = nd;
      setDrag(nd);
    };
    const finish = (cancel) => (e) => {
      const d = dragRef.current;
      if (!d) return;
      dragRef.current = null;
      setDrag(null);
      if (cancel) return;
      const { x, y, valid } = evaluate(d.cx, d.cy, d.fromId);
      const r = stageRef.current?.getBoundingClientRect();
      const outside = r ? e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom : false;

      if (d.fromId == null) {
        // sticker nuevo: se pega solo si es válido
        if (valid) setPlaced((p) => [...p, { id: idRef.current++, type: d.type, x, y }]);
      } else if (!d.moved) {
        // toque sin arrastrar: lo saca
        setPlaced((p) => p.filter((s) => s.id !== d.fromId));
      } else if (outside) {
        // lo soltaron fuera del escenario: lo saca
        setPlaced((p) => p.filter((s) => s.id !== d.fromId));
      } else if (valid) {
        setPlaced((p) => p.map((s) => (s.id === d.fromId ? { ...s, x, y } : s)));
      }
      // si no es válido, el sticker vuelve a donde estaba
    };
    const up = finish(false);
    const cancel = finish(true);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", cancel);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", cancel);
    };
  }, [evaluate]);

  /* reloj */
  useEffect(() => {
    if (phase !== "play") return undefined;
    endAtRef.current = Date.now() + GAME_SECONDS * 1000;
    setTimeLeft(GAME_SECONDS);
    const id = setInterval(() => {
      const left = Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000));
      setTimeLeft(left);
      if (left <= 0) {
        clearInterval(id);
        // si justo había un sticker en la mano, se descarta/vuelve
        dragRef.current = null;
        setDrag(null);
        setPhase("end");
      }
    }, 200);
    return () => clearInterval(id);
  }, [phase]);

  /* al terminar: récord + foto */
  useEffect(() => {
    if (phase !== "end") return;
    const n = placedRef.current.length;
    const prev = readBest();
    if (n > prev) {
      saveBest(n);
      setBest(n);
      setNewBest(n > 0);
    } else {
      setNewBest(false);
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== "end") return undefined;
    let cancelled = false;
    setPhotoBusy(true);
    const t = setTimeout(async () => {
      try {
        const url = await buildPhoto(placedRef.current, name.trim());
        if (!cancelled) setPhoto(url);
      } catch {
        if (!cancelled) setPhoto(null);
      } finally {
        if (!cancelled) setPhotoBusy(false);
      }
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
    // la foto se rehace si cambia el nombre
  }, [phase, name]);

  /* el escenario se achica o agranda según el espacio que deje la pantalla */
  useEffect(() => {
    if (phase !== "play") return undefined;
    const el = areaRef.current;
    if (!el) return undefined;
    const measure = () => setArea({ w: el.clientWidth - 24, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("orientationchange", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("orientationchange", measure);
    };
  }, [phase]);

  /* mientras se juega no se mueve la página con el dedo */
  useEffect(() => {
    if (phase !== "play") return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [phase]);

  const start = () => {
    setPlaced([]);
    setPhoto(null);
    setNewBest(false);
    idRef.current = 1;
    setPhase("play");
  };

  const download = () => {
    if (!photo) return;
    const a = document.createElement("a");
    a.href = photo;
    a.download = "felices-fiestas-club-verdura.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const share = async () => {
    if (!photo) return;
    try {
      const blob = await (await fetch(photo)).blob();
      const file = new File([blob], "felices-fiestas-club-verdura.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "¡Felices fiestas!", text: "Mi arbolito del Club Verdura 🎄" });
        return;
      }
    } catch {
      /* si el usuario cancela o no se puede, cae a descargar */
    }
    download();
  };

  const canShare = typeof navigator !== "undefined" && !!navigator.share;
  const dragSrc = drag ? SRC_BY_ID[drag.type] : null;
  const px = sizePx();
  const timeLow = timeLeft <= 10;

  const rules = useMemo(
    () => [
      "Tenés 1 minuto para decorar el pino con la mayor cantidad de stickers posible.",
      "Arrastrá un sticker de la bandeja hasta el árbol. Tiene que tocar el pino (aunque sea solo el borde).",
      "Si el sticker se ve en gris es que no lo podés soltar ahí: o no toca el pino o está pisando a otro.",
      "Para sacar uno, tocalo. Para moverlo, arrastralo (o llevalo fuera del escenario).",
      "Cuando termina el minuto, cuenta los que quedaron. ¡Después te llevás una foto con tu saludo de fiestas!",
    ],
    []
  );

  /* ---------- pantallas ---------- */
  if (phase === "intro") {
    return (
      <div className="card-cv p-6 md:p-10 text-center max-w-xl mx-auto" style={{ background: "#16a34a15" }}>
        <motion.div className="text-7xl mb-3" animate={{ rotate: [-6, 6, -6] }} transition={{ duration: 2.4, repeat: Infinity }}>
          🎄
        </motion.div>
        <h2 className="text-4xl font-bangers tracking-wider text-cv-dark mb-2">Armá el Arbolito</h2>
        <p className="font-fredoka text-gray-600 mb-4">
          Llená el pino de verduras, chicos y adornos. Tienen que tocar el árbol y no pueden pisarse. ¡Tenés un minuto!
        </p>
        <GameRulesButton title="Armá el Arbolito" accentColor="#16a34a" rules={rules} />
        {best > 0 && <p className="font-fredoka text-gray-500 mb-3">Tu récord: <strong>{best}</strong> stickers</p>}
        <div>
          <button onClick={start} className="btn-cv-primary text-xl px-10 py-4">
            ¡A decorar!
          </button>
        </div>
      </div>
    );
  }

  /* ---------- pantalla completa (jugando y resultado) ---------- */
  const badge = { background: "#fffbeb", color: "#1a1a1a", border: "2px solid #1a1a1a", padding: "2px 12px" };
  const stageW = Math.max(120, Math.min(area.w, area.h * (W / H), 460));
  const stageH = stageW * (H / W);

  const overlay = (
    <div
      className="fixed inset-0 flex flex-col"
      style={{ zIndex: 70, background: "#fff8ec", WebkitUserSelect: "none", userSelect: "none", WebkitTouchCallout: "none" }}
    >
      {/* barra de estado */}
      <div className="flex items-center justify-between gap-2 px-3 pt-3 pb-2 font-bangers tracking-wider text-lg shrink-0">
        <button
          onClick={() => {
            dragRef.current = null;
            setDrag(null);
            setPhase("intro");
          }}
          className="rounded-full font-bangers"
          style={{ ...badge, background: "#fff", cursor: "pointer" }}
          aria-label="Salir del juego"
        >
          ✕ Salir
        </button>
        <span className="rounded-full" style={badge}>🎄 {placed.length}</span>
        {phase === "play" ? (
          <span className="rounded-full" style={{ ...badge, background: timeLow ? "#fecaca" : "#fffbeb" }}>
            ⏱ {timeLeft}s
          </span>
        ) : (
          <span className="rounded-full" style={{ ...badge, background: "#bbf7d0" }}>¡Se acabó!</span>
        )}
      </div>

      {phase === "play" && (
        <>
          <div className="h-3 rounded-full overflow-hidden mx-3 mb-2 shrink-0" style={{ background: "#e5e7eb", border: "2px solid #1a1a1a" }}>
            <div
              className="h-full"
              style={{ width: `${(timeLeft / GAME_SECONDS) * 100}%`, background: timeLow ? "#dc2626" : "#16a34a", transition: "width 0.25s linear" }}
            />
          </div>

          {/* el escenario ocupa todo el alto que sobra, siempre completo y a la vista */}
          <div ref={areaRef} className="flex-1 min-h-0 flex items-center justify-center px-3">
            <div
              ref={stageRef}
              className="relative rounded-3xl overflow-hidden shrink-0"
              style={{
                width: stageW,
                height: stageH,
                background: "linear-gradient(#0b2545 0%, #12385e 70%, #14532d 100%)",
                border: "4px solid #1a1a1a",
                boxShadow: "6px 6px 0 #14532d",
                touchAction: "none",
              }}
              onContextMenu={(e) => e.preventDefault()}
            >
              <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full" aria-hidden="true">
                <g fill="#fde68a">
                  {STARS.map(([x, y, r], i) => (
                    <path key={i} d={sparkle(x, y, r)} opacity={0.6 + (i % 3) * 0.15} />
                  ))}
                </g>
                <g stroke="#1a1a1a" strokeWidth="3" strokeLinejoin="round">
                  <ellipse cx="200" cy="482" rx="190" ry="20" fill="#166534" />
                  <rect x={TRUNK.x} y={TRUNK.y} width={TRUNK.w} height={TRUNK.h} fill="#92400e" />
                  {TIER_PATHS.slice().reverse().map((d, i) => (
                    <path key={i} d={d} fill={TIERS[TIERS.length - 1 - i].fill} />
                  ))}
                  <path d={STAR_PATH} fill="#facc15" />
                </g>
              </svg>

              {/* stickers puestos */}
              {placed.map((p) => {
                const hidden = drag && drag.fromId === p.id;
                return (
                  <img
                    key={p.id}
                    src={SRC_BY_ID[p.type]}
                    alt=""
                    draggable={false}
                    onPointerDown={(e) => beginDrag(e, p.type, p.id)}
                    className="absolute object-contain"
                    style={{
                      left: `${(p.x / W) * 100}%`,
                      top: `${(p.y / H) * 100}%`,
                      width: `${(S / W) * 100}%`,
                      aspectRatio: "1 / 1",
                      transform: "translate(-50%, -50%)",
                      opacity: hidden ? 0 : 1,
                      touchAction: "none",
                      cursor: "grab",
                    }}
                  />
                );
              })}

              {placed.length === 0 && !drag && (
                <div className="absolute inset-x-0 top-[46%] text-center pointer-events-none">
                  <span className="font-fredoka text-sm text-white/90 bg-black/30 rounded-full px-3 py-1">
                    Arrastrá los stickers hasta el pino
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* bandeja */}
          <div
            className="mx-3 mt-2 mb-3 rounded-2xl p-2 flex flex-wrap justify-center gap-1.5 shrink-0"
            style={{ background: "#fffbeb", border: "3px solid #1a1a1a", touchAction: "none" }}
          >
            {STICKERS.map((s) => (
              <img
                key={s.id}
                src={s.src}
                alt={s.label}
                draggable={false}
                onPointerDown={(e) => beginDrag(e, s.id)}
                className="object-contain"
                style={{ width: 40, height: 40, touchAction: "none", cursor: "grab" }}
              />
            ))}
          </div>
        </>
      )}

      {/* resultado */}
      {phase === "end" && (
        <div className="flex-1 min-h-0 overflow-y-auto px-3 pb-6" style={{ touchAction: "pan-y" }}>
          <motion.div
            className="card-cv p-5 text-center max-w-md mx-auto"
            style={{ background: "#16a34a15" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="font-bangers text-6xl text-cv-dark tracking-wider">{placed.length}</div>
            <div className="font-fredoka text-gray-600 -mt-1 mb-1">stickers en el árbol</div>
            <p className="font-fredoka text-cv-dark">{resultMessage(placed.length)}</p>
            {newBest && <p className="font-bangers text-xl tracking-wider text-cv-red mt-1">¡Nuevo récord! 🏆</p>}
            {!newBest && best > 0 && <p className="font-fredoka text-sm text-gray-500">Tu récord: {best}</p>}

            <div className="mt-4">
              <label className="block font-fredoka text-sm text-gray-600 mb-1">¿Para quién es el saludo? (opcional)</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 18))}
                placeholder="Ej: Abuela, Mati, la familia…"
                className="w-full rounded-full px-4 py-2 font-fredoka text-center"
                style={{ border: "3px solid #1a1a1a", background: "#fff", userSelect: "text", WebkitUserSelect: "text" }}
              />
            </div>

            <div
              className="mt-4 rounded-2xl overflow-hidden mx-auto"
              style={{ border: "3px solid #1a1a1a", maxWidth: 300, aspectRatio: "4 / 5", background: "#0b2545" }}
            >
              {photo ? (
                <img src={photo} alt="Tu arbolito con saludo de fiestas" className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-fredoka text-white/80">
                  {photoBusy ? "Armando tu foto…" : "No se pudo armar la foto"}
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <button onClick={download} disabled={!photo} className="btn-cv-primary justify-center" style={{ opacity: photo ? 1 : 0.5 }}>
                ⬇️ Descargar mi foto
              </button>
              {canShare && (
                <button onClick={share} disabled={!photo} className="btn-cv-secondary justify-center" style={{ opacity: photo ? 1 : 0.5 }}>
                  📤 Compartir
                </button>
              )}
              <button onClick={start} className="btn-cv-secondary justify-center">
                🔄 Armar otro arbolito
              </button>
              <button onClick={() => setPhase("intro")} className="font-fredoka text-sm text-gray-500 underline mt-1">
                Volver
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {createPortal(overlay, document.body)}
      {/* sticker en la mano (gris si no se puede soltar) */}
      {drag &&
        createPortal(
          <img
            src={dragSrc}
            alt=""
            draggable={false}
            style={{
              position: "fixed",
              left: drag.cx - px / 2,
              top: drag.cy - px / 2,
              width: px,
              height: px,
              objectFit: "contain",
              pointerEvents: "none",
              zIndex: 9999,
              filter: drag.valid ? "drop-shadow(0 4px 6px rgba(0,0,0,.4))" : "grayscale(1) opacity(.6)",
              transform: drag.valid ? "scale(1.08)" : "scale(1)",
            }}
          />,
          document.body
        )}
    </>
  );
}
