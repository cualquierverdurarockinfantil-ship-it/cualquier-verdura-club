import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import GameRulesButton from "./GameRulesButton";

/**
 * SEGUÍ LA ESTRELLA
 * Los Reyes Magos (tres verduras con corona) cruzan el desierto rumbo a Belén.
 * La estrella se mueve de lado a lado: arrastrá el dedo (o el mouse) para que la caravana quede justo debajo de su luz.
 *  - Mientras estén bajo la luz, el viaje avanza.
 *  - Se juntan regalos (oro, incienso y mirra).
 *  - Hay que esquivar las piedras y los cactus: te frenan un ratito.
 * Hay que llegar a Belén antes de que se acabe el tiempo.
 */

const W = 400;
const H = 560;
const CARAVAN_Y = 452;
const TRIP_SECONDS = 38; // segundos bajo la luz para llegar
const TIME_LIMIT = 70; // tiempo máximo
const BEAM = 62; // medio ancho de la luz de la estrella
const BEST_KEY = "cv-fiestas-reyes-best";

const KINGS = [
  // el del medio va adelante (más lejos, más chico); los de los costados, un poco atrás
  { id: "tomate", src: "/assets/fiestas/reyes/tomate.webp", dx: 0, dy: -30, z: 0.86, blanket: "#2563eb" },
  { id: "berenjena", src: "/assets/fiestas/reyes/berenjena.webp", dx: -42, dy: 0, z: 1, blanket: "#dc2626" },
  { id: "calabaza", src: "/assets/fiestas/reyes/calabaza.webp", dx: 42, dy: 0, z: 1, blanket: "#16a34a" },
];
const PESEBRE_X = 290;

const GIFT_KINDS = [
  { id: "oro", label: "Oro", color: "#facc15" },
  { id: "incienso", label: "Incienso", color: "#fb923c" },
  { id: "mirra", label: "Mirra", color: "#a855f7" },
];

