import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ALBUM } from "@/lib/clubData";
import GameRulesButton from "./GameRulesButton";

const SONGS = ALBUM.tracks.map((t) => ({
  id: t.id,
  title: t.title,
  audioUrl: t.audioOriginal || "",
}));

const FRAGMENT_RATIOS = [0.03, 0.22, 0.45, 0.68]; // Intro, Estrofa, Estribillo, Puente (aprox. sobre la duración total)

const PLAYER_COLORS = ["#ef4444", "#a855f7", "#facc15", "#f97316", "#22c55e", "#06b6d4"];
const PLAYER_EMOJIS = ["🍅", "🍆", "🌽", "🥕", "🥦", "🥒"];
const FRAGMENT_NAMES = ["Intro", "Estrofa", "Estribillo", "Puente"];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function pick8Songs(correctSong) {
  const others = SONGS.filter((s) => s.id !== correctSong.id);
  const shuffled = shuffle(others).slice(0, 7);
  return shuffle([correctSong, ...shuffled]);
}

function SetupScreen({ onStart }) {
  const [count, setCount] = useState(1);
  const [names, setNames] = useState({});
  const [rounds, setRounds] = useState(10);

  const handleStart = () => {
    const players = Array.from({ length: count }, (_, i) => ({
      id: i,
      name: names[i]?.trim() || `Jugador ${i + 1}`,
      score: 0,
    }));
    onStart(players, rounds);
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
                background: "#ec4899", color: "#fff",
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
              <span className="text-2xl">{PLAYER_EMOJIS[i % PLAYER_EMOJIS.length]}</span>
              <input
                type="text"
                placeholder={`Jugador ${i + 1} (opcional)`}
                value={names[i] || ""}
                onChange={(e) => setNames({ ...names, [i]: e.target.value })}
                className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-200 font-fredoka focus:outline-none focus:border-cv-fuchsia transition-colors"
              />
            </div>
          ))}
        </div>

        <h3 className="font-bangers text-cv-dark text-xl tracking-wider text-center mb-3">
          ¿Cuántas canciones (rondas)?
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

        <div className="flex justify-center mb-4">
          <GameRulesButton
            title="Adiviná la Canción"
            accentColor="#ec4899"
            rules={[
              "En cada ronda suena un fragmento corto de una canción de Cualquier Verdura.",
              "El que crea saberla grita \"¡Yo la sé!\" y elige quién de los jugadores va a responder.",
              "Ese jugador elige la canción correcta entre varias opciones en pantalla.",
              "Si acierta, suma 1 punto; si se equivoca, resta 1 punto.",
              "Si nadie se anima, pueden \"Pasar\" la ronda sin arriesgar puntos. Gana quien más puntos tenga al final.",
            ]}
          />
        </div>

        <button onClick={handleStart} className="btn-cv-primary w-full justify-center">
          🎮 ¡Empezar!
        </button>
      </motion.div>
    </div>
  );
}

