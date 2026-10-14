import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GameRulesButton from "./GameRulesButton";
import { HALLOWEEN_DRAWINGS, HALLOWEEN_VEG, HALLOWEEN_VEG_INFO } from "@/lib/halloween";

/**
 * VERDURA DISFRAZADA (variante Halloween de Verdura Misteriosa)
 * Una verdura monstruo tapada por una sábana fantasma. Una mano la levanta de a poco si pedís ayuda
 * (menos puntos) y elegís quién es entre las 8.
 */

const VEGS = HALLOWEEN_DRAWINGS.map((d) => ({ id: d.id, title: d.title, image: HALLOWEEN_VEG[d.id] }));
// La verdura está tapada por una sábana fantasma que una mano va levantando de a poco:
// cada ayuda deja ver un tramo más del dibujo, de abajo hacia arriba.
const STAGES = [
  { lift: 0, points: 4, label: "Tapada del todo" },
  { lift: 0.2, points: 3, label: "Se asoma la base" },
  { lift: 0.4, points: 2, label: "A mitad de camino" },
  { lift: 0.6, points: 1, label: "Casi sin sábana" },
];
const IMG_H = 176; // alto del dibujo en px (h-44)

/**
 * Sábana colgando: toma la forma de la verdura solo ARRIBA (donde apoya) y de ahí cae derecha
 * hasta abajo, con el borde ondulado. Se calcula una vez por imagen leyendo su transparencia.
 */
