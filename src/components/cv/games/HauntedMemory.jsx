import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GameRulesButton from "./GameRulesButton";
import { HALLOWEEN_VEG } from "@/lib/halloween";
import { Bat, Cat, Ghost, Moon, Pumpkin } from "../halloween/HalloweenArt";

/**
 * CASA EMBRUJADA (variante Halloween de Memoria Verdura)
 * Todos juntos contra la luna: encontrá todas las parejas antes de que la luna cruce el cielo.
 * Nivel fácil 6 parejas/75 s, medio 8 parejas/90 s, difícil 10 parejas/100 s.
 */

const ITEMS = [
  ...["tomate", "berenjena", "zanahoria", "brocoli", "cebolla", "choclo", "calabaza", "rabanito"].map((id) => ({ id, src: HALLOWEEN_VEG[id] })),
  { id: "fantasma", Art: Ghost },
  { id: "bruja-gato", Art: Cat },
  { id: "murcielago", Art: Bat },
  { id: "jack", Art: Pumpkin },
];
const LEVELS = [
  { key: "facil", label: "Fácil", pairs: 6, seconds: 75, color: "#22c55e" },
  { key: "medio", label: "Medio", pairs: 8, seconds: 90, color: "#f97316" },
  { key: "dificil", label: "Difícil", pairs: 10, seconds: 100, color: "#a855f7" },
];

const deal = (pairs) =>
  [...ITEMS.slice(0, pairs), ...ITEMS.slice(0, pairs)]
    .sort(() => Math.random() - 0.5)
    .map((it, i) => ({ ...it, key: `${it.id}-${i}`, flipped: false, matched: false }));

function Face({ card }) {
  if (card.src) return <img src={card.src} alt="" className="w-full h-full object-contain p-1" />;
  const Art = card.Art;
  return <Art style={{ width: "78%", height: "78%" }} />;
}

