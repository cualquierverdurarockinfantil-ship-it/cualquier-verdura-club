import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KARAOKE_SONGS, ALBUM_KARAOKE_SECTIONS } from "@/lib/karaokeData";
import { ALBUM } from "@/lib/clubData";
import SectionHeader from "@/components/cv/SectionHeader";
import KaraokePlayer from "@/components/karaoke/KaraokePlayer";

const DIFFICULTY_STYLES = {
  fácil: { bg: "#22c55e20", border: "#22c55e", color: "#22c55e", label: "😊 Fácil" },
  medio: { bg: "#f9731620", border: "#f97316", color: "#f97316", label: "🔥 Medio" },
  difícil: { bg: "#ec489920", border: "#ec4899", color: "#ec4899", label: "⚡ Difícil" },
};

// Combina los 2 singles (con su karaoke ya armado) con las 9 canciones del disco
// (audio + acordes viven en clubData.js; la parte de karaoke — secciones — vive en
// ALBUM_KARAOKE_SECTIONS, cruzada acá por "slug").
const albumKaraokeSongs = ALBUM.tracks
  .map((track) => {
    const sectionsData = ALBUM_KARAOKE_SECTIONS.find((s) => s.id === track.slug);
    if (!sectionsData || !track.audioInstrumental) return null;
    return {
      ...sectionsData,
      title: track.title,
      audioOriginal: track.audioOriginal,
      audioInstrumental: track.audioInstrumental,
      character: track.character,
    };
  })
  .filter(Boolean);

const ALL_KARAOKE_SONGS = [...KARAOKE_SONGS, ...albumKaraokeSongs];

function KaraokeSongCard({ song, index, onClick }) {
  const diff = DIFFICULTY_STYLES[song.difficulty] || DIFFICULTY_STYLES.fácil;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
    >
      <motion.div
        className="card-cv cursor-pointer p-4 flex flex-col sm:flex-row sm:items-center gap-3"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex-1 min-w-0">
          <h3 className="font-bangers text-cv-dark text-lg md:text-xl leading-tight tracking-wider truncate">
            {song.title}
          </h3>
          <p className="font-fredoka text-gray-500 text-sm truncate">{song.artist}</p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <span
            className="badge-cv text-xs"
            style={{ background: diff.bg, borderColor: diff.border, color: diff.color }}
          >
            {diff.label}
          </span>
          <button
            className="btn-cv-primary text-sm"
            style={{ minHeight: "40px", fontSize: "0.9rem", padding: "8px 20px" }}
          >
            🎤 ¡A cantar!
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Karaoke() {
  const [selectedSong, setSelectedSong] = useState(null);

  return (
    <div className="bg-cv-fuchsia/5">
      {/* Hero */}
      <section className="py-20 px-4 bg-cv-fuchsia/5 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <SectionHeader
            title="Karaoke"
            subtitle="¡Cantá con Cualquier Verdura!"
            color="#ec4899"
          />

          {/* Song grid */}
          {ALL_KARAOKE_SONGS.length > 0 ? (
            <div className="flex flex-col gap-4 mt-8 max-w-3xl mx-auto">
              {ALL_KARAOKE_SONGS.map((song, i) => (
                <KaraokeSongCard
                  key={song.id}
                  song={song}
                  index={i}
                  onClick={() => setSelectedSong(song)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="font-fredoka text-gray-500 text-xl">¡El karaoke está calentando motores! Volvé pronto 🎤</p>
            </div>
          )}

        </div>
      </section>

      {/* Player modal */}
      <AnimatePresence>
        {selectedSong && (
          <KaraokePlayer
            key={selectedSong.id}
            song={selectedSong}
            onClose={() => setSelectedSong(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}