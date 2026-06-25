import { motion } from "framer-motion";
import { ALBUM } from "@/lib/clubData";
import SectionHeader from "@/components/cv/SectionHeader";

// Array de canciones con acordes — agregar pdfUrl cuando estén disponibles
const EXTRA_SONGS = [
  { id: 101, title: "Un Buen Plan", artist: "Cualquier Verdura", pdfUrl: null },
  { id: 102, title: "La Gran Manada", artist: "Cualquier Verdura", pdfUrl: null },
];

const SONGS_WITH_CHORDS = [
  ...ALBUM.tracks.map(t => ({
    id: t.id,
    title: t.title,
    artist: t.attribution || "Cualquier Verdura",
    pdfUrl: t.chordsPdfUrl || null,
  })),
  ...EXTRA_SONGS,
];

function SongChordCard({ song, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
    >
      <motion.div
        className="card-cv p-5 flex items-center justify-between gap-4"
        whileHover={{ x: 4 }}
      >
        <div className="flex items-center gap-4">
          <span className="font-bangers text-2xl text-gray-200 w-8 flex-shrink-0 tracking-wider">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <p className="font-bangers text-cv-dark text-xl tracking-wider leading-tight">{song.title}</p>
            <p className="font-fredoka text-gray-400 text-sm">{song.artist}</p>
          </div>
        </div>

        {song.pdfUrl ? (
          <a
            href={song.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cv-secondary text-sm flex-shrink-0"
          >
            🎸 Descargar
          </a>
        ) : (
          <span
            className="font-fredoka text-gray-300 text-sm flex-shrink-0 px-4 py-2 rounded-full"
            style={{ border: "2px dashed #e5e7eb" }}
          >
            Próximamente
          </span>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function Acordes() {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-20 px-4 bg-cv-purple/5 relative overflow-hidden">
        {/* Floating music emojis */}
        <div className="absolute inset-0 pointer-events-none">
          {["🎸", "🎵", "🎶", "🥁", "🎹"].map((emoji, i) => (
            <motion.div
              key={i}
              className="absolute text-3xl opacity-15"
              style={{ left: `${8 + i * 20}%`, top: `${15 + (i % 2) * 55}%` }}
              animate={{ y: [-10, 10, -10], rotate: [-10, 10, -10] }}
              transition={{ duration: 2.5 + i * 0.3, repeat: Infinity }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto relative z-10">
          <SectionHeader
            title="Toca las Canciones"
            subtitle="Letras con acordes para imprimir y tocar"
            color="#a855f7"
          />

          <div className="space-y-3 mt-8">
            {SONGS_WITH_CHORDS.map((song, i) => (
              <SongChordCard key={song.id} song={song} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}