function Scoreboard({ players }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-3">
      {players.map((p, i) => (
        <div
          key={p.id}
          className="px-3 py-1.5 rounded-full font-fredoka text-sm font-bold flex items-center gap-1.5"
          style={{
            background: PLAYER_COLORS[i % PLAYER_COLORS.length] + "20",
            color: "#1a1a1a",
            border: "2px solid " + PLAYER_COLORS[i % PLAYER_COLORS.length],
          }}
        >
          {PLAYER_EMOJIS[i % PLAYER_EMOJIS.length]} {p.name}: {p.score}
        </div>
      ))}
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

export default function GuessSongGame() {
  const [screen, setScreen] = useState("setup");
  const [players, setPlayers] = useState([]);
  const [totalRounds, setTotalRounds] = useState(10);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentSongIdx, setCurrentSongIdx] = useState(null);
  const [phase, setPhase] = useState("listening");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [songOptions, setSongOptions] = useState([]);
  const [result, setResult] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [usedSongIds, setUsedSongIds] = useState([]);
  const [songFragments, setSongFragments] = useState({});
  const [currentFragment, setCurrentFragment] = useState(0);

  const currentSong = currentSongIdx !== null ? SONGS[currentSongIdx] : null;
  const isLastRound = currentRound >= totalRounds;
  const audioRef = useRef(null);

  function handleStart(playerList, rounds) {
    setPlayers(playerList);
    setTotalRounds(rounds);
    setCurrentRound(1);
    const firstIdx = Math.floor(Math.random() * SONGS.length);
    setCurrentSongIdx(firstIdx);
    setUsedSongIds([SONGS[firstIdx].id]);
    setSongFragments({ [SONGS[firstIdx].id]: 1 });
    setCurrentFragment(0);
    setScreen("playing");
    setPhase("listening");
  }

  function handlePlay() {
    const song = currentSong;
    if (!song || !song.audioUrl) {
      setPlaying(true);
      setTimeout(() => setPlaying(false), 3000);
      return;
    }
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;
    audio.pause();
    audio.src = song.audioUrl;
    const ratio = FRAGMENT_RATIOS[currentFragment % FRAGMENT_RATIOS.length];
    const startPlayback = () => {
      const offset = (audio.duration || 180) * ratio;
      audio.currentTime = offset;
      audio.play().catch(() => {});
      setPlaying(true);
      setTimeout(() => {
        audio.pause();
        setPlaying(false);
      }, 3500);
    };
    if (audio.readyState >= 1) {
      startPlayback();
    } else {
      audio.addEventListener("loadedmetadata", startPlayback, { once: true });
    }
  }

  function handleYoLaSe() {
    setPhase("selectPlayer");
  }

  function handleSelectPlayer(playerId) {
    setSelectedPlayer(playerId);
    setSongOptions(pick8Songs(currentSong));
    setPhase("selectSong");
  }

  function handleSelectSong(songId) {
    const isCorrect = songId === currentSong.id;
    const newPlayers = [...players];
    const playerIdx = players.findIndex((p) => p.id === selectedPlayer);
    newPlayers[playerIdx] = {
      ...newPlayers[playerIdx],
      score: newPlayers[playerIdx].score + (isCorrect ? 1 : -1),
    };
    setPlayers(newPlayers);
    setResult({ correct: isCorrect, song: currentSong.title, playerName: players[playerIdx].name });
    setPhase("result");
  }

  function advanceRound() {
    if (isLastRound) {
      setScreen("finished");
      return;
    }

    const unusedIndices = SONGS.map((_, i) => i).filter(i => !usedSongIds.includes(SONGS[i].id));
    let nextIdx;
    let newUsedSongIds;

    if (unusedIndices.length > 0) {
      nextIdx = unusedIndices[Math.floor(Math.random() * unusedIndices.length)];
      newUsedSongIds = [...usedSongIds, SONGS[nextIdx].id];
    } else {
      const otherIndices = SONGS.map((_, i) => i).filter(i => i !== currentSongIdx);
      nextIdx = otherIndices[Math.floor(Math.random() * otherIndices.length)];
      newUsedSongIds = [SONGS[nextIdx].id];
    }

    const songId = SONGS[nextIdx].id;
    const fragIdx = (songFragments[songId] || 0) % FRAGMENT_NAMES.length;

    setCurrentSongIdx(nextIdx);
    setUsedSongIds(newUsedSongIds);
    setSongFragments({ ...songFragments, [songId]: (songFragments[songId] || 0) + 1 });
    setCurrentFragment(fragIdx);
    setCurrentRound((r) => r + 1);
    setPhase("listening");
    setSelectedPlayer(null);
    setResult(null);
    setSongOptions([]);
  }

  function handlePlayAgain() {
    setScreen("setup");
    setPlayers([]);
    setCurrentRound(1);
    setCurrentSongIdx(null);
    setPhase("listening");
    setSelectedPlayer(null);
    setResult(null);
    setSongOptions([]);
    setUsedSongIds([]);
    setSongFragments({});
    setCurrentFragment(0);
  }

  if (screen === "setup") return <SetupScreen onStart={handleStart} />;
  if (screen === "finished") return <FinishedScreen players={players} onPlayAgain={handlePlayAgain} />;

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-3">
        <span className="badge-cv" style={{ background: "#06b6d420", borderColor: "#06b6d4", color: "#06b6d4" }}>
          🎵 Canción {currentRound} de {totalRounds}
        </span>
      </div>
      <Scoreboard players={players} />

      <AnimatePresence mode="wait">
        {phase === "listening" && currentSong && (
          <motion.div key="listening" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="card-cv p-8 text-center">
              <motion.div
                className="text-6xl mb-4"
                animate={playing ? { scale: [1, 1.2, 1] } : {}}
                transition={playing ? { duration: 0.5, repeat: Infinity } : {}}
              >
                {playing ? "🎶" : "🎵"}
              </motion.div>

              <p className="font-fredoka text-gray-400 text-sm mb-3">
                🎵 Fragmento: {FRAGMENT_NAMES[currentFragment]}
              </p>

              <button
                onClick={handlePlay}
                disabled={playing}
                className="btn-cv-primary w-full justify-center mb-4"
              >
                {playing ? "🔊 Reproduciendo..." : "▶ Escuchar fragmento"}
              </button>

              <p className="font-fredoka text-gray-500 mb-4">¿Alguien sabe cuál es?</p>

              <div className="flex gap-3">
                <button onClick={handleYoLaSe} className="btn-cv-primary flex-1 justify-center text-sm">
                  🙋 ¡Yo la sé!
                </button>
                <button onClick={advanceRound} className="btn-cv-secondary flex-1 justify-center text-sm">
                  ⏭ Pasar
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {phase === "selectPlayer" && (
          <motion.div key="selectPlayer" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="card-cv p-6 text-center">
              <h3 className="font-bangers text-cv-dark text-2xl tracking-wider mb-1">¿Quién la sabe?</h3>
              <p className="font-fredoka text-gray-500 text-sm mb-4">Elegí el jugador que va a responder</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {players.map((p, i) => (
                  <motion.button
                    key={p.id}
                    onClick={() => handleSelectPlayer(p.id)}
                    className="card-cv p-4 flex items-center gap-3"
                    style={{ background: PLAYER_COLORS[i % PLAYER_COLORS.length] + "15" }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span className="text-2xl">{PLAYER_EMOJIS[i % PLAYER_EMOJIS.length]}</span>
                    <span className="font-fredoka font-bold text-cv-dark">{p.name}</span>
                  </motion.button>
                ))}
              </div>
              <button onClick={() => setPhase("listening")} className="btn-cv-secondary mt-4 text-sm">
                ← Volver
              </button>
            </div>
          </motion.div>
        )}

        {phase === "selectSong" && (
          <motion.div key="selectSong" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="card-cv p-6 text-center">
              <h3 className="font-bangers text-cv-dark text-2xl tracking-wider mb-1">¿Cuál es la canción?</h3>
              <p className="font-fredoka text-gray-500 text-sm mb-4">
                Responde: <strong>{players.find((p) => p.id === selectedPlayer)?.name}</strong>
              </p>
              <div className="grid grid-cols-1 gap-2">
                {songOptions.map((song) => (
                  <motion.button
                    key={song.id}
                    onClick={() => handleSelectSong(song.id)}
                    className="card-cv p-3 font-fredoka font-bold text-cv-dark text-left"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    🎵 {song.title}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {phase === "result" && result && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <div className="card-cv p-8 text-center">
              <div className="text-6xl mb-3">{result.correct ? "🎉" : "❌"}</div>
              <h3 className={`font-bangers text-3xl tracking-wider mb-2 ${result.correct ? "text-cv-green" : "text-cv-red"}`}>
                {result.correct ? "¡Correcto!" : "¡Incorrecto!"}
              </h3>
              <p className="font-fredoka text-gray-500 text-lg mb-1">La canción era:</p>
              <p className="font-fredoka text-gray-400 text-sm mb-1">Fragmento: {FRAGMENT_NAMES[currentFragment]}</p>
              <p className="font-bangers text-cv-dark text-2xl tracking-wider mb-4">🎵 {result.song}</p>
              <div className="inline-block badge-cv mb-6" style={{
                background: result.correct ? "#22c55e20" : "#ef444420",
                borderColor: result.correct ? "#22c55e" : "#ef4444",
                color: result.correct ? "#22c55e" : "#ef4444",
              }}>
                {result.correct ? "⭐ +1 punto" : "📉 -1 punto"} · {result.playerName}
              </div>
              <div>
                <button onClick={advanceRound} className="btn-cv-primary justify-center">
                  {isLastRound ? "🏆 Ver Resultados" : "🎲 Otra canción →"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center mt-6">
        <button onClick={handlePlayAgain} className="btn-cv-secondary text-sm">
          👥 Cambiar jugadores
        </button>
      </div>
    </div>
  );
}