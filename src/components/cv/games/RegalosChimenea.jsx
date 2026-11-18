import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import GameRulesButton from "./GameRulesButton";
import { FIESTAS_VEG } from "@/lib/fiestas";

/**
 * REGALOS A LA CHIMENEA
 * Papá Noel (la berenjena) cruza el cielo en su trineo, tirado por la zanahoria y el rabanito.
 * Tocá la pantalla para soltar un regalo: cae con la velocidad del trineo.
 * Si entra por la boca de una chimenea, ¡punto! Hay 12 regalos y el trineo va cada vez más rápido.
 * Una línea de puntitos muestra por dónde va a caer el regalo.
 */

const W = 400;
const H = 560;
const GROUND = 540;
const GRAVITY = 520;
const SLEIGH_Y = 74;
const GIFTS_TOTAL = 12;
const BEST_KEY = "cv-fiestas-regalos-best";

// 4 casas: centro, y de la boca de la chimenea (el borde de arriba) y color de la pared
const HOUSES = [
  { cx: 50, top: 392, wall: "#fde68a", roof: "#b91c1c" },
  { cx: 146, top: 414, wall: "#bfdbfe", roof: "#15803d" },
  { cx: 250, top: 384, wall: "#fbcfe8", roof: "#1d4ed8" },
  { cx: 350, top: 406, wall: "#bbf7d0", roof: "#b91c1c" },
].map((h) => ({ ...h, chx: h.cx + 20, apex: h.top + 30, base: h.top + 76 }));
const HALF_W = 40; // medio ancho de cada casa
const OPEN = 14; // medio ancho de la boca (si cae dentro de esto, entra)
const RIM = 25; // si cae entre OPEN y RIM, pega en el borde

function roofY(h, x) {
  const d = Math.abs(x - h.cx);
  if (d > HALF_W + 6) return null;
  return h.apex + (d / (HALF_W + 6)) * (h.base - h.apex);
}

/** un pasito de la caída; devuelve el regalo actualizado y, si terminó, cómo terminó */
function stepGift(g, dt) {
  const ny = g.y + g.vy * dt;
  const nx = g.x + g.vx * dt;
  const out = { x: nx, y: ny, vx: g.vx, vy: g.vy + GRAVITY * dt, end: null, house: -1 };
  for (let i = 0; i < HOUSES.length; i++) {
    const h = HOUSES[i];
    if (g.y < h.top && ny >= h.top) {
      const d = Math.abs(nx - h.chx);
      if (d <= OPEN) {
        out.end = "score";
        out.house = i;
        out.x = h.chx;
        out.y = h.top;
        return out;
      }
      if (d <= RIM) {
        out.end = "rim";
        out.house = i;
        return out;
      }
    }
    const ry = roofY(h, nx);
    if (ry !== null && ny >= ry && ny > h.top + 14) {
      out.end = "miss";
      out.y = ry;
      return out;
    }
  }
  if (ny >= GROUND - 8) {
    out.end = "miss";
    out.y = GROUND - 8;
  }
  return out;
}

