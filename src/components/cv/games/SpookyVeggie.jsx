import { useState } from "react";
import { motion } from "framer-motion";
import GameRulesButton from "./GameRulesButton";
import { HALLOWEEN_DRAWINGS, HALLOWEEN_VEG, HALLOWEEN_VEG_INFO } from "@/lib/halloween";

/**
 * VERDURA DISFRAZADA (variante Halloween de Verdura Misteriosa)
 * Una verdura monstruo tapada por una sábana fantasma. Podés pedir que se vuelva más transparente
 * (menos puntos) y elegís quién es entre las 8.
 */

const VEGS = HALLOWEEN_DRAWINGS.map((d) => ({ id: d.id, title: d.title, image: HALLOWEEN_VEG[d.id] }));
// La verdura está tapada por una sábana fantasma: cuanto más ayuda pedís, más transparente se pone.
const STAGES = [
  { sheet: 0.97, points: 3, label: "Sábana gruesa" },
  { sheet: 0.66, points: 2, label: "Sábana fina" },
  { sheet: 0.34, points: 1, label: "Sábana casi transparente" },
];
const OUTLINE =
  "drop-shadow(3px 0 0 #1a1a1a) drop-shadow(-3px 0 0 #1a1a1a) drop-shadow(0 3px 0 #1a1a1a) drop-shadow(0 -3px 0 #1a1a1a)";
// pliegues de la sábana: franjas de borde duro (nada de degradés suaves)
const FOLDS =
  "repeating-linear-gradient(100deg, #f5f1ff 0 26px, #ddd3f2 26px 32px, #f5f1ff 32px 58px, #cfc3ea 58px 62px)";

/** Verdura tapada por una sábana que copia su silueta (un poco más gorda, como tela encima) */
function GhostSheet({ src, alt, level, revealed }) {
  const mask = {
    WebkitMaskImage: `url(${src})`,
    maskImage: `url(${src})`,
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskSize: "100% 100%",
    maskSize: "100% 100%",
  };
  return (
    <div className="relative inline-block">
      <img src={src} alt={revealed ? alt : "Verdura misteriosa"} className="h-52 w-auto object-contain block" />
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ filter: OUTLINE }}
        initial={false}
        animate={{ opacity: revealed ? 0 : level, y: revealed ? -36 : [0, -4, 0], scale: revealed ? 1.15 : 1.07 }}
        transition={revealed ? { duration: 0.5 } : { opacity: { duration: 0.6 }, y: { duration: 3, repeat: Infinity, ease: "easeInOut" }, scale: { duration: 0.4 } }}
      >
        <div className="absolute inset-0" style={{ ...mask, background: FOLDS }} />
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
              "En cada ronda una verdura monstruo aparece tapada por una sábana fantasma: se le nota la forma, pero no los detalles.",
              "Elegí quién creés que es entre las 8 verduras.",
              "Si querés ayuda, tocá \"Mostrar más\": la sábana se va haciendo transparente, pero ganás menos puntos.",
              "Acertar con la sábana gruesa vale 3 puntos, con la sábana fina 2 y con la casi transparente 1.",
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
        style={{ background: "#1a0a2e", border: "4px solid #1a1a1a", boxShadow: "6px 6px 0 #f97316", height: 230 }}
      >
        <motion.div key={current.id + "-" + round} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
          <GhostSheet src={current.image} alt={current.title} level={STAGES[stage].sheet} revealed={revealed} />
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
