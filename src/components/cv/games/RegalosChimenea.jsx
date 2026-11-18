import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import GameRulesButton from "./GameRulesButton";
import { FIESTAS_VEG } from "@/lib/fiestas";

/**
 * REGALOS A LA CHIMENEA
 * Papá Noel (la berenjena) vuela siempre en el centro, en su trineo tirado por la zanahoria y el rabanito.
 * Lo que se mueve es el pueblo: casas y edificios pasan por abajo, todos con chimenea.
 * Tocá la pantalla para soltar un regalo: cae derecho. Hay que soltarlo justo para que la chimenea
 * que viene pasando esté abajo cuando llegue. 12 regalos; desde el 7 las chimeneas cambian de altura.
 */

const W = 400;
const H = 560;
const GROUND = 540;
const GRAVITY = 900;
const SLEIGH_X = 200; // el trineo siempre está en el centro: lo que se mueve es el fondo
const SLEIGH_Y = 78;
const GIFTS_TOTAL = 12;
const LEVEL2_FROM = 6; // desde el regalo 7 las chimeneas ya no están todas a la misma altura
const BASE_TOP = 424; // altura (borde de arriba) de todas las chimeneas en el nivel 1
const OPEN = 17; // medio ancho de la boca: si el regalo cae dentro de esto, entra
const RIM = 26; // entre OPEN y RIM pega en el borde
const BEST_KEY = "cv-fiestas-regalos-best";

/* Casas y edificios distintos. w = ancho, r = cuánto baja el techo desde el borde de la chimenea, off = dónde está la chimenea */
const DESIGNS = [
  { id: "casita", w: 86, r: 36, off: 20 },
  { id: "edificio", w: 70, r: 24, off: -16 },
  { id: "chalet", w: 104, r: 30, off: 26 },
  { id: "torre", w: 60, r: 40, off: 0 },
  { id: "cabana", w: 92, r: 34, off: -22 },
];
const PALETTE = [
  ["#fde68a", "#b91c1c"],
  ["#bfdbfe", "#15803d"],
  ["#fbcfe8", "#1d4ed8"],
  ["#bbf7d0", "#9a3412"],
  ["#fed7aa", "#4338ca"],
  ["#e9d5ff", "#be123c"],
];

function makeHouse(id, x, level) {
  const d = DESIGNS[(id * 7 + 3) % DESIGNS.length];
  const pal = PALETTE[(id * 5 + 1) % PALETTE.length];
  let top = BASE_TOP;
  if (level >= 2) top += [-52, 0, 34, -26, 16][id % 5];
  return { id, x, d, top, wall: pal[0], roof: pal[1], chx: x + d.off };
}

/** un pasito de la caída del regalo (cae derecho: x fija en la pantalla; las casas pasan por debajo) */
function stepGift(g, dt, houses, scroll) {
  const ny = g.y + g.vy * dt;
  const out = { y: ny, vy: g.vy + GRAVITY * dt, end: null, house: null };
  for (const h of houses) {
    const sx = h.chx - scroll;
    if (g.y < h.top && ny >= h.top) {
      const dd = Math.abs(SLEIGH_X - sx);
      if (dd <= OPEN) {
        out.end = "score";
        out.y = h.top;
        out.house = h;
        return out;
      }
      if (dd <= RIM) {
        out.end = "rim";
        out.house = h;
        return out;
      }
    }
    const hx = h.x - scroll;
    if (Math.abs(SLEIGH_X - hx) <= h.d.w / 2 && ny >= h.top + h.d.r) {
      out.end = "miss";
      out.y = h.top + h.d.r;
      return out;
    }
  }
  if (ny >= GROUND - 8) {
    out.end = "miss";
    out.y = GROUND - 8;
  }
  return out;
}

function worldSpeed(thrown) {
  return 105 + thrown * 9;
}

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
  if (n >= 12) return "¡Perfecto! Ni un regalo se perdió 🎁✨";
  if (n >= 9) return "¡Papá Noel te quiere de ayudante!";
  if (n >= 5) return "¡Bien! Varias familias felices esta noche.";
  if (n >= 1) return "Algunos llegaron… ¡el año que viene mejor puntería!";
  return "Ninguno entró… ¡probá de nuevo!";
}

