import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CARD_ITEMS = [
  { id: "tomate", emoji: "🍅", label: "Tomate" },
  { id: "brocoli", emoji: "🥦", label: "Brócoli" },
  { id: "zanahoria", emoji: "🥕", label: "Zanahoria" },
  { id: "berenjena", emoji: "🍆", label: "Berenjena" },
  { id: "choclo", emoji: "🌽", label: "Choclo" },
  { id: "cebolla", emoji: "🧅", label: "Cebolla" },
  { id: "papa", emoji: "🥔", label: "Papa" },
  { id: "pimiento", emoji: "🫑", label: "Pimiento" },
  { id: "pepino", emoji: "🥒", label: "Pepino" },
  { id: "hongo", emoji: "🍄", label: "Hongo" },
  { id: "guitarra", emoji: "🎸", label: "Guitarra" },
  { id: "microfono", emoji: "🎤", label: "Micrófono" },
];

const PLAYERS = [
  { emoji: "🍅", name: "Tomate", color: "#ef4444" },
  { emoji: "🍆", name: "Berenjena", color: "#a855f7" },
  { emoji: "🌽", name: "Choclo", color: "#facc15" },
  { emoji: "🥕", name: "Zanahoria", color: "#f97316" },
];

function shuffle(arr) {
  return [...arr, ...arr]
    .sort(() => Math.random() - 0.5)
    .map((item, i) => ({ ...item, key: `${item.id}-${i}`, flipped: false, matched: false }));
}

function getGridClass(pairs) {
  const total = pairs * 2;
  if (total <= 16) return "grid-cols-4";
  if (total <= 20) return "grid-cols-4 md:grid-cols-5";
  return "grid-cols-4 md:grid-cols-6";
}

function SetupScreen({ onStart }) {
  const [count, setCount] = useState(1);
  const [names, setNames] = useState({});
  const [pairs, setPairs] = useState(8);

  const handleStart = () => {
    const playerNames = Array.from({ length: count }, (_, i) =>
      names[i]?.trim() || `Jugador ${i + 1}`
    );
    onStart(count, playerNames, pairs);
  };

  return (
    <div className="max-w-md mx-auto">
      <motion.div className="card-cv p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h3 className="font-bangers text-cv-dark text-2xl tracking-wider text-center mb-1">
          ¿Cuántos jugadores?
        </h3>
        <p className="font-fredoka text-gray-500 text-center text-sm mb-4">
          Elegí de 1 a 4 jugadores
        </p>
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => setCount(n)}
              className="font-bangers text-xl py-3 rounded-2xl transition-all"
              style={count === n ? {
                background: "#22c55e", color: "#fff",
                border: "3px solid #1a1a1a", boxShadow: "3px 3px 0 #1a1a1a",
              } : {
                background: "#f3f4f6", color: "#1a1a1a",
                border: "3px solid #1a1a1a",
              }}
            >
              {n}
            </button>
          ))}
        </div>

        <div className="space-y-2 mb-6">
          {Array.from({ length: count }, (_, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-2xl">{PLAYERS[i % PLAYERS.length].emoji}</span>
              <input
                type="text"
                placeholder={`Jugador ${i + 1}`}
                value={names[i] || ""}
                onChange={(e) => setNames({ ...names, [i]: e.target.value })}
                className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-200 font-fredoka focus:outline-none focus:border-cv-green transition-colors"
              />
            </div>
          ))}
        </div>

        <h3 className="font-bangers text-cv-dark text-xl tracking-wider text-center mb-3">
          ¿Cuántos pares de tarjetas?
        </h3>
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[6, 8, 10, 12].map((p) => (
            <button
              key={p}
              onClick={() => setPairs(p)}
              className="font-bangers text-lg py-2.5 rounded-2xl transition-all"
              style={pairs === p ? {
                background: "#06b6d4", color: "#fff",
                border: "3px solid #1a1a1a", boxShadow: "3px 3px 0 #1a1a1a",
              } : {
                background: "#f3f4f6", color: "#1a1a1a",
                border: "3px solid #1a1a1a",
              }}
            >
              {p}
            </button>
          ))}
        </div>

        <button onClick={handleStart} className="btn-cv-primary w-full justify-center">
          🎮 ¡Jugar!
        </button>
      </motion.div>
    </div>
  );
}