function sleighSpeed(thrown) {
  return 95 + thrown * 11;
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

function House({ h, lit }) {
  const { cx, top, chx, apex, base, wall, roof } = h;
  const bodyTop = base - 4;
  return (
    <g>
      {/* pared */}
      <rect x={cx - HALF_W + 4} y={bodyTop} width={(HALF_W - 4) * 2} height={GROUND - bodyTop} fill={wall} stroke="#1a1a1a" strokeWidth="3" />
      {/* ventana y puerta */}
      <rect x={cx - 34} y={bodyTop + 14} width="22" height="22" rx="3" fill={lit ? "#fef08a" : "#fde68a"} stroke="#1a1a1a" strokeWidth="2.5" />
      <path d={`M${cx - 23} ${bodyTop + 14} v22 M${cx - 34} ${bodyTop + 25} h22`} stroke="#1a1a1a" strokeWidth="1.8" />
      <rect x={cx + 8} y={GROUND - 38} width="22" height="38" rx="3" fill="#92400e" stroke="#1a1a1a" strokeWidth="2.5" />
      {/* chimenea */}
      <rect x={chx - 19} y={top} width="38" height={apex + 22 - top} fill="#b45309" stroke="#1a1a1a" strokeWidth="3" />
      <path d={`M${chx - 19} ${top + 14} h38 M${chx - 19} ${top + 28} h38 M${chx - 6} ${top} v14 M${chx + 8} ${top + 14} v14`} stroke="#1a1a1a" strokeWidth="1.5" opacity=".55" />
      <rect x={chx - 23} y={top - 7} width="46" height="10" rx="3" fill="#78350f" stroke="#1a1a1a" strokeWidth="3" />
      <ellipse cx={chx} cy={top - 2} rx="14" ry="3.5" fill="#1a1a1a" />
      {/* techo */}
      <path d={`M${cx - HALF_W - 6} ${base} L${cx} ${apex} L${cx + HALF_W + 6} ${base} Z`} fill={roof} stroke="#1a1a1a" strokeWidth="3" strokeLinejoin="round" />
      {/* lucecitas en el techo */}
      {[-30, -15, 0, 15, 30].map((dx, i) => {
        const y = apex + 6 + (Math.abs(dx) / (HALF_W + 6)) * (base - apex) + 4;
        return (
          <circle key={dx} cx={cx + dx} cy={y} r="3.4" fill={LIGHT_COLORS[(i + h.cx) % 4]} stroke="#1a1a1a" strokeWidth="1">
            <animate attributeName="opacity" values="1;.25;1" dur="1.6s" begin={`${i * -0.4}s`} repeatCount="indefinite" />
          </circle>
        );
      })}
    </g>
  );
}

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
      sx: 60,
      dir: 1,
      thrown: 0,
      score: 0,
      gift: null, // regalo en el aire
      pops: [], // textos flotantes {id,x,y,t,text,color}
      anim: [], // regalos que ya terminaron {id,x,y,vy,t,kind}
      lastEnd: 0,
      id: 1,
      finishAt: 0,
    };
    setNewBest(false);
    setPhase("play");
  };

  const drop = useCallback(() => {
    const g = gameRef.current;
    if (!g || phaseRef.current !== "play" || g.gift || g.thrown >= GIFTS_TOTAL || g.finishAt) return;
    g.thrown += 1;
    g.gift = { x: g.sx, y: SLEIGH_Y + 26, vx: g.dir * sleighSpeed(g.thrown - 1) * 0.85, vy: 0, rot: 0 };
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

      // trineo
      const sp = sleighSpeed(g.thrown);
      g.sx += g.dir * sp * dt;
      if (g.sx > W + 50) g.dir = -1;
      if (g.sx < -50) g.dir = 1;

      // regalo en el aire
      if (g.gift) {
        const s = stepGift(g.gift, dt);
        g.gift = { ...g.gift, x: s.x, y: s.y, vx: s.vx, vy: s.vy, rot: g.gift.rot + g.gift.vx * dt * 1.2 };
        if (s.end) {
          const id = g.id++;
          if (s.end === "score") {
            g.score += 1;
            g.pops.push({ id, x: s.x, y: s.y - 20, t: 0, text: "¡+1!", color: "#16a34a" });
            g.anim.push({ id, x: s.x, y: s.y, vy: 90, t: 0, kind: "sink" });
          } else if (s.end === "rim") {
            g.pops.push({ id, x: s.x, y: s.y - 20, t: 0, text: "¡Casi!", color: "#d97706" });
            g.anim.push({ id, x: s.x, y: s.y, vy: -120, t: 0, kind: "bounce", vx: g.gift.vx > 0 ? 70 : -70 });
          } else {
            g.pops.push({ id, x: s.x, y: s.y - 16, t: 0, text: "Uy…", color: "#6b7280" });
            g.anim.push({ id, x: s.x, y: s.y, vy: 0, t: 0, kind: "stay" });
          }
          g.gift = null;
          if (g.thrown >= GIFTS_TOTAL) g.finishAt = now + 1500;
        }
      }
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
          a.x += a.vx * dt;
        } else if (a.kind === "sink") {
          a.y += a.vy * dt;
        }
      });
      g.anim = g.anim.filter((a) => a.t < (a.kind === "stay" ? 1.2 : 0.7));

      setView({
        sx: g.sx,
        dir: g.dir,
        gift: g.gift,
        thrown: g.thrown,
        score: g.score,
        pops: g.pops.slice(),
        anim: g.anim.slice(),
        traj: g.gift || g.thrown >= GIFTS_TOTAL ? null : trajectory(g),
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
      "Papá Noel cruza el cielo en su trineo, de un lado al otro. Tenés 12 regalos para repartir.",
      "Tocá la pantalla para soltar un regalo: cae con la velocidad del trineo, así que hay que soltarlo ANTES de estar justo arriba.",
      "La línea de puntitos te muestra por dónde va a caer.",
      "Si el regalo entra por la boca de la chimenea, ¡punto! Si pega en el borde o en el techo, se pierde.",
      "Con cada regalo el trineo va más rápido. ¡Gana el que más chimeneas acierte!",
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
          Papá Noel pasa volando y vos tocás la pantalla para <strong>soltar un regalo</strong>. Tiene que caer justo por la
          chimenea de una casa. Seguí la línea de puntitos y soltalo en el momento justo: ¡cada vez va más rápido!
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
            </defs>
            <rect width={W} height={H} fill="url(#rg-sky)" />
            {STARS.map((s, i) => (
              <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fef9c3">
                <animate attributeName="opacity" values="1;.3;1" dur="2.4s" begin={`${-s.d}s`} repeatCount="indefinite" />
              </circle>
            ))}
            <circle cx="338" cy="44" r="20" fill="#fef9c3" opacity=".95" />
            <circle cx="346" cy="38" r="18" fill="#6d28d9" opacity=".0" />
            {/* suelo */}
            <rect x="0" y={GROUND} width={W} height={H - GROUND} fill="#14532d" />
            <rect x="0" y={GROUND} width={W} height="4" fill="#1a1a1a" />
            {HOUSES.map((h, i) => (
              <House key={i} h={h} lit />
            ))}

            {/* línea de puntitos */}
            {v?.traj?.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={i === v.traj.length - 1 ? 4.5 : 2.4} fill="#fff" opacity={i === v.traj.length - 1 ? 0.95 : 0.65} />
            ))}

            {/* regalos que ya terminaron */}
            {v?.anim.map((a) => (
              <g key={a.id} opacity={a.kind === "sink" ? Math.max(0, 1 - a.t / 0.6) : 1}>
                <Gift x={a.x} y={a.y - (a.kind === "stay" ? 10 : 0)} s={a.kind === "sink" ? Math.max(0.2, 1 - a.t) : 1} />
              </g>
            ))}

            {/* regalo en el aire */}
            {v?.gift && <Gift x={v.gift.x} y={v.gift.y} rot={v.gift.rot} />}

            {/* trineo */}
            {v && (
              <g transform={`translate(${v.sx} ${SLEIGH_Y}) scale(${v.dir} 1)`}>
                {/* renos */}
                <image href={FIESTAS_VEG.zanahoria} x="42" y="-26" width="34" height="50" preserveAspectRatio="xMidYMid meet" />
                <image href={FIESTAS_VEG.rabanito} x="76" y="-24" width="34" height="48" preserveAspectRatio="xMidYMid meet" />
                <path d="M32 18 L110 6" stroke="#1a1a1a" strokeWidth="2" fill="none" />
                {/* trineo */}
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
                x={Math.max(26, Math.min(W - 26, p.x))}
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
          </svg>

          {phase === "play" && v && v.thrown === 0 && (
            <div className="absolute inset-x-0 top-[26%] text-center pointer-events-none">
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

/** puntitos de por dónde va a caer un regalo soltado ahora */
function trajectory(g) {
  let s = { x: g.sx, y: SLEIGH_Y + 26, vx: g.dir * sleighSpeed(g.thrown) * 0.85, vy: 0 };
  const pts = [];
  for (let i = 0; i < 260; i++) {
    const n = stepGift(s, 1 / 60);
    s = n;
    if (i % 5 === 4) pts.push({ x: n.x, y: n.y });
    if (n.end) {
      pts.push({ x: n.x, y: n.y });
      break;
    }
  }
  return pts;
}