function starX(t) {
  return 200 + 108 * Math.sin(t * 0.45) + 46 * Math.sin(t * 1.0 + 1);
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

const STARS = Array.from({ length: 40 }, (_, i) => ({ x: (i * 89) % 400, y: 6 + ((i * 47) % 300), r: 0.7 + (i % 3) * 0.5, d: (i % 6) * 0.5 }));

function Star({ x, y, s = 1 }) {
  const pts = [];
  for (let i = 0; i < 16; i++) {
    const r = i % 2 === 0 ? (i % 4 === 0 ? 30 : 16) : 6;
    const a = -Math.PI / 2 + (i * Math.PI) / 8;
    pts.push(`${(r * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)}`);
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r="38" fill="#fde047" opacity=".25" />
      <polygon points={pts.join(" ")} fill="#fde047" stroke="#b45309" strokeWidth="2.2" strokeLinejoin="round" />
      <circle r="5" fill="#fff" />
    </g>
  );
}

function Item({ it }) {
  if (it.type === "gift") {
    const k = GIFT_KINDS[it.kind];
    return (
      <g transform={`translate(${it.x} ${it.y})`}>
        <circle r="19" fill={k.color} opacity=".28" />
        <rect x="-11" y="-11" width="22" height="22" rx="4" fill={k.color} stroke="#1a1a1a" strokeWidth="2.2" />
        <path d="M-11 -2 h22 M0 -11 v22" stroke="#1a1a1a" strokeWidth="1.6" />
        <circle cx="0" cy="-14" r="3" fill="#fff" stroke="#1a1a1a" strokeWidth="1.4" />
      </g>
    );
  }
  if (it.sub === "cactus") {
    return (
      <g transform={`translate(${it.x} ${it.y})`}>
        <path d="M-5 16 V-14 a5 5 0 0 1 10 0 V16 Z" fill="#16a34a" stroke="#1a1a1a" strokeWidth="2.4" />
        <path d="M-5 4 h-9 a4 4 0 0 1 -4 -4 v-10 a4 4 0 0 1 8 0 v6 h5 M5 -2 h9 a4 4 0 0 0 4 -4 v-8 a4 4 0 0 0 -8 0 v4 h-5" fill="none" stroke="#1a1a1a" strokeWidth="2.4" />
        <path d="M-5 4 h-9 a4 4 0 0 1 -4 -4 v-10 a4 4 0 0 1 8 0 v6 h5" fill="none" stroke="#16a34a" strokeWidth="0.1" />
      </g>
    );
  }
  return (
    <g transform={`translate(${it.x} ${it.y})`}>
      <path d="M-18 12 L-12 -8 L2 -14 L16 -6 L20 12 Z" fill="#9ca3af" stroke="#1a1a1a" strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M-6 -4 L4 -8 M2 2 L10 0" stroke="#6b7280" strokeWidth="2" />
    </g>
  );
}

/** camello visto de atrás, con la verdura montada arriba (la manta le tapa la parte de abajo) */
function Camel({ k, step, stun }) {
  const a = Math.sin(step) * 3.5;
  const w = 62;
  return (
    <g transform={`translate(${k.dx} ${k.dy}) scale(${k.z})`}>
      {/* patas traseras */}
      <g stroke="#1a1a1a" strokeWidth="2.6" fill="#b9803f">
        <rect x="-17" y={-24 + (stun ? 0 : a)} width="11" height="24" rx="4" />
        <rect x="6" y={-24 - (stun ? 0 : a)} width="11" height="24" rx="4" />
      </g>
      <g fill="#4b2e12">
        <rect x="-17" y={-4 + (stun ? 0 : a)} width="11" height="5" rx="2" />
        <rect x="6" y={-4 - (stun ? 0 : a)} width="11" height="5" rx="2" />
      </g>
      {/* cola */}
      <path d={`M0 -36 q${a} 14 ${a * 0.5} 26`} stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx={a * 0.5} cy="-8" rx="4" ry="5" fill="#6b4423" stroke="#1a1a1a" strokeWidth="2" />
      {/* cuerpo y joroba */}
      <ellipse cx="0" cy="-40" rx="27" ry="24" fill="#c8924f" stroke="#1a1a1a" strokeWidth="3" />
      <ellipse cx="0" cy="-60" rx="15" ry="11" fill="#c8924f" stroke="#1a1a1a" strokeWidth="3" />
      {/* verdura montada */}
      <image href={k.src} x={-w / 2} y={-62 - w * 1.02 + (stun ? 4 : Math.abs(a) * 0.3)} width={w} height={w * 1.1} preserveAspectRatio="xMidYMax meet" />
      {/* manta */}
      <path d="M-24 -58 Q0 -66 24 -58 L28 -30 Q0 -22 -28 -30 Z" fill={k.blanket} stroke="#1a1a1a" strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M-27 -33 Q0 -26 27 -33" stroke="#fde047" strokeWidth="3" fill="none" />
      {[-20, -10, 0, 10, 20].map((x) => (
        <path key={x} d={`M${x} -27 v6`} stroke="#fde047" strokeWidth="2.2" strokeLinecap="round" />
      ))}
    </g>
  );
}

function Pesebre() {
  return (
    <g>
      {/* establo */}
      <rect x="-76" y="-4" width="152" height="112" fill="#7c4a1e" opacity=".0" />
      <path d="M-70 110 V30 M70 110 V30" stroke="#78350f" strokeWidth="9" strokeLinecap="round" />
      <path d="M-86 34 L0 -26 L86 34 Z" fill="#d6a741" stroke="#1a1a1a" strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M-62 28 L-40 8 M-30 26 L-8 0 M0 24 L22 2 M34 26 L54 8" stroke="#a16207" strokeWidth="3" strokeLinecap="round" />
      <rect x="-72" y="34" width="144" height="76" fill="#fde68a" opacity=".5" />
      {/* paja */}
      <ellipse cx="0" cy="110" rx="84" ry="10" fill="#d6a741" stroke="#1a1a1a" strokeWidth="2.6" />
      {/* los regalos de los reyes, en cofres */}
      {[
        { x: -34, c: "#facc15" },
        { x: 0, c: "#fb923c" },
        { x: 34, c: "#a855f7" },
      ].map((k, i) => (
        <g key={i} transform={`translate(${k.x} ${i === 1 ? 92 : 100})`}>
          <rect x="-16" y="-14" width="32" height="24" rx="4" fill={k.c} stroke="#1a1a1a" strokeWidth="2.6" />
          <path d="M-16 -4 h32 M0 -14 v24" stroke="#1a1a1a" strokeWidth="2" />
          <path d="M-16 -14 Q0 -26 16 -14" fill={k.c} stroke="#1a1a1a" strokeWidth="2.6" />
          <circle cx="0" cy="-3" r="3" fill="#fff" stroke="#1a1a1a" strokeWidth="1.6" />
        </g>
      ))}
      {/* lucecitas en el techo */}
      {[-60, -36, -12, 12, 36, 60].map((x, i) => (
        <circle key={i} cx={x} cy={30 - Math.abs(x) * 0.0 + 6} r="3.6" fill={["#ef4444", "#facc15", "#22c55e", "#3b82f6"][i % 4]} stroke="#1a1a1a" strokeWidth="1.2">
          <animate attributeName="opacity" values="1;.25;1" dur="1.6s" begin={`${i * -0.4}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {/* mulita y vaquita */}
      <ellipse cx="-62" cy="104" rx="14" ry="9" fill="#9ca3af" stroke="#1a1a1a" strokeWidth="2.4" />
      <circle cx="-74" cy="97" r="6" fill="#9ca3af" stroke="#1a1a1a" strokeWidth="2.2" />
    </g>
  );
}

export default function SeguiLaEstrella() {
  const [phase, setPhase] = useState("intro"); // intro | play | end
  const [view, setView] = useState(null);
  const [best, setBest] = useState(() => readBest());
  const [result, setResult] = useState({ arrived: false, gifts: 0, newBest: false, time: 0 });
  const [area, setArea] = useState({ w: 320, h: 400 });
  const areaRef = useRef(null);
  const svgRef = useRef(null);
  const gameRef = useRef(null);
  const targetRef = useRef(200);

  const start = () => {
    gameRef.current = {
      t: 0,
      cx: 200,
      progress: 0,
      gifts: 0,
      kinds: { oro: 0, incienso: 0, mirra: 0 },
      items: [],
      nextItem: 0.8,
      stun: 0,
      scroll: 0,
      id: 1,
      pops: [],
      arriveAt: 0,
    };
    targetRef.current = 200;
    setPhase("play");
  };

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
      const arrP = g.arriveAt ? Math.min(1, (now - g.arriveAt) / 3000) : 0;
      const sx = starX(g.t) * (1 - arrP) + PESEBRE_X * arrP;

      // caravana: sigue al dedo (más lenta si tropezó)
      const k = g.stun > 0 ? 3 : 9;
      if (g.arriveAt) {
        // llegaron: los reyes se corren a un costado y frenan
        g.cx += (100 - g.cx) * Math.min(1, 2.2 * dt);
      } else {
        g.cx += (targetRef.current - g.cx) * Math.min(1, k * dt);
        g.cx = Math.max(100, Math.min(W - 100, g.cx));
      }
      if (g.stun > 0) g.stun -= dt;

      // avanza mientras CUALQUIER parte de CUALQUIER rey toque la luz (a la altura de la caravana la luz mide ~±bw)
      const bw = 6 + (BEAM - 6) * ((CARAVAN_Y - 60) / (H - 60));
      const touching = KINGS.some((kg) => Math.abs(g.cx + kg.dx - sx) <= bw + 30 * kg.z);
      const aligned = !g.arriveAt && touching && g.stun <= 0;
      if (aligned && !g.arriveAt) g.progress += dt;
      const speed = g.arriveAt ? 150 * (1 - arrP) : aligned ? 150 : g.stun > 0 ? 20 : 45;
      g.scroll = (g.scroll + speed * dt) % 80;
      g.walk = (g.walk || 0) + (speed * dt) / 14;

      // cosas que aparecen en el camino (cerca de la luz de la estrella, para tentar a salirse)
      if (!g.arriveAt) {
        g.nextItem -= dt;
        if (g.nextItem <= 0) {
          g.nextItem = 0.75 + Math.random() * 0.6;
          const gift = Math.random() < 0.55;
          const x = gift ? 40 + Math.random() * 320 : 40 + Math.random() * 320;
          g.items.push(
            gift
              ? { id: g.id++, type: "gift", kind: Math.floor(Math.random() * 3), x, y: -20 }
              : { id: g.id++, type: "hazard", sub: Math.random() < 0.5 ? "cactus" : "piedra", x, y: -20 }
          );
        }
      }
      for (const it of g.items) it.y += speed * 1.1 * dt + 40 * dt;
      // choques
      g.items = g.items.filter((it) => {
        const near = Math.abs(it.x - g.cx) < 72 && Math.abs(it.y - CARAVAN_Y) < 28;
        if (near) {
          if (it.type === "gift") {
            g.gifts += 1;
            g.kinds[GIFT_KINDS[it.kind].id] += 1;
            g.pops.push({ id: g.id++, x: it.x, y: it.y - 10, t: 0, text: `+${GIFT_KINDS[it.kind].label}`, color: "#ca8a04" });
          } else if (g.stun <= 0) {
            g.stun = 1.2;
            g.progress = Math.max(0, g.progress - 1.5);
            g.pops.push({ id: g.id++, x: it.x, y: it.y - 10, t: 0, text: "¡Ay!", color: "#dc2626" });
          } else {
            return true;
          }
          return false;
        }
        return it.y < H + 30;
      });
      g.pops.forEach((p) => {
        p.t += dt;
        p.y -= 34 * dt;
      });
      g.pops = g.pops.filter((p) => p.t < 0.9);

      const arrived = g.progress >= TRIP_SECONDS;
      if (arrived && !g.arriveAt) g.arriveAt = now;

      setView({
        sx,
        cx: g.cx,
        progress: g.progress / TRIP_SECONDS,
        aligned,
        stun: g.stun > 0,
        items: g.items.slice(),
        pops: g.pops.slice(),
        scroll: g.scroll,
        walk: g.walk || 0,
        left: Math.max(0, TIME_LIMIT - g.t),
        gifts: g.gifts,
        arriving: !!g.arriveAt,
        arriveP: arrP,
      });

      const timeUp = g.t >= TIME_LIMIT;
      if ((g.arriveAt && now - g.arriveAt > 4600) || timeUp) {
        const arrivedOk = !!g.arriveAt;
        const score = (arrivedOk ? 5 : 0) + g.gifts;
        const prev = readBest();
        if (score > prev) {
          saveBest(score);
          setBest(score);
        }
        setResult({ arrived: arrivedOk, gifts: g.gifts, kinds: { ...g.kinds }, newBest: score > prev && prev > 0, score, pct: Math.round((g.progress / TRIP_SECONDS) * 100) });
        setPhase("end");
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

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
      "Los tres Reyes Magos viajan de noche rumbo a Belén, guiados por la estrella.",
      "Arrastrá el dedo (o el mouse) de lado a lado para que la caravana quede justo bajo la luz de la estrella.",
      "Solo avanzan mientras están bajo la luz. Si se desvían, se frenan.",
      "Juntá los regalos (oro, incienso y mirra) pasando por encima. Esquivá las piedras y los cactus: te frenan y te hacen perder camino.",
      "Si llegás a Belén antes de que se acabe el tiempo, ¡ganás! Cuantos más regalos lleves, mejor puntaje.",
    ],
    []
  );

  const moveTo = (clientX) => {
    const r = svgRef.current?.getBoundingClientRect();
    if (!r) return;
    targetRef.current = ((clientX - r.left) / r.width) * W;
  };

  if (phase === "intro") {
    return (
      <div className="card-cv p-6 md:p-10 text-center max-w-xl mx-auto" style={{ background: "#facc1520" }}>
        <motion.div className="text-7xl mb-3" animate={{ scale: [1, 1.15, 1], rotate: [0, 8, 0] }} transition={{ duration: 2.2, repeat: Infinity }}>
          ⭐
        </motion.div>
        <h2 className="text-4xl font-bangers tracking-wider text-cv-dark mb-2">Seguí la Estrella</h2>
        <p className="font-bangers text-2xl tracking-wide text-cv-green mb-2">¡Llevá a los Reyes hasta Belén!</p>
        <p className="font-fredoka text-gray-600 mb-4 leading-snug">
          Los tres Reyes Magos cruzan el desierto de noche. <strong>Arrastrá</strong> para mantenerlos bajo la luz de la estrella,
          juntá el oro, el incienso y la mirra, y esquivá piedras y cactus. ¡Hay que llegar antes de que se acabe el tiempo!
        </p>
        <GameRulesButton title="Seguí la Estrella" accentColor="#ca8a04" rules={rules} />
        {best > 0 && <p className="font-fredoka text-gray-500 mb-3">Tu mejor puntaje: <strong>{best}</strong></p>}
        <div>
          <button onClick={start} className="btn-cv-primary text-xl px-10 py-4">
            ¡A seguir la estrella!
          </button>
        </div>
      </div>
    );
  }

  const badge = { background: "#fffbeb", color: "#1a1a1a", border: "2px solid #1a1a1a", padding: "2px 12px" };
  const stageW = Math.max(120, Math.min(area.w, area.h * (W / H), 460));
  const stageH = stageW * (H / W);
  const v = view;
  

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
        <span className="rounded-full" style={badge}>🎁 {phase === "end" ? result.gifts : v ? v.gifts : 0}</span>
        {phase === "play" ? (
          <span className="rounded-full" style={{ ...badge, background: v && v.left <= 10 ? "#fecaca" : "#fffbeb" }}>⏱ {v ? Math.ceil(v.left) : TIME_LIMIT}s</span>
        ) : (
          <span className="rounded-full" style={{ ...badge, background: result.arrived ? "#bbf7d0" : "#fde68a" }}>{result.arrived ? "¡Llegaron!" : "¡Se acabó!"}</span>
        )}
      </div>

      {phase === "play" && (
        <div className="h-3 rounded-full overflow-hidden mx-3 mb-2 shrink-0" style={{ background: "#e5e7eb", border: "2px solid #1a1a1a" }}>
          <div className="h-full" style={{ width: `${Math.min(100, (v?.progress || 0) * 100)}%`, background: "#facc15" }} />
        </div>
      )}

      <div ref={areaRef} className="flex-1 min-h-0 flex items-center justify-center px-3 pb-3">
        <div className="relative shrink-0" style={{ width: stageW, height: stageH }}>
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            width={stageW}
            height={stageH}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture?.(e.pointerId);
              moveTo(e.clientX);
            }}
            onPointerMove={(e) => moveTo(e.clientX)}
            style={{ display: "block", borderRadius: 24, border: "4px solid #1a1a1a", touchAction: "none", cursor: "ew-resize", background: "#1e1b4b" }}
          >
            <defs>
              <linearGradient id="rs-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#0f172a" />
                <stop offset=".55" stopColor="#4c1d95" />
                <stop offset="1" stopColor="#f59e0b" />
              </linearGradient>
              <linearGradient id="rs-beam" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#fde047" stopOpacity=".7" />
                <stop offset="1" stopColor="#fde047" stopOpacity=".12" />
              </linearGradient>
              <linearGradient id="rs-sand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#fbbf24" />
                <stop offset="1" stopColor="#d97706" />
              </linearGradient>
            </defs>
            <rect width={W} height={H} fill="url(#rs-sky)" />
            {STARS.map((s, i) => (
              <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fef9c3">
                <animate attributeName="opacity" values="1;.3;1" dur="2.6s" begin={`${-s.d}s`} repeatCount="indefinite" />
              </circle>
            ))}
            {/* dunas */}
            <path d="M0 150 Q90 112 190 146 T400 132 V560 H0 Z" fill="#b45309" opacity=".55" />
            <rect x="0" y="170" width={W} height={H - 170} fill="url(#rs-sand)" />
            <path d="M0 170 Q100 150 200 170 T400 168" fill="#fbbf24" stroke="#92400e" strokeWidth="2" />
            {/* rayas del camino que pasan */}
            {v &&
              [0, 1, 2, 3, 4, 5, 6].map((i) => (
                <path key={i} d={`M${60 + (i % 2) * 140} ${170 + ((i * 80 + v.scroll) % 400)} q40 -8 80 0`} stroke="#b45309" strokeWidth="3" fill="none" opacity=".4" />
              ))}

            {v && (
              <>
                {/* luz de la estrella */}
                <polygon points={`${v.sx - 6},60 ${v.sx + 6},60 ${v.sx + BEAM},${H} ${v.sx - BEAM},${H}`} fill="url(#rs-beam)" />
                <Star x={v.sx} y={52} s={1.1} />

                {/* el pesebre aparece al llegar */}
                {v.arriving && (
                  <g opacity={Math.min(1, v.arriveP * 2.2)} transform={`translate(${PESEBRE_X} ${196 - (1 - v.arriveP) * 24})`}>
                    <Pesebre />
                  </g>
                )}

                {v.items.map((it) => (
                  <Item key={it.id} it={it} />
                ))}

                {/* caravana */}
                <g transform={`translate(${v.cx} ${CARAVAN_Y})`} opacity={v.stun ? 0.65 : 1}>
                  {v.aligned && <ellipse cx="0" cy="22" rx="86" ry="12" fill="#fde047" opacity=".35" />}
                  {KINGS.map((k) => (
                    <Camel key={k.id} k={k} step={v.walk} stun={v.stun || v.arriveP >= 0.85} />
                  ))}
                </g>

                {v.pops.map((p) => (
                  <text key={p.id} x={Math.max(34, Math.min(W - 34, p.x))} y={p.y} textAnchor="middle" fontFamily="Bangers, Fredoka, sans-serif" fontSize="24" fill={p.color} stroke="#fff" strokeWidth="4" paintOrder="stroke" opacity={1 - p.t / 0.9}>
                    {p.text}
                  </text>
                ))}
              </>
            )}
          </svg>

          {phase === "play" && v && !v.aligned && !v.arriving && !v.stun && (
            <div className="absolute inset-x-0 bottom-[6%] text-center pointer-events-none">
              <span className="font-bangers tracking-wider text-lg px-4 py-1 rounded-full" style={{ background: "#fffbeb", border: "2px solid #1a1a1a" }}>
                ⭐ ¡Volvé a la luz de la estrella!
              </span>
            </div>
          )}

          {phase === "end" && (
            <div className="absolute inset-0 flex items-center justify-center p-4" style={{ background: "rgba(30,27,75,.72)", borderRadius: 24 }}>
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card-cv p-5 text-center w-full" style={{ background: "#fffbeb" }}>
                <div className="text-5xl mb-1">{result.arrived ? "👑" : "🐪"}</div>
                <p className="font-bangers text-3xl tracking-wider text-cv-dark">{result.arrived ? "¡Llegaste a Belén!" : "No alcanzaron…"}</p>
                <p className="font-fredoka text-gray-700 mb-2">
                  {result.arrived
                    ? `Dejaron ${result.kinds?.oro || 0} cofres de oro, ${result.kinds?.incienso || 0} de incienso y ${result.kinds?.mirra || 0} de mirra. ¡Felices fiestas y feliz Día de Reyes!`
                    : `Hicieron el ${result.pct}% del camino. ¡Probá de nuevo y seguí bien la luz!`}
                </p>
                <p className="font-bangers text-xl text-cv-green">Puntaje: {result.score}</p>
                {result.newBest && <p className="font-bangers text-lg text-cv-green">🏆 ¡Nuevo récord!</p>}
                {best > 0 && <p className="font-fredoka text-sm text-gray-500 mb-3">Tu mejor puntaje: {best}</p>}
                <div className="flex flex-col gap-2">
                  <button onClick={start} className="btn-cv-primary text-lg px-6 py-3">
                    🔄 Jugar de nuevo
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
