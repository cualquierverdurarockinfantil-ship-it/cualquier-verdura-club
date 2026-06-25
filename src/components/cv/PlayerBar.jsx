import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, Shuffle, X, Volume2, VolumeX, ListMusic } from "lucide-react";
import { useMusicPlayer } from "@/context/MusicPlayerContext";

function formatTime(secs) {
  if (!secs || isNaN(secs)) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function PlayerSpacer() {
  const { currentTrack } = useMusicPlayer();
  return currentTrack ? <div className="h-16" /> : null;
}

export default function PlayerBar() {
  const { currentTrack, isPlaying, togglePlay, goNext, goPrev, currentTime, duration, seek, shuffle, toggleShuffle, stop, volume, muted, setVolume, toggleMute, playlist, currentIndex, playTrack } = useMusicPlayer();
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const volumeRef = useRef(null);

  // Cerrar popover de volumen al clickear fuera
  useEffect(() => {
    if (!showVolume) return;
    const handler = (e) => {
      if (volumeRef.current && !volumeRef.current.contains(e.target)) {
        setShowVolume(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showVolume]);

  return (
    <AnimatePresence>
      {currentTrack && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-40 bg-cv-dark text-white"
          style={{ borderTop: "3px solid #22c55e" }}
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {/* Panel de lista de reproducción */}
          <AnimatePresence>
            {showPlaylist && (
              <motion.div
                className="overflow-y-auto"
                style={{ maxHeight: "50vh" }}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="max-w-5xl mx-auto p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bangers text-lg tracking-wider">Lista de Reproducción</h4>
                    <button onClick={() => setShowPlaylist(false)} className="p-1.5 rounded-full hover:bg-white/10">
                      <X size={18} />
                    </button>
                  </div>
                  <div className="space-y-1">
                    {playlist.map((song, i) => (
                      <button
                        key={song.id}
                        onClick={() => {
                          playTrack(song, playlist);
                          setShowPlaylist(false);
                        }}
                        className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-left ${i === currentIndex ? "bg-cv-green/20" : "hover:bg-white/10"}`}
                      >
                        <span className="text-xs font-fredoka text-white/40 w-5 text-center flex-shrink-0">{i + 1}</span>
                        <img src={song.cover} alt="" className="w-10 h-10 rounded object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className={`font-bangers text-sm tracking-wider truncate ${i === currentIndex ? "text-cv-green" : ""}`}>{song.title}</p>
                          <p className="font-fredoka text-xs text-white/50 truncate">{song.artist}</p>
                        </div>
                        {i === currentIndex && isPlaying && <span className="text-cv-green text-sm flex-shrink-0">♪</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Barra de progreso */}
          <div
            className="h-1.5 w-full bg-white/20 cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = (e.clientX - rect.left) / rect.width;
              seek(pct * (duration || 0));
            }}
          >
            <div
              className="h-full bg-cv-green"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>

          {/* Todo en un renglón */}
          <div className="max-w-5xl mx-auto px-2 sm:px-4 py-2 sm:py-2.5 flex items-center gap-1.5 sm:gap-3">
            {/* Info: portada + nombre */}
            <button
              onClick={() => setShowPlaylist(s => !s)}
              className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 text-left"
            >
              <img
                src={currentTrack.cover}
                alt=""
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg object-cover flex-shrink-0"
                style={{ border: "2px solid #1a1a1a" }}
              />
              <div className="min-w-0 flex-1">
                <p className="font-bangers text-xs sm:text-sm tracking-wider truncate">{currentTrack.title}</p>
                <p className="font-fredoka text-xs text-white/50 truncate">{currentTrack.artist}</p>
              </div>
              <ListMusic size={16} className="text-white/40 flex-shrink-0" />
            </button>

            {/* Controles */}
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <button onClick={toggleShuffle} className={`p-1.5 rounded-full transition-colors ${shuffle ? "text-cv-green" : "text-white/50"}`}>
                <Shuffle size={16} />
              </button>
              <button onClick={goPrev} className="p-1.5 rounded-full hover:bg-white/10">
                <SkipBack size={18} className="text-white fill-white" />
              </button>
              <button onClick={togglePlay} className="w-9 h-9 rounded-full bg-cv-green flex items-center justify-center flex-shrink-0 mx-0.5">
                {isPlaying ? <Pause size={18} className="text-white" /> : <Play size={18} className="text-white ml-0.5 fill-white" />}
              </button>
              <button onClick={goNext} className="p-1.5 rounded-full hover:bg-white/10">
                <SkipForward size={18} className="text-white fill-white" />
              </button>
              <button onClick={stop} className="p-1.5 rounded-full hover:bg-white/10 text-white/50">
                <X size={16} />
              </button>
            </div>

            {/* Volumen con popover */}
            <div ref={volumeRef} className="relative flex-shrink-0">
              <button
                onClick={() => setShowVolume(s => !s)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/50"
              >
                {muted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <AnimatePresence>
                {showVolume && (
                  <motion.div
                    className="absolute bottom-full right-0 mb-2 p-3 rounded-xl bg-cv-dark flex items-center gap-2"
                    style={{ border: "2px solid #22c55e" }}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <button onClick={toggleMute} className="text-white/50 hover:text-white flex-shrink-0">
                      {muted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={muted ? 0 : Math.round(volume * 100)}
                      onChange={(e) => setVolume(Number(e.target.value) / 100)}
                      className="w-24 h-1.5 cursor-pointer"
                      style={{ accentColor: "#22c55e" }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Tiempo (desktop) */}
            <div className="hidden md:flex items-center gap-1.5 text-xs font-fredoka text-white/40 flex-shrink-0">
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}