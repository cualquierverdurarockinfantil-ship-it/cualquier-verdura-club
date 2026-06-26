import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { getActiveLineIndex } from "@/lib/karaokeData";
import { VEG_IMAGES } from "@/lib/clubData";
import LyricsScroller from "./LyricsScroller";
import KaraokeFinishScreen from "./KaraokeFinishScreen";

const MODE_OPTIONS = [
  { id: "banda", label: "Cantar con la banda", icon: "🎤", desc: "Con la voz original" },
  { id: "solo",  label: "Cantar solo",          icon: "⭐", desc: "Solo instrumental" },
];

// Modo Tomate: tomate animado que guía la línea activa.
const TOMATE_MODE = true;

function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function KaraokePlayer({ song, onClose }) {
  const [mode, setMode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const audioRef = useRef(null);
  const wakeLockRef = useRef(null);

  // Mantener pantalla encendida mientras el karaoke está abierto
  useEffect(() => {
    if ("wakeLock" in navigator) {
      navigator.wakeLock.request("screen").then(lock => {
        wakeLockRef.current = lock;
      }).catch(() => {});
    }
    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
      }
    };
  }, []);

  // Pausar cuando otro reproductor comienza (ej: reproductor persistente)
  useEffect(() => {
    const handler = (e) => {
      if (e.detail.source !== "karaoke" && audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };
    window.addEventListener("cv-audio-play", handler);
    return () => window.removeEventListener("cv-audio-play", handler);
  }, []);

  const audioUrl = mode === "solo" ? song.audioInstrumental : song.audioOriginal;
  const activeIndex = getActiveLineIndex(song.lines, currentTime);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setFinished(false);
    setShowFinalMessage(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [mode]);

  // Transición: mensaje del FINAL → pantalla de fin
  useEffect(() => {
    if (showFinalMessage) {
      const timer = setTimeout(() => {
        setShowFinalMessage(false);
        setFinished(true);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [showFinalMessage]);

  useEffect(() => {
    if (!audioRef.current || !mode) return;
    if (isPlaying) audioRef.current.play();
    else audioRef.current.pause();
  }, [isPlaying, mode]);

  function handleTimeUpdate() {
    if (!audioRef.current) return;
    const t = audioRef.current.currentTime;
    setCurrentTime(t);

    // Mostrar finishMessage cuando pasa la última línea de letra,
    // aunque el audio todavía siga unos segundos más
    const lastLine = song.lines[song.lines.length - 1];
    if (lastLine && t >= lastLine.end && !showFinalMessage && !finished) {
      setShowFinalMessage(true);
    }
  }
  function handleLoadedMetadata() {
    if (audioRef.current) setDuration(audioRef.current.duration);
  }
  function handleEnded() {
    setIsPlaying(false);
    setShowFinalMessage(true);
  }
  function handleSeek(e) {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) audioRef.current.currentTime = val;
  }
  function handleRestart() {
    setFinished(false);
    setShowFinalMessage(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
    setIsPlaying(true);
  }

  const vegImg = VEG_IMAGES[song.character];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[95vh] overflow-y-auto z-10"
        style={{ border: "4px solid #ec4899", boxShadow: "10px 10px 0 #1a1a1a" }}
        initial={{ scale: 0.85, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.85, y: 40 }}
        transition={{ type: "spring", damping: 22 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-cv-red text-white font-bangers flex items-center justify-center text-lg"
        >
          ✕
        </button>

        {finished ? (
          <KaraokeFinishScreen song={song} onRestart={handleRestart} />
        ) : (
          <>
            {/* Header: cover + info */}
            <div className="flex gap-3 sm:gap-4 p-4 sm:p-6 pb-3 sm:pb-4">
              <img
                src={song.cover}
                alt={song.title}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover flex-shrink-0"
                style={{ border: "3px solid #1a1a1a", boxShadow: "4px 4px 0 #1a1a1a" }}
              />
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl md:text-3xl font-bangers text-cv-dark tracking-wider leading-tight">{song.title}</h2>
                <p className="font-fredoka text-gray-500">{song.artist}</p>
                <span className="badge-cv text-xs mt-2 inline-block" style={{ background: "#22c55e20", borderColor: "#22c55e", color: "#22c55e" }}>
                  {song.difficulty === "fácil" ? "😊 Fácil" : song.difficulty === "medio" ? "🔥 Medio" : "⚡ Difícil"}
                </span>
              </div>
            </div>

            {/* Mode selector */}
            <div className="px-4 sm:px-6 pb-4">
              <p className="font-fredoka text-sm text-gray-500 mb-2">Elegí cómo cantar:</p>
              <div className="grid grid-cols-2 gap-3">
                {MODE_OPTIONS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className="rounded-2xl p-3 text-center transition-all"
                    style={{
                      border: mode === m.id ? "3px solid #ec4899" : "2px solid #e5e7eb",
                      background: mode === m.id ? "#ec489910" : "white",
                      boxShadow: mode === m.id ? "3px 3px 0 #ec4899" : "none",
                    }}
                  >
                    <div className="text-2xl mb-1">{m.icon}</div>
                    <div className="font-bangers text-sm sm:text-base text-cv-dark tracking-wide">{m.label}</div>
                    <div className="font-fredoka text-xs text-gray-400 leading-tight">{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {mode && (
              <audio
                key={audioUrl}
                ref={audioRef}
                src={audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
                onPlay={() => window.dispatchEvent(new CustomEvent("cv-audio-play", { detail: { source: "karaoke" } }))}
                preload="metadata"
              />
            )}

            {/* Lyrics + controls */}
            {mode && (
              <div className="px-4 sm:px-6 pb-6">
                <LyricsScroller song={song} lines={song.lines} activeIndex={activeIndex} tomateMode={TOMATE_MODE} currentTime={currentTime} showFinalMessage={showFinalMessage} />

                <div className="flex items-center gap-3 mt-4 mb-3">
                  <span className="font-fredoka text-xs text-gray-400 w-10 text-right">{formatTime(currentTime)}</span>
                  <input
                    type="range"
                    min={0}
                    max={duration || song.durationSecs}
                    step={0.1}
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-1 accent-pink-500 h-2"
                  />
                  <span className="font-fredoka text-xs text-gray-400 w-10">{formatTime(duration || song.durationSecs)}</span>
                </div>

                <div className="flex items-center justify-center gap-4">
                  {vegImg && (
                    <motion.img
                      src={vegImg}
                      alt={song.character}
                      className="w-12 h-12 object-contain flex-shrink-0"
                      animate={isPlaying ? { rotate: [-8, 8, -8], y: [0, -4, 0], scale: [1, 1.08, 1] } : { rotate: [-3, 3, -3] }}
                      transition={{ duration: isPlaying ? 0.7 : 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}
                  <motion.button
                    className="btn-cv-primary text-lg px-12"
                    onClick={() => setIsPlaying(!isPlaying)}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isPlaying ? "⏸ Pausar" : "▶ Reproducir"}
                  </motion.button>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </motion.div>
  );
}