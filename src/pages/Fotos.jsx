import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Play, ChevronDown } from "lucide-react";
import SectionHeader from "@/components/cv/SectionHeader";

const GRAN_MANADA = [
  { id: "gm1", src: "https://o0zuhp51mgqdspkx.public.blob.vercel-storage.com/1.mp4", type: "video", label: "Producción y presentación La Gran Manada" },
  { id: "gm2", src: "https://o0zuhp51mgqdspkx.public.blob.vercel-storage.com/2.mp4", type: "video", label: "Producción y presentación La Gran Manada" },
  { id: "gm3", src: "https://o0zuhp51mgqdspkx.public.blob.vercel-storage.com/3.mp4", type: "video", label: "Producción y presentación La Gran Manada" },
  { id: "gm4", src: "https://o0zuhp51mgqdspkx.public.blob.vercel-storage.com/4.mp4", type: "video", label: "Producción y presentación La Gran Manada" },
  { id: "gm5", src: "/assets/fotos/5.jpg", type: "image", label: "Producción y presentación La Gran Manada" },
];

const GALERIA_GENERAL = [
  { id: "g1",  src: "/assets/fotos/Carnaval en Pasman 2025.jpg",         type: "image", label: "Carnaval en Pasman 2025" },
  { id: "g2",  src: "/assets/fotos/Cumple!! (1).jpg",                    type: "image", label: "Cumpleaños" },
  { id: "g3",  src: "/assets/fotos/Cumple!! (2).jpg",                    type: "image", label: "Cumpleaños" },
  { id: "g4",  src: "/assets/fotos/Cumple!! (3).jpg",                    type: "image", label: "Cumpleaños" },
  { id: "g5",  src: "/assets/fotos/Cumple!! (4).jpg",                    type: "image", label: "Cumpleaños" },
  { id: "g6",  src: "/assets/fotos/Cumple!! (6).jpg",                    type: "image", label: "Cumpleaños" },
  { id: "g7",  src: "/assets/fotos/Cumple!! (9).jpg",                    type: "image", label: "Cumpleaños" },
  { id: "g8",  src: "/assets/fotos/Cumple!! (10).jpg",                   type: "image", label: "Cumpleaños" },
  { id: "g9",  src: "/assets/fotos/Cumple!! (16).jpg",                   type: "image", label: "Cumpleaños" },
  { id: "g10", src: "/assets/fotos/Cumple!! (21).jpg",                   type: "image", label: "Cumpleaños" },
  { id: "g11", src: "/assets/fotos/Cumple!! (22).jpg",                   type: "image", label: "Cumpleaños" },
  { id: "g12", src: "/assets/fotos/Día del niño Sanjo 2024.jpg",         type: "image", label: "Día del Niño Sanjo 2024" },
  { id: "g13", src: "/assets/fotos/Día del niño Sanjo 2024 2.jpg",       type: "image", label: "Día del Niño Sanjo 2024" },
  { id: "g14", src: "/assets/fotos/Dia del niño en el Nacio 2023.jpg",   type: "image", label: "Día del Niño en el Nacio 2023" },
  { id: "g15", src: "/assets/fotos/Dia del niño en el Nacio 2023 2.jpg", type: "image", label: "Día del Niño en el Nacio 2023" },
  { id: "g16", src: "/assets/fotos/Fecha con La Fanton Orchesta.jpg",    type: "image", label: "Fecha con La Fantón Orquesta" },
  { id: "g17", src: "/assets/fotos/Fecha con La Fanton Orchesta 2.jpg",  type: "image", label: "Fecha con La Fantón Orquesta" },
  { id: "g18", src: "/assets/fotos/Pehuajo dia del niño 2025.jpg",       type: "image", label: "Pehuajó Día del Niño 2025" },
  { id: "g19", src: "/assets/fotos/Pehuajo dia del niño 2025  2.jpg",    type: "image", label: "Pehuajó Día del Niño 2025" },
  { id: "g20", src: "/assets/fotos/Pehuajo dia del niño 2025 3.jpg",     type: "image", label: "Pehuajó Día del Niño 2025" },
  { id: "g21", src: "/assets/fotos/Pehuajo dia del niño 2025 4.jpg",     type: "image", label: "Pehuajó Día del Niño 2025" },
  { id: "g22", src: "/assets/fotos/Pehuajo dia del niño 2025 5.jpg",     type: "image", label: "Pehuajó Día del Niño 2025" },
  { id: "g23", src: "/assets/fotos/Prueba de sonido 2023.jpg",           type: "image", label: "Prueba de sonido 2023" },
  { id: "g24", src: "/assets/fotos/Show en Carhue.jpg",                  type: "image", label: "Show en Carhué" },
  { id: "g25", src: "/assets/fotos/Show en Carhue, de paseo.jpg",        type: "image", label: "Show en Carhué, de paseo" },
];
const CARD_W = "min(340px, 85vw)";
const CARD_H = "min(240px, 60vw)";

