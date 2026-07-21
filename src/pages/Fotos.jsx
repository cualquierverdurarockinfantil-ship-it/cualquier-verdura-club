import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Play } from "lucide-react";
import SectionHeader from "@/components/cv/SectionHeader";

const GRAN_MANADA = [
  { id: "gm1", src: "/assets/fotos/gran-manada/gran-manada-1.mp4", type: "video", label: "Producción y presentación La Gran Manada" },
  { id: "gm2", src: "/assets/fotos/gran-manada/gran-manada-2.mp4", type: "video", label: "Producción y presentación La Gran Manada" },
  { id: "gm3", src: "/assets/fotos/gran-manada/gran-manada-3.mp4", type: "video", label: "Producción y presentación La Gran Manada" },
  { id: "gm4", src: "/assets/fotos/gran-manada/gran-manada-4.mp4", type: "video", label: "Producción y presentación La Gran Manada" },
  { id: "gm5", src: "/assets/fotos/gran-manada/gran-manada-5.jpg", type: "image", label: "Producción y presentación La Gran Manada" },
];

const GALERIA_GENERAL = [];

const slotStyle = (offset) => {
  const abs = Math.abs(offset);
  if (abs === 0) return { scale: 1,    opacity: 1,   zIndex: 10, x: "0%",    blur: 0 };
  if (abs === 1) return { scale: 0.78, opacity: 0.6, zIndex: 5,  x: offset < 0 ? "-68%" : "68%", blur: 1 };
  if (abs === 2) return { scale: 0.58, opacity: 0.3, zIndex: 1,  x: offset < 0 ? "-118%" : "118%", blur: 2 };
  return              { scale: 0,    opacity: 0,   zIndex: 0,  x: offset < 0 ? "-150%" : "150%", blur: 3 };
};

function Thumb({ item }) {
  if (item.type === "video") {
    return (
      <div className="relative w-full h-full">
        <video src={item.src} className="w-full h-full object-cover" muted preload="metadata" playsInline />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="w-14 h-14 rounded-full bg-cv-red/90 flex items-center justify-center shadow-xl" style={{ border: "3px solid white" }}>
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
      <motion.div key={item.id} className="w-full max-w-2xl" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
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
    <div className="mb-16">
      {sectionTitle && <h2 className="font-bangers text-2xl md:text-3xl text-cv-dark tracking-wide text-center mb-6">{sectionTitle}</h2>}
      <div className="relative flex items-center justify-center" style={{ height: 280 }}>
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
              <div className="overflow-hidden rounded-2xl" style={{ width: 340, height: 240, boxShadow: offset === 0 ? "0 20px 60px rgba(0,0,0,0.35)" : "0 8px 24px rgba(0,0,0,0.15)", border: "3px solid #1a1a1a" }}>
                <Thumb item={items[index]} />
              </div>
            </motion.div>
          );
        })}
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
          <Lightbox items={items} index={lightbox} onClose={() => setLightbox(null)} onPrev={() => setLightbox(i => (i - 1 + total) % total)} onNext={() => setLightbox(i => (i + 1) % total)} />
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
          <div className="mb-16 p-6 rounded-3xl" style={{ background: "#fef9c310", border: "3px solid #facc15" }}>
            <Coverflow items={GRAN_MANADA} sectionTitle="Producción y presentación La Gran Manada" />
          </div>
          {GALERIA_GENERAL.length > 0 ? (
            <Coverflow items={GALERIA_GENERAL} sectionTitle={null} />
          ) : (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-4">📸</div>
              <p className="font-fredoka text-lg">Próximamente más fotos y videos</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}