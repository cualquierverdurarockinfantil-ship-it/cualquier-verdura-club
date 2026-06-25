import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ============================================
// BASE DE DATOS DE VERDURAS
// Para agregar una verdura nueva, simplemente
// agregá un objeto al final de este array.
// Cada verdura necesita: nombre + 5 pistas
// (de la más general a la más específica).
// ============================================
const MYSTERY_VEGGIES = [
  { name: "Tomate", clues: ["Soy de color rojo.", "Tengo forma redonda.", "Me usan mucho en ensaladas.", "Tengo semillas por dentro.", "Técnicamente soy una fruta, pero me comen como verdura."] },
  { name: "Berenjena", clues: ["Soy de color violeta.", "Tengo forma ovalada.", "Mi interior es esponjoso.", "Me usan para hacer parmigiana.", "Tengo un gorrito verde de hojas."] },
  { name: "Choclo", clues: ["Soy de color amarillo.", "Tengo granos alineados.", "Crezco en una mazorca.", "Tengo una hoja que me cubre.", "Conmigo se hace humita y polenta."] },
  { name: "Zanahoria", clues: ["Soy de color naranja.", "Crezco debajo de la tierra.", "Me comen mucho los conejos.", "Tengo un penacho de hojas verdes.", "Soy crocante y dulce."] },
  { name: "Papa", clues: ["Por fuera soy marrón.", "Crezco debajo de la tierra.", "Conmigo se hacen las papas fritas.", "Tengo unos puntitos llamados 'ojos'.", "Por dentro soy blanca o amarilla."] },
  { name: "Zapallo", clues: ["Soy de color naranja por dentro.", "Puedo ser muy grande y redondo.", "En Halloween me tallan una cara.", "Tengo muchas semillas en el centro.", "Conmigo se hace una sopa cremosa."] },
  { name: "Brócoli", clues: ["Soy totalmente verde.", "Parezco un arbolito.", "Tengo ramitas con florecitas.", "Soy súper saludable.", "Tengo un tronco o tallo que también se come."] },
  { name: "Lechuga", clues: ["Soy de color verde.", "Tengo muchas hojas.", "Soy la estrella de las ensaladas.", "Estoy hecha casi toda de agua.", "Soy crocante y fresca."] },
  { name: "Cebolla", clues: ["Hago llorar cuando me cortan.", "Tengo muchas capas.", "Por fuera soy dorada y por dentro blanca.", "Soy redonda.", "Me usan para dar sabor a casi todas las comidas."] },
  { name: "Ajo", clues: ["Soy muy chiquito.", "Tengo un olor muy fuerte.", "Vengo en dientes o cachitos.", "Por fuera soy blanco.", "Se dice que ahuyento a los vampiros."] },
  { name: "Pepino", clues: ["Soy de color verde.", "Soy largo y alargado.", "Tengo mucha agua.", "Me cortan en rodajas para ensaladas.", "Tengo la piel con puntitos."] },
  { name: "Morrón", clues: ["Puedo ser rojo, verde o amarillo.", "Tengo forma de campana.", "Por dentro soy hueco.", "Tengo semillas blancas.", "Soy crocante y dulce."] },
  { name: "Palta", clues: ["Soy verde por fuera.", "Tengo forma de pera.", "Por dentro soy cremosa y verde.", "Tengo una semilla grande en el centro.", "Conmigo se hace el guacamole."] },
  { name: "Maní", clues: ["Tengo una cáscara marrón.", "Crezco debajo de la tierra.", "Soy muy chiquito.", "Se puede hacer una pasta cremosa conmigo.", "Me comen tostado en el estadio o en el cine."] },
  { name: "Batata", clues: ["Por dentro soy naranja.", "Soy dulce.", "Crezco debajo de la tierra.", "Soy prima de la papa.", "Me llaman 'camote' en algunos países."] },
  { name: "Arveja", clues: ["Soy de color verde.", "Soy chiquita y redonda.", "Vengo dentro de una vaina.", "Me usan en sopas y guisos.", "Me encuentro en latas o congelada."] },
  { name: "Poroto", clues: ["Puedo ser blanco, negro o marrón.", "Soy chiquito y redondo.", "Cuando estoy seco necesito remojo.", "Me usan en guisos y locro.", "Vengo dentro de una vaina cuando soy fresco."] },
  { name: "Acelga", clues: ["Tengo hojas grandes y verdes.", "Mis tallos pueden ser blancos o rojos.", "Me usan en sopas y tartas.", "Soy prima de la espinaca.", "Soy muy saludable y rica en hierro."] },
  { name: "Repollo", clues: ["Puedo ser verde o morado.", "Soy redondo y grande.", "Tengo muchas hojas apretadas en capas.", "Me cortan finito para ensaladas.", "Fermentado me convierto en chucrut."] },
  { name: "Apio", clues: ["Soy de color verde.", "Tengo tallos largos y fibrosos.", "Soy muy crocante.", "Tengo poquitas calorías.", "Me usan en sopas, caldos y ensaladas."] },
];