const slotStyle = (offset) => {
  const abs = Math.abs(offset);
  if (abs === 0) return { scale: 1,    opacity: 1,   zIndex: 10, x: "0%",     blur: 0 };
  if (abs === 1) return { scale: 0.78, opacity: 0.6, zIndex: 5,  x: offset < 0 ? "-68%" : "68%",   blur: 1 };
  if (abs === 2) return { scale: 0.58, opacity: 0.3, zIndex: 1,  x: offset < 0 ? "-118%" : "118%", blur: 2 };
  return              { scale: 0,    opacity: 0,   zIndex: 0,  x: offset < 0 ? "-150%" : "150%", blur: 3 };
};

function Thumb({ item }) {
  if (item.type === "video") {
    // #t=0.1 fuerza al navegador a mostrar el frame en 0.1s como thumbnail
    const srcWithTime = item.src.includes("#") ? item.src : `${item.src}#t=0.1`;
    return (
      <div className="relative w-full h-full bg-gray-900">
        <video
          src={srcWithTime}
          className="w-full h-full object-cover"
          muted
          playsInline
          preload="metadata"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div
            className="w-14 h-14 rounded-full bg-cv-red/90 flex items-center justify-center shadow-xl"
            style={{ border: "3px solid white" }}
          >
            <Play size={26} className="text-white ml-1 fill-white" />
          </div>
        </div>
      </div>
    );
  }
  return <img src={item.src} alt={item.label} className="w-full h-full object-cover" />;
}

function Lightbox({ items, index, onClose, onPrev, onNext }) {
  const item = items[index];
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <button className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full z-10" onClick={onClose}><X size={28} /></button>
      <button className="absolute left-3 md:left-6 text-white p-2 hover:bg-white/10 rounded-full z-10" onClick={(e) => { e.stopPropagation(); onPrev(); }}><ChevronLeft size={32} /></button>
      <button className="absolute right-3 md:right-6 text-white p-2 hover:bg-white/10 rounded-full z-10" onClick={(e) => { e.stopPropagation(); onNext(); }}><ChevronRight size={32} /></button>
      <motion.div
        key={item.id}
        className="w-full max-w-2xl"
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {item.type === "video" ? (
          <video src={item.src} controls autoPlay playsInline className="w-full rounded-2xl max-h-[75vh]" style={{ border: "4px solid white" }} />
        ) : (
          <img src={item.src} alt={item.label} className="w-full rounded-2xl max-h-[75vh] object-contain" style={{ border: "4px solid white" }} />
        )}
      </motion.div>
      <div className="mt-4 text-center">
        <p className="text-white font-bangers text-lg tracking-wide">{item.label}</p>
        <p className="text-white/50 font-fredoka text-sm mt-0.5">{index + 1} / {items.length}</p>
      </div>
    </motion.div>
  );
}