export default function HauntedMemory() {
  const [level, setLevel] = useState(null);
  const [cards, setCards] = useState([]);
  const [open, setOpen] = useState([]);
  const [locked, setLocked] = useState(false);
  const [moves, setMoves] = useState(0);
  const [left, setLeft] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | playing | won | lost
  const timer = useRef(null);

  const start = (lv) => {
    setLevel(lv);
    setCards(deal(lv.pairs));
    setOpen([]);
    setLocked(false);
    setMoves(0);
    setLeft(lv.seconds);
    setStatus("playing");
  };

  useEffect(() => {
    if (status !== "playing") return undefined;
    timer.current = setInterval(() => setLeft((s) => s - 0.25), 250);
    return () => clearInterval(timer.current);
  }, [status]);

  useEffect(() => {
    if (status === "playing" && left <= 0) setStatus("lost");
  }, [left, status]);

  const flip = (idx) => {
    if (status !== "playing" || locked || cards[idx].flipped || cards[idx].matched) return;
    const next = cards.map((c, i) => (i === idx ? { ...c, flipped: true } : c));
    setCards(next);
    const opened = [...open, idx];
    setOpen(opened);
    if (opened.length === 2) {
      setLocked(true);
      setMoves((m) => m + 1);
      const [a, b] = opened;
      if (next[a].id === next[b].id) {
        const done = next.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c));
        setTimeout(() => {
          setCards(done);
          setOpen([]);
          setLocked(false);
          if (done.every((c) => c.matched)) setStatus("won");
        }, 350);
      } else {
        setTimeout(() => {
          setCards((cs) => cs.map((c, i) => (i === a || i === b ? { ...c, flipped: false } : c)));
          setOpen([]);
          setLocked(false);
        }, 900);
      }
    }
  };

  if (!level) {
    return (
      <div className="max-w-md mx-auto">
        <motion.div className="card-cv p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center text-5xl mb-1">🏚️</div>
          <h3 className="font-bangers text-cv-dark text-2xl tracking-wider text-center mb-1">Casa Embrujada</h3>
          <p className="font-fredoka text-gray-500 text-center text-sm mb-5">
            Encontrá todas las parejas antes de que salga la luna. ¡Se juega entre todos, en equipo!
          </p>
          <div className="space-y-3 mb-5">
            {LEVELS.map((lv) => (
              <button
                key={lv.key}
                onClick={() => start(lv)}
                className="w-full flex items-center justify-between font-bangers text-xl tracking-wide py-3 px-5 rounded-2xl"
                style={{ background: lv.color, color: "#fff", border: "3px solid #1a1a1a", boxShadow: "3px 3px 0 #1a1a1a" }}
              >
                <span>{lv.label}</span>
                <span className="text-base opacity-90">{lv.pairs} parejas · {lv.seconds} s</span>
              </button>
            ))}
          </div>
          <div className="flex justify-center">
            <GameRulesButton
              title="Casa Embrujada"
              accentColor="#f97316"
              rules={[
                "Todas las tarjetas empiezan boca abajo. Dá vuelta dos por turno.",
                "Si son iguales se quedan a la vista. Si no, se vuelven a tapar: ¡memorizá dónde estaban!",
                "Arriba hay una luna que va cruzando el cielo. Cuando llega al final, se acabó el tiempo.",
                "Se juega en equipo, entre todos: ganan si encuentran todas las parejas antes de que salga la luna.",
                "Ganás de 1 a 3 estrellas según cuánto tiempo te sobre.",
              ]}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  const pct = Math.max(0, Math.min(1, 1 - left / level.seconds));
  const stars = status === "won" ? (left / level.seconds > 0.5 ? 3 : left / level.seconds > 0.2 ? 2 : 1) : 0;
  const cols = level.pairs <= 6 ? "grid-cols-3 sm:grid-cols-4" : level.pairs <= 8 ? "grid-cols-4" : "grid-cols-4 sm:grid-cols-5";

  return (
    <div className="max-w-lg mx-auto">
      {/* Cielo con la luna avanzando */}
      <div className="relative h-14 rounded-2xl mb-3 overflow-hidden" style={{ background: "#1a0a2e", border: "3px solid #1a1a1a", boxShadow: "4px 4px 0 #f97316" }}>
        <div className="absolute inset-y-0 left-0" style={{ width: `${pct * 100}%`, background: "#3b1670", transition: "width .25s linear" }} />
        <Moon className="absolute top-1" style={{ left: `calc(${pct * 100}% - ${pct * 44}px)`, width: 44, transition: "left .25s linear" }} />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bangers text-white text-lg">{Math.max(0, Math.ceil(left))} s</span>
      </div>
      <div className="flex items-center justify-between mb-3">
        <span className="badge-cv">Intentos: {moves}</span>
        <span className="badge-cv">{level.label}</span>
        <button onClick={() => setLevel(null)} className="btn-cv-secondary text-sm">⚙️ Nivel</button>
      </div>

      <AnimatePresence>
        {(status === "won" || status === "lost") && (
          <motion.div
            className="text-center py-6 mb-4 rounded-2xl"
            style={{ background: status === "won" ? "#facc1520" : "#1a0a2e", border: `3px solid ${status === "won" ? "#facc15" : "#f97316"}` }}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="text-5xl mb-1">{status === "won" ? "🏆" : "🌕"}</div>
            <h3 className={`font-bangers text-2xl tracking-wider ${status === "won" ? "text-cv-dark" : "text-white"}`}>
              {status === "won" ? "¡Escaparon de la casa embrujada!" : "¡Salió la luna!"}
            </h3>
            {status === "won" ? (
              <p className="text-3xl my-1">{"⭐".repeat(stars)}{"☆".repeat(3 - stars)}</p>
            ) : (
              <p className="font-fredoka text-violet-200 text-sm my-1">Se les acabó el tiempo. ¡Probá de nuevo!</p>
            )}
            <button onClick={() => start(level)} className="mt-2 btn-cv-primary" style={{ background: "#f97316", color: "#1a1a1a" }}>
              ¡Jugar de nuevo!
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`grid gap-2 md:gap-3 ${cols}`}>
        {cards.map((card, idx) => {
          const faceUp = card.flipped || card.matched;
          return (
            <motion.button
              key={card.key}
              onClick={() => flip(idx)}
              className="aspect-square rounded-xl md:rounded-2xl flex items-center justify-center overflow-hidden"
              style={{
                border: "3px solid #1a1a1a",
                background: card.matched ? "#ffedd5" : faceUp ? "#fff7ed" : "#2e1650",
                boxShadow: card.matched ? "3px 3px 0 #f97316" : "3px 3px 0 #1a1a1a",
              }}
              animate={{ rotateY: faceUp ? 0 : 180 }}
              transition={{ duration: 0.3 }}
              whileTap={{ scale: 0.92 }}
              aria-label={faceUp ? "Tarjeta" : "Tarjeta boca abajo"}
            >
              {faceUp ? <Face card={card} /> : <span className="text-3xl" style={{ transform: "scaleX(-1)" }}>🦇</span>}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