const sheetCache = {};
function buildSheet(img) {
  const iw = img.naturalWidth, ih = img.naturalHeight;
  const W = (iw / ih) * 100, H = 100;
  const cw = 160, ch = Math.max(20, Math.round((cw * ih) / iw));
  const cv = document.createElement("canvas");
  cv.width = cw; cv.height = ch;
  const ctx = cv.getContext("2d");
  ctx.drawImage(img, 0, 0, cw, ch);
  const data = ctx.getImageData(0, 0, cw, ch).data;
  const top = new Array(cw).fill(null);
  for (let x = 0; x < cw; x++) {
    for (let y = 0; y < ch; y++) {
      if (data[(y * cw + x) * 4 + 3] > 40) { top[x] = y; break; }
    }
  }
  const xs = top.map((v, i) => (v === null ? -1 : i)).filter((i) => i >= 0);
  const minC = xs[0], maxC = xs[xs.length - 1];
  // huecos entre hojas: la tela pasa por arriba (cierre morfológico)
  const r = Math.round(cw * 0.14);
  let env = [];
  for (let x = minC; x <= maxC; x++) {
    let m = Infinity;
    for (let k = Math.max(minC, x - r); k <= Math.min(maxC, x + r); k++) if (top[k] !== null && top[k] < m) m = top[k];
    env.push(m === Infinity ? ch * 0.5 : m);
  }
  for (let pass = 0; pass < 5; pass++) {
    env = env.map((_, i) => {
      let sum = 0, n = 0;
      for (let k = Math.max(0, i - 8); k <= Math.min(env.length - 1, i + 8); k++) { sum += env[k]; n++; }
      return sum / n;
    });
  }
  const toX = (c) => (c / cw) * W;
  const toY = (row) => (row / ch) * H - 3.5; // un poco más arriba: el grosor de la tela
  const x0 = toX(minC) - 2.5, x1 = toX(maxC + 1) + 2.5, flare = 5;
  const pts = env.map((v, i) => [toX(minC + i), toY(v)]);
  let d = `M ${x0 - flare} 98 C ${x0 - 1} 80, ${x0} ${pts[0][1] + 18}, ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 2; i < pts.length; i += 2) d += ` L ${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)}`;
  const last = pts[pts.length - 1];
  d += ` L ${last[0].toFixed(1)} ${last[1].toFixed(1)} C ${x1} ${last[1] + 18}, ${x1 + 1} 80, ${x1 + flare} 98`;
  // borde ondulado abajo (de derecha a izquierda)
  const n = 5, left = x0 - flare, right = x1 + flare, step = (right - left) / n;
  for (let i = 0; i < n; i++) {
    const xr = right - i * step;
    d += ` Q ${(xr - step / 2).toFixed(1)} 106.5, ${(xr - step).toFixed(1)} 98`;
  }
  d += " Z";
  // pliegues: salen del punto más alto y bajan abriéndose
  let peak = 0;
  pts.forEach((p, i) => { if (p[1] < pts[peak][1]) peak = i; });
  const [px, py] = pts[peak];
  const folds = [-0.9, -0.45, 0.05, 0.5, 0.95].map((t) => {
    const ex = px + t * ((right - left) / 2) * 0.95;
    return `M ${px.toFixed(1)} ${(py + 2).toFixed(1)} Q ${((px + ex) / 2 + t * 4).toFixed(1)} ${(py + 45).toFixed(1)}, ${ex.toFixed(1)} 99`;
  });
  return { d, folds, W, px, py };
}

function useSheet(src) {
  const [sheet, setSheet] = useState(sheetCache[src] || null);
  useEffect(() => {
    if (sheetCache[src]) { setSheet(sheetCache[src]); return undefined; }
    let alive = true;
    const img = new Image();
    img.onload = () => {
      try {
        sheetCache[src] = buildSheet(img);
        if (alive) setSheet(sheetCache[src]);
      } catch {
        /* sin canvas: queda la sábana genérica */
      }
    };
    img.src = src;
    return () => { alive = false; };
  }, [src]);
  return sheet;
}

const GENERIC = { d: "M 8 98 C 6 60, 20 12, 60 10 C 100 12, 114 60, 112 98 Q 99 106 86 98 Q 73 106 60 98 Q 47 106 34 98 Q 21 106 8 98 Z", folds: ["M 60 14 Q 50 55 38 99", "M 60 14 Q 60 55 60 99", "M 60 14 Q 70 55 82 99"], W: 120, px: 60, py: 10 };

/** Mano monstruo que agarra la sábana desde arriba (sale del borde superior) */
function Grabber({ x, y }) {
  const skin = "#86efac";
  const ink = { stroke: "#1a1a1a", strokeLinejoin: "round", strokeLinecap: "round" };
  return (
    <g>
      {/* brazo con manga */}
      <rect x={x - 6} y={y - 90} width="12" height="74" rx="3" fill="#6d28d9" {...ink} strokeWidth="2.4" />
      <rect x={x - 6.5} y={y - 24} width="13" height="7" rx="2" fill="#f97316" {...ink} strokeWidth="2.2" />
      {/* dedos que pellizcan la punta de la tela */}
      <path d={`M ${x - 5} ${y - 14} Q ${x - 9} ${y - 4}, ${x - 1.5} ${y + 3}`} fill="none" stroke="#1a1a1a" strokeWidth="7" {...ink} />
      <path d={`M ${x + 5} ${y - 14} Q ${x + 9} ${y - 4}, ${x + 1.5} ${y + 3}`} fill="none" stroke="#1a1a1a" strokeWidth="7" {...ink} />
      <path d={`M ${x - 5} ${y - 14} Q ${x - 9} ${y - 4}, ${x - 1.5} ${y + 3}`} fill="none" stroke={skin} strokeWidth="4" strokeLinecap="round" />
      <path d={`M ${x + 5} ${y - 14} Q ${x + 9} ${y - 4}, ${x + 1.5} ${y + 3}`} fill="none" stroke={skin} strokeWidth="4" strokeLinecap="round" />
      <ellipse cx={x} cy={y - 14} rx="8" ry="6.5" fill={skin} {...ink} strokeWidth="2.4" />
      <circle cx={x - 3.2} cy={y + 3} r="1.2" fill="#1a1a1a" />
      <circle cx={x + 3.2} cy={y + 3} r="1.2" fill="#1a1a1a" />
    </g>
  );
}

/** Verdura tapada por una sábana que cuelga sobre ella y una mano levanta de a poco */
function GhostSheet({ src, alt, lift, revealed }) {
  const sheet = useSheet(src) || GENERIC;
  const clipId = "sheet-clip-" + src.replace(/[^a-z]/gi, "");
  return (
    <div className="relative inline-block">
      <img src={src} alt={revealed ? alt : "Verdura misteriosa"} className="h-44 w-auto object-contain block" />
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        initial={false}
        animate={{ y: revealed ? -360 : -lift * IMG_H * 0.98 }}
        transition={{ duration: revealed ? 0.8 : 1.1, ease: "easeInOut" }}
      >
        <motion.svg
          viewBox={`0 0 ${sheet.W} 100`}
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
          style={{ overflow: "visible", transformOrigin: "50% 0%" }}
          animate={{ rotate: [-1.4, 1.4, -1.4] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <defs><clipPath id={clipId}><path d={sheet.d} /></clipPath></defs>
          <path d={sheet.d} fill="#f5f1ff" />
          <g clipPath={`url(#${clipId})`} fill="none" stroke="#cfc3ea" strokeWidth="2.4" strokeLinecap="round">
            {sheet.folds.map((f, i) => <path key={i} d={f} />)}
          </g>
          <path d={sheet.d} fill="none" stroke="#1a1a1a" strokeWidth="3" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          <Grabber x={sheet.px} y={sheet.py} />
        </motion.svg>
      </motion.div>
    </div>
  );
}