export default function MemoryGame() {
  const [numPlayers, setNumPlayers] = useState(null);
  const [playerNames, setPlayerNames] = useState([]);
  const [numPairs, setNumPairs] = useState(8);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [scores, setScores] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [won, setWon] = useState(false);

  const startGame = (n, names, pairs) => {
    setNumPlayers(n);
    setPlayerNames(names);
    setNumPairs(pairs);
    setCards(shuffle(CARD_ITEMS.slice(0, pairs)));
    setFlipped([]);
    setScores(Array(n).fill(0));
    setCurrentPlayer(0);
    setWon(false);
    setDisabled(false);
  };

  const handleFlip = (idx) => {
    if (disabled || cards[idx].flipped || cards[idx].matched) return;
    const newCards = [...cards];
    newCards[idx] = { ...newCards[idx], flipped: true };
    setCards(newCards);
    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setDisabled(true);
      const [a, b] = newFlipped;
      if (newCards[a].id === newCards[b].id) {
        newCards[a] = { ...newCards[a], matched: true };
        newCards[b] = { ...newCards[b], matched: true };
        setCards(newCards);
        setFlipped([]);
        setDisabled(false);
        const newScores = [...scores];
        newScores[currentPlayer] += 1;
        setScores(newScores);
        if (newCards.every((c) => c.matched)) setWon(true);
      } else {
        setTimeout(() => {
          newCards[a] = { ...newCards[a], flipped: false };
          newCards[b] = { ...newCards[b], flipped: false };
          setCards([...newCards]);
          setFlipped([]);
          setDisabled(false);
          if (numPlayers > 1) setCurrentPlayer((p) => (p + 1) % numPlayers);
        }, 900);
      }
    }
  };

  if (!numPlayers) return <SetupScreen onStart={startGame} />;

  const maxScore = Math.max(...scores);
  const winners = scores
    .map((s, i) => ({ s, i }))
    .filter((x) => x.s === maxScore);
  const isTie = winners.length > 1;

  return (
    <div>
      {/* Scoreboard */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {PLAYERS.slice(0, numPlayers).map((p, i) => (
          <div
            key={i}
            className="badge-cv transition-all"
            style={{
              background: i === currentPlayer ? p.color + "25" : "transparent",
              borderColor: i === currentPlayer ? p.color : "#e5e7eb",
              transform: i === currentPlayer ? "scale(1.1)" : "scale(1)",
            }}
          >
            {p.emoji} {playerNames[i] || p.name}: <strong>{scores[i]}</strong>
            {i === currentPlayer && numPlayers > 1 && (
              <span className="ml-1">🎯</span>
            )}
          </div>
        ))}
        <button
          onClick={() => setNumPlayers(null)}
          className="btn-cv-secondary text-sm ml-auto"
        >
          👥 Cambiar
        </button>
      </div>

      <AnimatePresence>
        {won && (
          <motion.div
            className="text-center py-6 mb-6 rounded-2xl"
            style={{ background: "#facc1520", border: "3px solid #facc15" }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
          >
            <div className="text-5xl mb-2">🏆</div>
            <h3 className="text-2xl font-fredoka-one text-cv-dark">
              {numPlayers === 1
                ? "¡Lo lograste!"
                : isTie
                ? "¡Empate!"
                : `¡Ganó ${playerNames[winners[0].i] || PLAYERS[winners[0].i].name} ${PLAYERS[winners[0].i].emoji}!`}
            </h3>
            <div className="flex flex-wrap gap-2 justify-center mt-3 mb-3">
              {PLAYERS.slice(0, numPlayers).map((p, i) => (
                <span key={i} className="badge-cv" style={{ borderColor: p.color }}>
                  {p.emoji} {playerNames[i] || p.name}: {scores[i]}
                </span>
              ))}
            </div>
            <button onClick={() => startGame(numPlayers, playerNames, numPairs)} className="mt-3 btn-cv-primary">
              ¡Jugar de nuevo!
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cards grid */}
      <div className={`grid gap-2 md:gap-3 ${getGridClass(numPairs)}`}>
        {cards.map((card, idx) => (
          <motion.div
            key={card.key}
            className="aspect-square cursor-pointer"
            onClick={() => handleFlip(idx)}
            whileHover={{ scale: card.flipped || card.matched ? 1 : 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              className="w-full h-full rounded-xl md:rounded-2xl flex items-center justify-center text-2xl md:text-4xl"
              style={{
                border: "3px solid #1a1a1a",
                background: card.matched
                  ? "#22c55e20"
                  : card.flipped
                  ? "white"
                  : "#ec489920",
                boxShadow: card.matched ? "3px 3px 0 #22c55e" : "3px 3px 0 #1a1a1a",
              }}
              animate={{ rotateY: card.flipped || card.matched ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              {card.flipped || card.matched ? (
                <span>{card.emoji}</span>
              ) : (
                <span className="text-cv-fuchsia font-fredoka-one text-lg md:text-xl">?</span>
              )}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}