const POINTS = [5, 4, 3, 2, 1];
const PLAYER_COLORS = ["#22c55e", "#ec4899", "#06b6d4", "#f97316", "#a855f7", "#facc15"];

function normalize(str) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function generateQueue(rounds, playerCount) {
  const total = rounds * playerCount;
  const queue = [];
  while (queue.length < total) {
    queue.push(...shuffle(MYSTERY_VEGGIES));
  }
  return queue.slice(0, total);
}

function Scoreboard({ players, currentPlayerIndex }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-3">
      {players.map((p, i) => (
        <div
          key={p.id}
          className="px-3 py-1.5 rounded-full font-fredoka text-sm font-bold flex items-center gap-1.5"
          style={{
            background: i === currentPlayerIndex ? PLAYER_COLORS[i % PLAYER_COLORS.length] : "#f3f4f6",
            color: i === currentPlayerIndex ? "#fff" : "#1a1a1a",
            border: "2px solid #1a1a1a",
          }}
        >
          {p.name} · {p.score} pts
        </div>
      ))}
    </div>
  );
}

function SetupScreen({ onStart }) {
  const [count, setCount] = useState(1);
  const [names, setNames] = useState({});
  const [rounds, setRounds] = useState(10);

  const handleStart = () => {
    const playerList = Array.from({ length: count }, (_, i) => ({
      id: i,
      name: names[i]?.trim() || `Jugador ${i + 1}`,
      score: 0,
    }));
    onStart(playerList, rounds);
  };

  return (
    <div className="max-w-md mx-auto">
      <motion.div className="card-cv p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h3 className="font-bangers text-cv-dark text-2xl tracking-wider text-center mb-1">
          ¿Cuántos jugadores?
        </h3>
        <p className="font-fredoka text-gray-500 text-center text-sm mb-4">
          Elegí de 1 a 6 jugadores
        </p>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
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
            <input
              key={i}
              type="text"
              placeholder={`Nombre del Jugador ${i + 1} (opcional)`}
              value={names[i] || ""}
              onChange={(e) => setNames({ ...names, [i]: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 font-fredoka focus:outline-none focus:border-cv-green transition-colors"
            />
          ))}
        </div>

        <h3 className="font-bangers text-cv-dark text-xl tracking-wider text-center mb-3">
          ¿Cuántas rondas?
        </h3>
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[5, 10, 15, 20].map((r) => (
            <button
              key={r}
              onClick={() => setRounds(r)}
              className="font-bangers text-lg py-2.5 rounded-2xl transition-all"
              style={rounds === r ? {
                background: "#06b6d4", color: "#fff",
                border: "3px solid #1a1a1a", boxShadow: "3px 3px 0 #1a1a1a",
              } : {
                background: "#f3f4f6", color: "#1a1a1a",
                border: "3px solid #1a1a1a",
              }}
            >
              {r}
            </button>
          ))}
        </div>

        <button onClick={handleStart} className="btn-cv-primary w-full justify-center">
          🎮 ¡Comenzar!
        </button>
      </motion.div>
    </div>
  );
}