const COLORS = ["#f97316", "#a855f7", "#22c55e", "#06b6d4", "#ec4899", "#facc15"];

const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);
function buildQueue(rounds, players) {
  const total = rounds * players;
  const q = [];
  while (q.length < total) q.push(...shuffle(VEGS));
  return q.slice(0, total);
}

function Setup({ onStart }) {
  const [count, setCount] = useState(1);
  const [names, setNames] = useState({});
  const [rounds, setRounds] = useState(8);
  const pill = (active, color) =>
    active
      ? { background: color, color: "#fff", border: "3px solid #1a1a1a", boxShadow: "3px 3px 0 #1a1a1a" }
      : { background: "#f3f4f6", color: "#1a1a1a", border: "3px solid #1a1a1a" };
  return (
    <div className="max-w-md mx-auto">
      <motion.div className="card-cv p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h3 className="font-bangers text-cv-dark text-2xl tracking-wider text-center mb-1">¿Cuántos jugadores?</h3>
        <p className="font-fredoka text-gray-500 text-center text-sm mb-4">Elegí de 1 a 4 jugadores</p>
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[1, 2, 3, 4].map((n) => (
            <button key={n} onClick={() => setCount(n)} className="font-bangers text-xl py-3 rounded-2xl" style={pill(count === n, "#f97316")}>{n}</button>
          ))}
        </div>
        <div className="space-y-2 mb-5">
          {Array.from({ length: count }, (_, i) => (
            <input
              key={i}
              type="text"
              placeholder={`Nombre del Jugador ${i + 1} (opcional)`}
              value={names[i] || ""}
              onChange={(e) => setNames({ ...names, [i]: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 font-fredoka focus:outline-none focus:border-cv-orange"
            />
          ))}
        </div>
        <h3 className="font-bangers text-cv-dark text-xl tracking-wider text-center mb-3">¿Cuántas rondas?</h3>
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[5, 8, 12].map((r) => (
            <button key={r} onClick={() => setRounds(r)} className="font-bangers text-lg py-2.5 rounded-2xl" style={pill(rounds === r, "#a855f7")}>{r}</button>
          ))}
        </div>
        <div className="flex justify-center mb-4">
          <GameRulesButton
            title="Verdura Disfrazada"
            accentColor="#f97316"
            rules={[
              "En cada ronda una verdura monstruo aparece tapada por una sábana fantasma: apenas se le adivina el contorno de arriba.",
              "Elegí quién creés que es entre las 8 verduras.",
              "Si querés ayuda, tocá \"Mostrar más\": una mano levanta la sábana de a poquito y se ve el dibujo de abajo hacia arriba, pero ganás menos puntos.",
              "Acertar con la verdura tapada del todo vale 4 puntos, y cada vez que levantan la sábana baja un punto (3, 2 y 1).",
              "Si te equivocás, no sumás puntos y pasa el turno. Gana quien más puntos junte al terminar todas las rondas.",
            ]}
          />
        </div>
        <button
          onClick={() => onStart(Array.from({ length: count }, (_, i) => ({ id: i, name: names[i]?.trim() || `Jugador ${i + 1}`, score: 0 })), rounds)}
          className="btn-cv-primary w-full justify-center"
          style={{ background: "#f97316", color: "#1a1a1a" }}
        >
          🦇 ¡Comenzar!
        </button>
      </motion.div>
    </div>
  );
}

export default function SpookyVeggie() {
  const [players, setPlayers] = useState(null);
  const [queue, setQueue] = useState([]);
  const [round, setRound] = useState(0);
  const [stage, setStage] = useState(0);
  const [result, setResult] = useState(null); // { ok, gained }
  const [totalRounds, setTotalRounds] = useState(8);

  if (!players) {
    return (
      <Setup
        onStart={(list, rounds) => {
          setPlayers(list);
          setTotalRounds(rounds);
          setQueue(buildQueue(rounds, list.length));
          setRound(0);
          setStage(0);
          setResult(null);
        }}
      />
    );
  }

  const finished = round >= queue.length;
  const current = queue[round];
  const turn = round % players.length;

  const guess = (id) => {
    if (result) return;
    const ok = id === current.id;
    const gained = ok ? STAGES[stage].points : 0;
    if (ok) setPlayers((ps) => ps.map((p, i) => (i === turn ? { ...p, score: p.score + gained } : p)));
    setResult({ ok, gained, picked: id });
  };
  const next = () => {
    setRound((r) => r + 1);
    setStage(0);
    setResult(null);
  };
  const again = () => setPlayers(null);

  if (finished) {
    const max = Math.max(...players.map((p) => p.score));
    const winners = players.filter((p) => p.score === max);
    return (
      <div className="max-w-md mx-auto text-center card-cv p-6">
        <div className="text-6xl mb-2">🏆</div>
        <h3 className="font-bangers text-cv-dark text-3xl tracking-wider mb-3">
          {players.length === 1 ? "¡Terminaste la noche!" : winners.length > 1 ? "¡Empate monstruoso!" : `¡Ganó ${winners[0].name}!`}
        </h3>
        <div className="flex flex-wrap gap-2 justify-center mb-5">
          {players.map((p, i) => (
            <span key={p.id} className="badge-cv" style={{ borderColor: COLORS[i % COLORS.length] }}>{p.name}: {p.score} pts</span>
          ))}
        </div>
        <button onClick={again} className="btn-cv-primary" style={{ background: "#f97316", color: "#1a1a1a" }}>¡Jugar de nuevo!</button>
      </div>
    );
  }

  const revealed = !!result;
  return (
    <div className="max-w-lg mx-auto">
      <div className="flex flex-wrap gap-2 justify-center mb-3">
        {players.map((p, i) => (
          <div
            key={p.id}
            className="px-3 py-1.5 rounded-full font-fredoka text-sm font-bold"
            style={{
              background: i === turn ? COLORS[i % COLORS.length] : "#f3f4f6",
              color: i === turn ? "#fff" : "#1a1a1a",
              border: "2px solid #1a1a1a",
            }}
          >
            {p.name} · {p.score} pts
          </div>
        ))}
      </div>
      <p className="text-center font-fredoka text-sm text-gray-500 mb-2">
        Ronda {Math.floor(round / players.length) + 1} de {totalRounds}
        {players.length > 1 ? ` · Turno de ${players[turn].name}` : ""}
      </p>

      <div
        className="rounded-3xl flex items-center justify-center mb-4 overflow-hidden"
        style={{ background: "#1a0a2e", border: "4px solid #1a1a1a", boxShadow: "6px 6px 0 #f97316", height: 270 }}
      >
        <motion.div key={current.id + "-" + round} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
          <GhostSheet src={current.image} alt={current.title} lift={STAGES[stage].lift} revealed={revealed} />
        </motion.div>
      </div>

      {!revealed ? (
        <>
          <div className="flex items-center justify-between mb-3">
            <span className="badge-cv">Vale {STAGES[stage].points} pts · {STAGES[stage].label}</span>
            {stage < STAGES.length - 1 && (
              <button onClick={() => setStage((s) => s + 1)} className="btn-cv-secondary text-sm">👻 Mostrar más</button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {VEGS.map((v) => (
              <button
                key={v.id}
                onClick={() => guess(v.id)}
                className="font-bangers tracking-wide text-base py-3 px-2 rounded-2xl"
                style={{ background: "#fff7ed", border: "3px solid #1a1a1a", boxShadow: "3px 3px 0 #1a1a1a", color: "#1a1a1a" }}
              >
                {v.title}
              </button>
            ))}
          </div>
        </>
      ) : (
        <motion.div className="card-cv p-5 text-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: result.ok ? "#dcfce7" : "#fee2e2" }}>
          <h3 className="font-bangers text-2xl tracking-wider text-cv-dark mb-1">
            {result.ok ? `¡Acertaste! +${result.gained} pts` : "¡Uy, no era esa!"}
          </h3>
          <p className="font-fredoka text-gray-700 mb-1">Era <strong>{current.title}</strong>: {HALLOWEEN_VEG_INFO[current.id].role}.</p>
          <p className="font-fredoka text-gray-500 text-sm mb-4">{HALLOWEEN_VEG_INFO[current.id].curiosity}</p>
          <button onClick={next} className="btn-cv-primary" style={{ background: "#f97316", color: "#1a1a1a" }}>
            {round + 1 >= queue.length ? "Ver resultados" : "Siguiente →"}
          </button>
        </motion.div>
      )}
    </div>
  );
}