function Coverflow({ items, sectionTitle }) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const total = items.length;
  const prev = useCallback(() => setCurrent(i => (i - 1 + total) % total), [total]);
  const next = useCallback(() => setCurrent(i => (i + 1) % total), [total]);
  const getVisible = () => [-2, -1, 0, 1, 2].map(offset => ({ offset, index: (current + offset + total) % total }));
  if (total === 0) return null;

  return (
    <div>
      {sectionTitle && (
        <h2 className="font-bangers text-2xl md:text-3xl text-cv-dark tracking-wide text-center mb-6">
          {sectionTitle}
        </h2>
      )}

      {/* overflow-hidden acá recorta las tarjetas laterales que salen del contenedor */}
      <div className="relative overflow-hidden" style={{ height: "min(280px, 70vw)" }}>
        <div className="relative flex items-center justify-center w-full h-full">
          {getVisible().map(({ offset, index }) => {
            const s = slotStyle(offset);
            return (
              <motion.div
                key={`${sectionTitle}-${index}`}
                className="absolute cursor-pointer"
                style={{ zIndex: s.zIndex }}
                animate={{ x: s.x, scale: s.scale, opacity: s.opacity, filter: `blur(${s.blur}px)` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={() => { if (offset === 0) setLightbox(index); else if (offset < 0) prev(); else next(); }}
              >
                <div
                  className="overflow-hidden rounded-2xl"
                  style={{
                    width: CARD_W,
                    height: CARD_H,
                    boxShadow: offset === 0 ? "0 20px 60px rgba(0,0,0,0.35)" : "0 8px 24px rgba(0,0,0,0.15)",
                    border: "3px solid #1a1a1a",
                  }}
                >
                  <Thumb item={items[index]} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="text-center mt-4 mb-3">
        <p className="font-bangers text-cv-dark text-base tracking-wide">{items[current].label}</p>
        <p className="font-fredoka text-gray-400 text-sm">{current + 1} / {total}</p>
      </div>

      <div className="flex items-center justify-center gap-5">
        <button onClick={prev} className="bg-white hover:bg-cv-red hover:text-white shadow-md rounded-full p-2.5 transition-all" style={{ border: "2px solid #1a1a1a" }}><ChevronLeft size={20} /></button>
        <div className="flex gap-2">
          {items.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={`rounded-full transition-all duration-200 ${i === current ? "w-6 h-2.5 bg-cv-red" : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-500"}`} />
          ))}
        </div>
        <button onClick={next} className="bg-white hover:bg-cv-red hover:text-white shadow-md rounded-full p-2.5 transition-all" style={{ border: "2px solid #1a1a1a" }}><ChevronRight size={20} /></button>
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox
            items={items}
            index={lightbox}
            onClose={() => setLightbox(null)}
            onPrev={() => setLightbox(i => (i - 1 + total) % total)}
            onNext={() => setLightbox(i => (i + 1) % total)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Sección colapsable con botón
function ColapsableSection({ title, items }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-6">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bangers text-xl tracking-wide transition-all"
        style={{
          background: open ? "#facc15" : "#fef9c310",
          border: "3px solid #facc15",
          boxShadow: open ? "4px 4px 0 #1a1a1a" : "none",
          color: "#1a1a1a",
        }}
      >
        <span>🎬 {title}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown size={22} />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-6 pb-2">
              <Coverflow items={items} sectionTitle={null} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Fotos() {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <SectionHeader emoji="📸" title="Galería" subtitle="Fotos y videos del mundo de Cualquier Verdura" color="#facc15" />

          {/* Sección especial colapsable */}
          <ColapsableSection title="Producción y presentación La Gran Manada" items={GRAN_MANADA} />

          {/* Galería general */}
          <div className="mt-8">
            {GALERIA_GENERAL.length > 0 ? (
              <Coverflow items={GALERIA_GENERAL} sectionTitle={null} />
            ) : (
              <div className="text-center py-16 text-gray-400">
                <div className="text-5xl mb-4">📸</div>
                <p className="font-fredoka text-lg">Próximamente más fotos y videos</p>
              </div>
            )}
          </div>

        </div>
      </section>
    </div>
  );
}