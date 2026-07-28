import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Play, Pause } from "lucide-react";
import { ALL_SONGS } from "@/lib/songsData";
import { useMusicPlayer } from "@/context/MusicPlayerContext";
import SectionHeader from "@/components/cv/SectionHeader";
import FloatingCharacters from "@/components/cv/FloatingCharacters";

export default function Canciones() {
  const { playTrack, requestPlay, currentTrack, isPlaying } = useMusicPlayer();

  const playableSongs = ALL_SONGS.filter(s => s.audioOriginal || s.audioInstrumental);
  const hasAudio = (song) => song.audioOriginal || song.audioInstrumental;
  const isCurrent = (song) => currentTrack?.id === song.id;

  const handlePlayAll = () => {
    if (playableSongs.length > 0) playTrack(playableSongs[0], playableSongs);
  };

  const handlePlaySong = (song) => {
    if (hasAudio(song)) requestPlay(song);
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="relative py-20 px-4 overflow-hidden bg-cv-green/5">
        <FloatingCharacters />
        <div className="max-w-4xl mx-auto relative z-10">
          <SectionHeader
            title="Escuchá Todo"
            subtitle="Toda la música de Cualquier Verdura en un lugar"
            color="#22c55e"
          />

          <div className="flex gap-3 justify-center mb-8">
            <button
              onClick={handlePlayAll}
              className="btn-cv-primary"
              disabled={playableSongs.length === 0}
            >
              <Play size={18} className="fill-white" /> Reproducir Todo
            </button>
          </div>

          <div className="space-y-3">
            {ALL_SONGS.map((song, i) => {
              const playable = hasAudio(song);
              const current = isCurrent(song);
              const isAlbumTrack = song.source === "album";

              const displayTitle = isAlbumTrack
                ? `${song.albumTrack}. ${song.title}`
                : song.title;

              // Singles y tracks del disco: siempre mostrar compositor
              const subLabel = isAlbumTrack
                ? song.composer
                : `Single · ${song.composer || "Cualquier Verdura"}`;

              return (
                <motion.div
                  key={song.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(i * 0.04, 0.4) }}
                  className={`p-3 rounded-2xl flex items-center gap-3 transition-all ${current ? "bg-cv-green/10" : "bg-white"}`}
                  style={{ border: current ? "3px solid #22c55e" : "3px solid #e5e7eb" }}
                >
                  <button
                    onClick={() => handlePlaySong(song)}
                    disabled={!playable}
                    className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-30 transition-transform hover:scale-105"
                    style={{ background: playable ? "#22c55e" : "#e5e7eb", border: "2px solid #1a1a1a" }}
                  >
                    {current && isPlaying
                      ? <Pause size={18} className="text-white" />
                      : <Play size={18} className="text-white ml-0.5 fill-white" />
                    }
                  </button>

                  <img
                    src={song.cover}
                    alt=""
                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                    style={{ border: "2px solid #1a1a1a" }}
                  />

                  <div className="flex-1 min-w-0">
                    <p className="font-bangers text-cv-dark text-base sm:text-lg tracking-wider truncate">
                      {displayTitle}
                    </p>
                    <p className="font-fredoka text-xs text-gray-500 truncate">
                      {subLabel}
                    </p>
                  </div>

                  {song.hasKaraoke && (
                    <Link
                      to="/karaoke"
                      className="hidden sm:flex items-center gap-1 text-xs font-fredoka text-cv-fuchsia px-3 py-1.5 rounded-full flex-shrink-0"
                      style={{ border: "2px solid #ec4899", background: "#ec489910" }}
                    >
                      🎤 Karaoke
                    </Link>
                  )}

                  {song.duration && (
                    <span className="text-xs font-fredoka text-gray-400 hidden md:block flex-shrink-0">
                      {song.duration}
                    </span>
                  )}

                  {!playable && (
                    <span className="text-xs font-fredoka text-gray-400 flex-shrink-0 hidden lg:block">
                      Próximamente
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
