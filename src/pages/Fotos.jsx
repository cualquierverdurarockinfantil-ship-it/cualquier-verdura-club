import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play } from "lucide-react";
import { PHOTOS } from "@/lib/clubData";
import SectionHeader from "@/components/cv/SectionHeader";

const CATEGORIES = ["todas", "tacuarock", "backstage", "vivos", "popurri"];

function PhotoCard({ photo, index, onClick }) {
  const isVideo = photo.type === "video";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      onClick={() => onClick(photo)}
      className="cursor-pointer"
    >
      <motion.div
        className="relative overflow-hidden rounded-2xl"
        style={{ border: "3px solid #1a1a1a" }}
        whileHover={{ scale: 1.03, rotate: 1 }}
        whileTap={{ scale: 0.97 }}
      >
        {isVideo ? (
          <>
            <video
              src={photo.src}
              className="w-full h-48 object-cover"
              muted
              preload="metadata"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div
                className="w-12 h-12 rounded-full bg-cv-red flex items-center justify-center"
                style={{ border: "2px solid white" }}
              >
                <Play size={20} className="text-white ml-0.5 fill-white" />
              </div>
            </div>
          </>
        ) : (
          <img
            src={photo.src}
            alt={photo.alt}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-all duration-300" />
      </motion.div>
    </motion.div>
  );
}

function PhotoModal({ photo, onClose }) {
  const isVideo = photo.type === "video";

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative max-w-2xl w-full"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        onClick={e => e.stopPropagation()}
      >
        {isVideo ? (
          <video
            src={photo.src}
            controls
            autoPlay
            className="w-full rounded-2xl"
            style={{ border: "4px solid white" }}
          />
        ) : (
          <img
            src={photo.src}
            alt={photo.alt}
            className="w-full rounded-2xl"
            style={{ border: "4px solid white" }}
          />
        )}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-cv-red text-white font-fredoka-one flex items-center justify-center text-lg"
          style={{ border: "3px solid white" }}
        >
          ✕
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function Fotos() {
  const [filter, setFilter] = useState("todas");
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const filtered = filter === "todas"
    ? PHOTOS
    : PHOTOS.filter(p => p.category === filter);

  return (
    <div className="min-h-screen bg-white">
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            emoji="📸"
            title="Galería"
            subtitle="Fotos y videos del mundo de Cualquier Verdura"
            color="#facc15"
          />

          {/* Filtro de categorías */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full font-fredoka-one text-sm capitalize transition-all ${
                  filter === cat ? "text-white" : "text-cv-dark bg-white hover:bg-cv-yellow"
                }`}
                style={{
                  border: "2px solid #1a1a1a",
                  background: filter === cat ? "#1a1a1a" : undefined,
                  boxShadow: filter === cat ? "3px 3px 0 #facc15" : undefined
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {filtered.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              <AnimatePresence>
                {filtered.map((photo, i) => (
                  <PhotoCard key={photo.id} photo={photo} index={i} onClick={setSelectedPhoto} />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📸</div>
              <p className="font-fredoka text-gray-500 text-xl">No hay contenido en esta categoría todavía</p>
            </div>
          )}

        </div>
      </section>

      <AnimatePresence>
        {selectedPhoto && <PhotoModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />}
      </AnimatePresence>
    </div>
  );
}