function TurnScreen({ player, veggie, clueIndex, showGuess, guess, onGuessChange, onMoreClue, onArriesgar, onSubmitGuess, onCancelGuess }) {
  return (
    <div className="max-w-lg mx-auto">
      <motion.div className="text-center mb-4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
        <span className="badge-cv" style={{ background: "#ec489920", borderColor: "#ec4899", color: "#ec4899" }}>
          🎮 Turno de {player.name}
        </span>
      </motion.div>

      <div className="text-center mb-6">
        <motion.div className="text-5xl mb-2" animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 2, repeat: Infinity }}>
          🥦
        </motion.div>
        <h3 className="font-bangers text-cv-dark text-2xl tracking-wider">Verdura Misteriosa</h3>
      </div>

      <div className="space-y-3 mb-6">
        {Array.from({ length: clueIndex + 1 }, (_, i) => (
          <motion.div
            key={i}
            className="card-cv p-4 flex items-start gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <span
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bangers text-sm text-white"
              style={{ background: "#22c55e", border: "2px solid #1a1a1a" }}
            >
              {i + 1}
            </span>
            <p className="font-fredoka text-cv-dark text-base pt-1">{veggie.clues[i]}</p>
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {showGuess ? (
          <motion.div key="guess" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
            <input
              type="text"
              placeholder="Escribí tu respuesta..."
              value={guess}
              onChange={(e) => onGuessChange(e.target.value)}
              autoFocus
              className="w-full px-4 py-3 rounded-xl border-2 border-cv-green font-fredoka text-lg focus:outline-none"
            />
            <div className="flex gap-3">
              <button onClick={onCancelGuess} className="btn-cv-secondary flex-1 justify-center text-sm">
                ← Volver
              </button>
              <button onClick={onSubmitGuess} className="btn-cv-primary flex-1 justify-center text-sm">
                🎯 Confirmar
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="actions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex gap-3">
            <button
              onClick={onMoreClue}
              disabled={clueIndex >= 4}
              className="btn-cv-secondary flex-1 justify-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ➕ Otra pista
            </button>
            <button onClick={onArriesgar} className="btn-cv-primary flex-1 justify-center text-sm">
              🎯 Arriesgar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RevealScreen({ result, isLastTurn, onNext }) {
  return (
    <div className="max-w-md mx-auto text-center">
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200 }}>
        <div className="text-6xl mb-3">{result.correct ? "🎉" : "❌"}</div>
        <h3 className={`font-bangers text-3xl tracking-wider mb-2 ${result.correct ? "text-cv-green" : "text-cv-red"}`}>
          {result.correct ? "¡Correcto!" : "¡Incorrecto!"}
        </h3>
        <p className="font-fredoka text-gray-500 text-lg mb-1">La verdura era:</p>
        <p className="font-bangers text-cv-dark text-2xl tracking-wider mb-4">{result.answer}</p>

        {result.correct ? (
          <motion.div
            className="inline-block badge-cv mb-6"
            style={{ background: "#22c55e20", borderColor: "#22c55e", color: "#22c55e" }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            ⭐ +{result.points} puntos ({result.cluesUsed} pista{result.cluesUsed > 1 ? "s" : ""})
          </motion.div>
        ) : (
          <div className="inline-block badge-cv mb-6" style={{ background: "#ef444420", borderColor: "#ef4444", color: "#ef4444" }}>
            😢 0 puntos
          </div>
        )}
      </motion.div>

      <button onClick={onNext} className="btn-cv-primary justify-center">
        {isLastTurn ? "🏆 Ver Resultados" : "Siguiente →"}
      </button>
    </div>
  );
}

function FinishedScreen({ players, onPlayAgain }) {
  const maxScore = Math.max(...players.map((p) => p.score));
  const winners = players.filter((p) => p.score === maxScore);
  const sorted = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="max-w-md mx-auto text-center">
      <motion.div className="text-6xl mb-2" animate={{ rotate: [-5, 5, -5], scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
        🏆
      </motion.div>
      <h3 className="font-bangers text-cv-dark text-3xl tracking-wider mb-1">
        {winners.length > 1 ? "¡Empate!" : "¡Ganador!"}
      </h3>
      {winners.length === 1 && (
        <p className="font-bangers text-2xl tracking-wider mb-6" style={{ color: PLAYER_COLORS[winners[0].id % PLAYER_COLORS.length] }}>
          {winners[0].name}
        </p>
      )}
      {winners.length > 1 && (
        <p className="font-fredoka text-lg text-gray-500 mb-6">
          {winners.map((w) => w.name).join(" y ")}
        </p>
      )}

      <div className="space-y-2 mb-6">
        {sorted.map((p, i) => (
          <motion.div
            key={p.id}
            className="card-cv p-3 flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <span className="font-bangers text-xl w-8" style={{ color: PLAYER_COLORS[p.id % PLAYER_COLORS.length] }}>
              {i + 1}°
            </span>
            <span className="font-fredoka font-bold text-cv-dark flex-1 text-left">{p.name}</span>
            <span className="font-bangers text-lg text-cv-dark">{p.score} pts</span>
          </motion.div>
        ))}
      </div>

      <button onClick={onPlayAgain} className="btn-cv-primary justify-center">
        🔄 Jugar de nuevo
      </button>
    </div>
  );
}

export default function MysteryVeggie() {
  const [screen, setScreen] = useState("setup");
  const [players, setPlayers] = useState([]);
  const [totalRounds, setTotalRounds] = useState(10);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [veggieQueue, setVeggieQueue] = useState([]);
  const [clueIndex, setClueIndex] = useState(0);
  const [showGuess, setShowGuess] = useState(false);
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState(null);

  const turnIndex = (currentRound - 1) * players.length + currentPlayerIndex;
  const currentVeggie = veggieQueue[turnIndex];
  const totalTurns = totalRounds * players.length;
  const isLastTurn = turnIndex + 1 >= totalTurns;

  function handleStart(playerList, rounds) {
    setPlayers(playerList);
    setTotalRounds(rounds);
    setCurrentRound(1);
    setCurrentPlayerIndex(0);
    setVeggieQueue(generateQueue(rounds, playerList.length));
    setClueIndex(0);
    setShowGuess(false);
    setGuess("");
    setResult(null);
    setScreen("turn");
  }

  function handleMoreClue() {
    if (clueIndex < 4) setClueIndex(clueIndex + 1);
  }

  function handleSubmitGuess() {
    const ng = normalize(guess);
    const na = normalize(currentVeggie.name);
    const isCorrect = ng === na || (ng.length > 2 && na.includes(ng)) || (ng.length > 2 && ng.includes(na));

    const points = isCorrect ? POINTS[clueIndex] : 0;
    const newResult = { correct: isCorrect, answer: currentVeggie.name, points, cluesUsed: clueIndex + 1 };

    const newPlayers = [...players];
    newPlayers[currentPlayerIndex] = {
      ...newPlayers[currentPlayerIndex],
      score: newPlayers[currentPlayerIndex].score + points,
    };
    setPlayers(newPlayers);
    setResult(newResult);
    setScreen("reveal");
  }

  function handleNext() {
    if (currentPlayerIndex + 1 >= players.length) {
      // End of round
      if (currentRound >= totalRounds) {
        setScreen("finished");
      } else {
        setCurrentRound(currentRound + 1);
        setCurrentPlayerIndex(0);
        setClueIndex(0);
        setShowGuess(false);
        setGuess("");
        setResult(null);
        setScreen("turn");
      }
    } else {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
      setClueIndex(0);
      setShowGuess(false);
      setGuess("");
      setResult(null);
      setScreen("turn");
    }
  }

  function handlePlayAgain() {
    setScreen("setup");
    setPlayers([]);
    setVeggieQueue([]);
    setCurrentRound(1);
    setCurrentPlayerIndex(0);
    setClueIndex(0);
    setShowGuess(false);
    setGuess("");
    setResult(null);
  }

  if (screen === "setup") return <SetupScreen onStart={handleStart} />;
  if (screen === "finished") return <FinishedScreen players={players} onPlayAgain={handlePlayAgain} />;

  return (
    <div>
      <div className="text-center mb-3">
        <span className="badge-cv" style={{ background: "#06b6d420", borderColor: "#06b6d4", color: "#06b6d4" }}>
          🔄 Ronda {currentRound} de {totalRounds}
        </span>
      </div>
      <Scoreboard players={players} currentPlayerIndex={currentPlayerIndex} />
      <AnimatePresence mode="wait">
        {screen === "turn" && currentVeggie && (
          <motion.div key="turn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <TurnScreen
              player={players[currentPlayerIndex]}
              veggie={currentVeggie}
              clueIndex={clueIndex}
              showGuess={showGuess}
              guess={guess}
              onGuessChange={setGuess}
              onMoreClue={handleMoreClue}
              onArriesgar={() => setShowGuess(true)}
              onSubmitGuess={handleSubmitGuess}
              onCancelGuess={() => setShowGuess(false)}
            />
          </motion.div>
        )}
        {screen === "reveal" && result && (
          <motion.div key="reveal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <RevealScreen
              result={result}
              isLastTurn={isLastTurn}
              onNext={handleNext}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}