const STARS = Array.from({ length: 34 }, (_, i) => ({
  x: (i * 97) % 400,
  y: 10 + ((i * 53) % 230),
  r: 0.8 + (i % 3) * 0.5,
  d: (i % 7) * 0.4,
}));
const LIGHT_COLORS = ["#ef4444", "#facc15", "#22c55e", "#3b82f6"];

function Gift({ x, y, rot = 0, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <rect x="-11" y="-11" width="22" height="22" rx="3" fill="#ef4444" stroke="#1a1a1a" strokeWidth="2.2" />
      <rect x="-3" y="-11" width="6" height="22" fill="#fde047" stroke="#1a1a1a" strokeWidth="1.2" />
      <rect x="-11" y="-3" width="22" height="6" fill="#fde047" stroke="#1a1a1a" strokeWidth="1.2" />
      <path d="M0 -11 C-8 -22 -14 -12 0 -11 C14 -12 8 -22 0 -11Z" fill="#fde047" stroke="#1a1a1a" strokeWidth="1.6" />
    </g>
  );
}

function Chimney({ x, top, yr }) {
  return (
    <g>
      <rect x={x - 19} y={top} width="38" height={yr + 16 - top} fill="#b45309" stroke="#1a1a1a" strokeWidth="3" />
      <path d={`M${x - 19} ${top + 14} h38 M${x - 19} ${top + 28} h38 M${x - 6} ${top} v14 M${x + 8} ${top + 14} v14`} stroke="#1a1a1a" strokeWidth="1.5" opacity=".55" />
      <rect x={x - 23} y={top - 7} width="46" height="10" rx="3" fill="#78350f" stroke="#1a1a1a" strokeWidth="3" />
      <ellipse cx={x} cy={top - 2} rx="14" ry="3.5" fill="#1a1a1a" />
    </g>
  );
}

function Win({ x, y, w = 16, h = 18 }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="2" fill="#fef08a" stroke="#1a1a1a" strokeWidth="2.2" />
      <path d={`M${x + w / 2} ${y} v${h} M${x} ${y + h / 2} h${w}`} stroke="#1a1a1a" strokeWidth="1.3" />
    </g>
  );
}

function Bulbs({ y, from, to, n = 5, seed = 0 }) {
  return Array.from({ length: n }, (_, i) => (
    <circle key={i} cx={from + ((to - from) * i) / (n - 1)} cy={y} r="3.3" fill={LIGHT_COLORS[(i + seed) % 4]} stroke="#1a1a1a" strokeWidth="1">
      <animate attributeName="opacity" values="1;.25;1" dur="1.6s" begin={`${i * -0.4}s`} repeatCount="indefinite" />
    </circle>
  ));
}

/** una casa o edificio, dibujado en coordenadas locales (x = 0 es el centro de la casa) */
function House({ h }) {
  const { d, top, wall, roof, id } = h;
  const yr = top + d.r;
  const hw = d.w / 2;
  const G = GROUND;
  let shape = null;
  if (d.id === "casita") {
    shape = (
      <>
        <rect x={-hw + 8} y={yr + 12} width={d.w - 16} height={G - yr - 12} fill={wall} stroke="#1a1a1a" strokeWidth="3" />
        <Win x={-30} y={yr + 28} />
        <rect x={8} y={G - 34} width="20" height="34" rx="3" fill="#92400e" stroke="#1a1a1a" strokeWidth="2.5" />
      </>
    );
  } else if (d.id === "edificio") {
    shape = (
      <>
        <rect x={-hw} y={yr} width={d.w} height={G - yr} fill={wall} stroke="#1a1a1a" strokeWidth="3" />
        {Array.from({ length: Math.floor((G - yr - 30) / 34) }, (_, r) =>
          [-hw + 10, -6, hw - 26].map((x, c) => ((r + c + id) % 3 === 0 ? null : <Win key={`${r}${c}`} x={x} y={yr + 12 + r * 34} w={16} h={20} />))
        )}
        <rect x={-hw - 3} y={yr - 3} width={d.w + 6} height="9" rx="2" fill={roof} stroke="#1a1a1a" strokeWidth="2.6" />
        <rect x={-10} y={G - 28} width="20" height="28" rx="2" fill="#475569" stroke="#1a1a1a" strokeWidth="2.4" />
      </>
    );
  } else if (d.id === "chalet") {
    shape = (
      <>
        <rect x={-hw + 6} y={yr + 10} width={d.w - 12} height={G - yr - 10} fill={wall} stroke="#1a1a1a" strokeWidth="3" />
        <Win x={-38} y={yr + 26} />
        <Win x={-10} y={yr + 26} />
        <rect x={20} y={G - 36} width="22" height="36" rx="3" fill="#92400e" stroke="#1a1a1a" strokeWidth="2.5" />
        <path d={`M${-hw} ${yr + 12} L${-hw + 20} ${yr - 8} L${hw - 20} ${yr - 8} L${hw} ${yr + 12} Z`} fill={roof} stroke="#1a1a1a" strokeWidth="3" strokeLinejoin="round" />
      </>
    );
  } else if (d.id === "torre") {
    shape = (
      <>
        <rect x={-hw + 8} y={yr + 4} width={d.w - 16} height={G - yr - 4} fill={wall} stroke="#1a1a1a" strokeWidth="3" />
        <circle cx="0" cy={yr + 28} r="9" fill="#fef08a" stroke="#1a1a1a" strokeWidth="2.4" />
        <Win x={-8} y={yr + 56} w={16} h={22} />
        <rect x={-9} y={G - 32} width="18" height="32" rx="3" fill="#92400e" stroke="#1a1a1a" strokeWidth="2.4" />
        <path d={`M${-hw + 2} ${yr + 8} L0 ${yr - 16} L${hw - 2} ${yr + 8} Z`} fill={roof} stroke="#1a1a1a" strokeWidth="3" strokeLinejoin="round" />
      </>
    );
  } else {
    shape = (
      <>
        <rect x={-hw + 6} y={yr + 12} width={d.w - 12} height={G - yr - 12} fill="#b45309" stroke="#1a1a1a" strokeWidth="3" />
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M${-hw + 6} ${yr + 22 + i * 16} h${d.w - 12}`} stroke="#78350f" strokeWidth="2" />
        ))}
        <Win x={-34} y={yr + 30} />
        <rect x={10} y={G - 34} width="20" height="34" rx="3" fill="#78350f" stroke="#1a1a1a" strokeWidth="2.5" />
        <path d={`M${-hw - 2} ${yr + 14} L0 ${yr - 12} L${hw + 2} ${yr + 14} Z`} fill={roof} stroke="#1a1a1a" strokeWidth="3" strokeLinejoin="round" />
      </>
    );
  }
  return (
    <g>
      <Chimney x={d.off} top={top} yr={yr} />
      {shape}
      <Bulbs y={yr + (d.id === "edificio" ? 12 : 17)} from={-hw + 14} to={hw - 14} n={4} seed={id} />
    </g>
  );
}

const CLOUDS = [
  [30, 150, 1], [170, 190, 0.8], [300, 135, 1.1], [360, 205, 0.7],
];

export default function RegalosChimenea() {
  const [phase, setPhase] = useState("intro"); // intro | play | end
  const [view, setView] = useState(null);
  const [best, setBest] = useState(() => readBest());
  const [newBest, setNewBest] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const areaRef = useRef(null);
  const [area, setArea] = useState({ w: 320, h: 400 });
  const gameRef = useRef(null);
  const phaseRef = useRef("intro");
  phaseRef.current = phase;

  const start = () => {
    gameRef.current = {
      scroll: 0,
      t: 0,
      houses: [],
      nextId: 1,
      thrown: 0,
      score: 0,
      gift: null,
      pops: [],
      anim: [],
      id: 1,
      finishAt: 0,
      bannerT: 0,
    };
    setNewBest(false);
    setPhase("play");
  };

  const drop = useCallback(() => {
    const g = gameRef.current;
    if (!g || phaseRef.current !== "play" || g.gift || g.thrown >= GIFTS_TOTAL || g.finishAt) return;
    g.thrown += 1;
    g.gift = { y: SLEIGH_Y + 40 + 8 * Math.sin(g.t * 2.3), vy: 40, rot: 0 };
  }, []);

  /* el bucle del juego */
  useEffect(() => {
    if (phase !== "play") return undefined;
    let raf = 0;
    let last = performance.now();
    const loop = (now) => {
      const g = gameRef.current;
      if (!g) return;
      const dt = Math.min(0.04, (now - last) / 1000);
      last = now;
      g.t += dt;
      g.scroll += worldSpeed(g.thrown) * dt;

      // casas que van apareciendo por la derecha (las de nivel 2 vienen con alturas distintas)
      const level = g.thrown >= LEVEL2_FROM ? 2 : 1;
      for (;;) {
        const lastH = g.houses[g.houses.length - 1];
        if (lastH && lastH.x - g.scroll > W + 180) break;
        const id = g.nextId++;
        const h = makeHouse(id, 0, level);
        h.x = lastH ? lastH.x + lastH.d.w / 2 + 70 + ((id * 37) % 46) + h.d.w / 2 : SLEIGH_X + g.scroll + 300;
        h.chx = h.x + h.d.off;
        g.houses.push(h);
      }
      g.houses = g.houses.filter((h) => h.x - g.scroll > -160);

      if (g.gift) {
        const s = stepGift(g.gift, dt, g.houses, g.scroll);
        g.gift = { ...g.gift, y: s.y, vy: s.vy, rot: g.gift.rot + 90 * dt };
        if (s.end) {
          const id = g.id++;
          const wx = SLEIGH_X + g.scroll;
          if (s.end === "score") {
            g.score += 1;
            g.pops.push({ id, wx, y: s.y - 24, t: 0, text: "¡+1!", color: "#16a34a" });
            g.anim.push({ id, wx, y: s.y, vy: 90, t: 0, kind: "sink" });
          } else if (s.end === "rim") {
            g.pops.push({ id, wx, y: s.y - 24, t: 0, text: "¡Casi!", color: "#d97706" });
            g.anim.push({ id, wx, y: s.y, vy: -150, t: 0, kind: "bounce", vx: 60 });
          } else {
            g.pops.push({ id, wx, y: s.y - 20, t: 0, text: "Uy…", color: "#6b7280" });
            g.anim.push({ id, wx, y: s.y, vy: 0, t: 0, kind: "stay" });
          }
          g.gift = null;
          if (g.thrown === LEVEL2_FROM) g.bannerT = 2.6;
          if (g.thrown >= GIFTS_TOTAL) g.finishAt = now + 1500;
        }
      }
      if (g.bannerT > 0) g.bannerT -= dt;
      g.pops.forEach((p) => {
        p.t += dt;
        p.y -= 30 * dt;
      });
      g.pops = g.pops.filter((p) => p.t < 0.9);
      g.anim.forEach((a) => {
        a.t += dt;
        if (a.kind === "bounce") {
          a.vy += GRAVITY * dt;
          a.y += a.vy * dt;
          a.wx += a.vx * dt;
        } else if (a.kind === "sink") {
          a.y += a.vy * dt;
        }
      });
      g.anim = g.anim.filter((a) => a.t < (a.kind === "stay" ? 1.4 : 0.7));

      setView({
        scroll: g.scroll,
        t: g.t,
        houses: g.houses.filter((h) => h.x - g.scroll < W + 140),
        gift: g.gift,
        thrown: g.thrown,
        score: g.score,
        pops: g.pops.slice(),
        anim: g.anim.slice(),
        banner: g.bannerT > 0,
      });

      if (g.finishAt && now >= g.finishAt) {
        setFinalScore(g.score);
        const prev = readBest();
        if (g.score > prev) {
          saveBest(g.score);
          setBest(g.score);
          setNewBest(prev > 0);
        }
        setPhase("end");
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const key = (e) => {
      if (e.code === "Space" || e.code === "ArrowDown") {
        e.preventDefault();
        drop();
      }
    };
    window.addEventListener("keydown", key);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", key);
    };
  }, [phase, drop]);

  /* el escenario se achica o agranda según el espacio que deje la pantalla */
  useEffect(() => {
    if (phase === "intro") return undefined;
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

  useEffect(() => {
    if (phase === "intro") return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [phase]);

  const rules = useMemo(
    () => [
      "Papá Noel vuela siempre en el centro de la pantalla y el pueblo pasa por abajo, con casas y edificios de todo tipo. Todos tienen chimenea.",
      "Tocá la pantalla para soltar un regalo: cae derecho hacia abajo, justo debajo del trineo.",
      "Hay que soltarlo en el momento justo para que, cuando llegue abajo, la chimenea esté pasando por ahí.",
      "Si el regalo entra por la boca de la chimenea, ¡punto! Si pega en el borde o en el techo, se pierde.",
      "Son 12 regalos. Cada vez va más rápido y, desde el séptimo, las chimeneas ya no están todas a la misma altura.",
    ],
    []
  );

  if (phase === "intro") {
    return (
      <div className="card-cv p-6 md:p-10 text-center max-w-xl mx-auto" style={{ background: "#dc262615" }}>
        <motion.div className="text-7xl mb-3" animate={{ y: [-4, 4, -4] }} transition={{ duration: 2, repeat: Infinity }}>
          🎅
        </motion.div>
        <h2 className="text-4xl font-bangers tracking-wider text-cv-dark mb-2">Regalos a la Chimenea</h2>
        <p className="font-bangers text-2xl tracking-wide text-cv-green mb-2">¡Embocá los 12 regalos!</p>
        <p className="font-fredoka text-gray-600 mb-4 leading-snug">
          Papá Noel vuela y el pueblo pasa por abajo. Tocá la pantalla para <strong>soltar un regalo</strong>: cae derecho, así que
          tenés que calcular el momento justo para que entre por la chimenea que viene pasando. ¡Cada vez va más rápido!
        </p>
        <GameRulesButton title="Regalos a la Chimenea" accentColor="#dc2626" rules={rules} />
        {best > 0 && <p className="font-fredoka text-gray-500 mb-3">Tu récord: <strong>{best}</strong> de {GIFTS_TOTAL}</p>}
        <div>
          <button onClick={start} className="btn-cv-primary text-xl px-10 py-4">
            ¡A repartir!
          </button>
        </div>
      </div>
    );
  }

  const badge = { background: "#fffbeb", color: "#1a1a1a", border: "2px solid #1a1a1a", padding: "2px 12px" };
  const stageW = Math.max(120, Math.min(area.w, area.h * (W / H), 460));
  const stageH = stageW * (H / W);
  const v = view;
  const left = v ? GIFTS_TOTAL - v.thrown : GIFTS_TOTAL;
  const sc = v ? v.scroll : 0;
  const bob = v ? Math.sin(v.t * 2.3) : 0;
  const mod = (n, m) => ((n % m) + m) % m;

  const overlay = (
    <div
      className="fixed inset-0 flex flex-col"
      style={{ zIndex: 70, background: "#fff8ec", WebkitUserSelect: "none", userSelect: "none", WebkitTouchCallout: "none" }}
    >
      <div className="flex items-center justify-between gap-2 px-3 pt-3 pb-2 font-bangers tracking-wider text-lg shrink-0">
        <button
          onClick={() => {
            gameRef.current = null;
            setPhase("intro");
          }}
          className="rounded-full font-bangers"
          style={{ ...badge, background: "#fff", cursor: "pointer" }}
          aria-label="Salir del juego"
        >
          ✕ Salir
        </button>
        <span className="rounded-full" style={badge}>🏠 {phase === "end" ? finalScore : v ? v.score : 0}</span>
        {phase === "play" ? (
          <span className="rounded-full" style={badge}>🎁 {left}</span>
        ) : (
          <span className="rounded-full" style={{ ...badge, background: "#bbf7d0" }}>¡Se acabó!</span>
        )}
      </div>

      <div ref={areaRef} className="flex-1 min-h-0 flex items-center justify-center px-3 pb-3">
        <div className="relative shrink-0" style={{ width: stageW, height: stageH }}>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            width={stageW}
            height={stageH}
            onPointerDown={(e) => {
              e.preventDefault();
              drop();
            }}
            style={{ display: "block", borderRadius: 24, border: "4px solid #1a1a1a", touchAction: "none", cursor: "pointer", background: "#1e1b4b" }}
          >
            <defs>
              <linearGradient id="rg-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#1e1b4b" />
                <stop offset=".6" stopColor="#6d28d9" />
                <stop offset="1" stopColor="#f97316" />
              </linearGradient>
              <clipPath id="rg-clip">
                <rect width={W} height={H} />
              </clipPath>
            </defs>
            <g clipPath="url(#rg-clip)">
              <rect width={W} height={H} fill="url(#rg-sky)" />
              {STARS.map((s, i) => (
                <circle key={i} cx={mod(s.x - sc * 0.05, W)} cy={s.y} r={s.r} fill="#fef9c3">
                  <animate attributeName="opacity" values="1;.3;1" dur="2.4s" begin={`${-s.d}s`} repeatCount="indefinite" />
                </circle>
              ))}
              <circle cx="338" cy="44" r="20" fill="#fef9c3" opacity=".95" />

              {/* lomas lejanas (se mueven despacio) */}
              {[0, 1].map((k) => (
                <path
                  key={k}
                  transform={`translate(${-mod(sc * 0.25, W) + k * W} 0)`}
                  d={`M0 ${GROUND} V420 Q60 360 130 410 T260 395 T${W} 420 V${GROUND} Z`}
                  fill="#3b0764"
                  opacity=".55"
                />
              ))}
              {/* nubes */}
              {[0, 1].map((k) => (
                <g key={k} transform={`translate(${-mod(sc * 0.6, W) + k * W} 0)`} fill="#fff" opacity=".22">
                  {CLOUDS.map(([x, y, z], i) => (
                    <g key={i} transform={`translate(${x} ${y}) scale(${z})`}>
                      <ellipse cx="0" cy="0" rx="34" ry="9" />
                      <ellipse cx="-12" cy="-7" rx="16" ry="9" />
                      <ellipse cx="10" cy="-6" rx="14" ry="8" />
                    </g>
                  ))}
                </g>
              ))}

              {/* suelo con rayitas que pasan */}
              <rect x="0" y={GROUND} width={W} height={H - GROUND} fill="#14532d" />
              <rect x="0" y={GROUND} width={W} height="4" fill="#1a1a1a" />
              {Array.from({ length: 11 }, (_, i) => (
                <rect key={i} x={i * 40 - mod(sc, 40)} y={GROUND + 10} width="20" height="4" rx="2" fill="#fde68a" opacity=".7" />
              ))}

              {v?.houses.map((h) => (
                <g key={h.id} transform={`translate(${h.x - sc} 0)`}>
                  <House h={h} />
                </g>
              ))}

              {/* regalos que ya terminaron (se mueven con el pueblo) */}
              {v?.anim.map((a) => (
                <g key={a.id} opacity={a.kind === "sink" ? Math.max(0, 1 - a.t / 0.6) : 1}>
                  <Gift x={a.wx - sc} y={a.y - (a.kind === "stay" ? 10 : 0)} s={a.kind === "sink" ? Math.max(0.2, 1 - a.t) : 1} />
                </g>
              ))}

              {/* regalo en el aire */}
              {v?.gift && <Gift x={SLEIGH_X} y={v.gift.y} rot={v.gift.rot} />}

              {/* rayitas de viento: dan la sensación de velocidad */}
              {v &&
                [0, 1, 2, 3, 4].map((i) => (
                  <path
                    key={i}
                    d={`M${mod(i * 131 + 60 - sc * 2.4, W + 80) - 40} ${30 + i * 36 + (i % 2) * 14} h26`}
                    stroke="#fff"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    opacity=".35"
                  />
                ))}

              {/* trineo: siempre en el centro, flotando */}
              {v && (
                <g transform={`translate(${SLEIGH_X} ${SLEIGH_Y + bob * 8}) rotate(${bob * 3.5 + 1})`}>
                  <image href={FIESTAS_VEG.zanahoria} x="42" y="-26" width="34" height="50" preserveAspectRatio="xMidYMid meet" />
                  <image href={FIESTAS_VEG.rabanito} x="76" y="-24" width="34" height="48" preserveAspectRatio="xMidYMid meet" />
                  <path d="M32 18 L110 6" stroke="#1a1a1a" strokeWidth="2" fill="none" />
                  <path d="M-34 14 L34 14 L28 34 L-28 34 Z" fill="#dc2626" stroke="#1a1a1a" strokeWidth="3" strokeLinejoin="round" />
                  <path d="M-40 40 Q-46 30 -38 28 L34 40" stroke="#facc15" strokeWidth="4" fill="none" strokeLinecap="round" />
                  <path d="M-32 41 L32 41" stroke="#facc15" strokeWidth="4" strokeLinecap="round" />
                  <image href={FIESTAS_VEG.berenjena} x="-22" y="-34" width="48" height="52" preserveAspectRatio="xMidYMid meet" />
                </g>
              )}

              {/* textos flotantes */}
              {v?.pops.map((p) => (
                <text
                  key={p.id}
                  x={Math.max(30, Math.min(W - 30, p.wx - sc))}
                  y={p.y}
                  textAnchor="middle"
                  fontFamily="Bangers, Fredoka, sans-serif"
                  fontSize="26"
                  fill={p.color}
                  stroke="#fff"
                  strokeWidth="4"
                  paintOrder="stroke"
                  opacity={1 - p.t / 0.9}
                >
                  {p.text}
                </text>
              ))}

              {v?.banner && (
                <g>
                  <rect x="40" y="150" width="320" height="64" rx="16" fill="#fffbeb" stroke="#1a1a1a" strokeWidth="3" />
                  <text x="200" y="178" textAnchor="middle" fontFamily="Bangers, Fredoka, sans-serif" fontSize="26" fill="#dc2626">¡Segunda parte!</text>
                  <text x="200" y="202" textAnchor="middle" fontFamily="Fredoka, sans-serif" fontSize="15" fill="#1a1a1a">Ahora las chimeneas cambian de altura</text>
                </g>
              )}
            </g>
          </svg>

          {phase === "play" && v && v.thrown === 0 && (
            <div className="absolute inset-x-0 top-[34%] text-center pointer-events-none">
              <span className="font-bangers tracking-wider text-xl px-4 py-1 rounded-full" style={{ background: "#fffbeb", border: "2px solid #1a1a1a" }}>
                👆 ¡Tocá para soltar un regalo!
              </span>
            </div>
          )}

          {phase === "end" && (
            <div className="absolute inset-0 flex items-center justify-center p-4" style={{ background: "rgba(30,27,75,.72)", borderRadius: 24 }}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="card-cv p-5 text-center w-full"
                style={{ background: "#fffbeb" }}
              >
                <div className="text-5xl mb-1">🎅</div>
                <p className="font-bangers text-4xl tracking-wider text-cv-dark">{finalScore} de {GIFTS_TOTAL}</p>
                <p className="font-fredoka text-gray-700 mb-2">{resultMessage(finalScore)}</p>
                {newBest && <p className="font-bangers text-lg text-cv-green mb-1">🏆 ¡Nuevo récord!</p>}
                {best > 0 && <p className="font-fredoka text-sm text-gray-500 mb-3">Tu récord: {best}</p>}
                <div className="flex flex-col gap-2">
                  <button onClick={start} className="btn-cv-primary text-lg px-6 py-3">
                    🔄 Repartir de nuevo
                  </button>
                  <button
                    onClick={() => {
                      gameRef.current = null;
                      setPhase("intro");
                    }}
                    className="font-bangers tracking-wide text-lg underline text-gray-600"
                  >
                    Volver
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}
