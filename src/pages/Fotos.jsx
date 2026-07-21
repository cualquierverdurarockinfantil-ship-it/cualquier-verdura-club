import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ChevronDown } from "lucide-react";
import SectionHeader from "@/components/cv/SectionHeader";

// Extrae el ID de cualquier formato de URL de YouTube
function getYouTubeId(url) {
  const patterns = [
    /youtube\.com\/shorts\/([^?&]+)/,
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/watch\?v=([^&]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

// ─── DATOS ────────────────────────────────────────────────────────────────────

const GRAN_MANADA = [
  { id: "gm1", src: "https://youtube.com/shorts/w-kqbL7axxg?feature=share", type: "youtube", label: "Producción y presentación La Gran Manada" },
  { id: "gm2", src: "https://youtube.com/shorts/i3orXcE05cA?feature=share", type: "youtube", label: "Producción y presentación La Gran Manada" },
  { id: "gm3", src: "https://youtube.com/shorts/0eSMgkNyoBg?feature=share", type: "youtube", label: "Producción y presentación La Gran Manada" },
  { id: "gm4", src: "https://youtube.com/shorts/kZa8T2f-nzw?feature=share", type: "youtube", label: "Producción y presentación La Gran Manada" },
  { id: "gm5", src: "/assets/fotos/5.jpg",                                   type: "image",   label: "Producción y presentación La Gran Manada" },
];

const GALERIA_GENERAL = [
  // ── Fotos ──
  { id: "g1",  src: "/assets/fotos/Carnaval en Pasman 2025.jpg",          type: "image",   label: "Carnaval en Pasman 2025" },
  { id: "g2",  src: "/assets/fotos/Cumple!! (1).jpg",                     type: "image",   label: "Cumpleaños" },
  { id: "g3",  src: "/assets/fotos/Cumple!! (2).jpg",                     type: "image",   label: "Cumpleaños" },
  { id: "g4",  src: "/assets/fotos/Cumple!! (3).jpg",                     type: "image",   label: "Cumpleaños" },
  { id: "g5",  src: "/assets/fotos/Cumple!! (4).jpg",                     type: "image",   label: "Cumpleaños" },
  { id: "g6",  src: "/assets/fotos/Cumple!! (6).jpg",                     type: "image",   label: "Cumpleaños" },
  { id: "g7",  src: "/assets/fotos/Cumple!! (9).jpg",                     type: "image",   label: "Cumpleaños" },
  { id: "g8",  src: "/assets/fotos/Cumple!! (10).jpg",                    type: "image",   label: "Cumpleaños" },
  { id: "g9",  src: "/assets/fotos/Cumple!! (16).jpg",                    type: "image",   label: "Cumpleaños" },
  { id: "g10", src: "/assets/fotos/Cumple!! (21).jpg",                    type: "image",   label: "Cumpleaños" },
  { id: "g11", src: "/assets/fotos/Cumple!! (22).jpg",                    type: "image",   label: "Cumpleaños" },
  { id: "g12", src: "/assets/fotos/Día del niño Sanjo 2024.jpg",          type: "image",   label: "Día del Niño Sanjo 2024" },
  { id: "g13", src: "/assets/fotos/Día del niño Sanjo 2024 2.jpg",        type: "image",   label: "Día del Niño Sanjo 2024" },
  { id: "g14", src: "/assets/fotos/Dia del niño en el Nacio 2023.jpg",    type: "image",   label: "Día del Niño en el Nacio 2023" },
  { id: "g15", src: "/assets/fotos/Dia del niño en el Nacio 2023 2.jpg",  type: "image",   label: "Día del Niño en el Nacio 2023" },
  { id: "g16", src: "/assets/fotos/Fecha con La Fanton Orchesta.jpg",     type: "image",   label: "Fecha con La Fantón Orquesta" },
  { id: "g17", src: "/assets/fotos/Fecha con La Fanton Orchesta 2.jpg",   type: "image",   label: "Fecha con La Fantón Orquesta" },
  { id: "g18", src: "/assets/fotos/Pehuajo dia del niño 2025.jpg",        type: "image",   label: "Pehuajó Día del Niño 2025" },
  { id: "g19", src: "/assets/fotos/Pehuajo dia del niño 2025  2.jpg",     type: "image",   label: "Pehuajó Día del Niño 2025" },
  { id: "g20", src: "/assets/fotos/Pehuajo dia del niño 2025 3.jpg",      type: "image",   label: "Pehuajó Día del Niño 2025" },
  { id: "g21", src: "/assets/fotos/Pehuajo dia del niño 2025 4.jpg",      type: "image",   label: "Pehuajó Día del Niño 2025" },
  { id: "g22", src: "/assets/fotos/Pehuajo dia del niño 2025 5.jpg",      type: "image",   label: "Pehuajó Día del Niño 2025" },
  { id: "g23", src: "/assets/fotos/Prueba de sonido 2023.jpg",            type: "image",   label: "Prueba de sonido 2023" },
  { id: "g24", src: "/assets/fotos/Show en Carhue.jpg",                   type: "image",   label: "Show en Carhué" },
  { id: "g25", src: "/assets/fotos/Show en Carhue, de paseo.jpg",         type: "image",   label: "Show en Carhué, de paseo" },
  // ── Videos ──
  { id: "v1",  src: "https://youtube.com/shorts/5GySAYJmVjs?feature=share",  type: "youtube", label: "1er Tacuarock" },
  { id: "v2",  src: "https://youtube.com/shorts/bWLe5pw3JN0?feature=share",  type: "youtube", label: "Backstage 2024" },
  { id: "v3",  src: "https://youtube.com/shorts/sqOwdoI33dY?feature=share",  type: "youtube", label: "Backstage del spot para Expo Rural 2025" },
  { id: "v4",  src: "https://youtube.com/shorts/DLlHBEEqo9o?feature=share",  type: "youtube", label: "Carnaval en Pasman 2025 — antes de entrar" },
  { id: "v5",  src: "https://youtube.com/shorts/MmdnZKZ-gXE?feature=share",  type: "youtube", label: "Carnaval en Pasman 2025 — entrando" },
  { id: "v6",  src: "https://youtube.com/shorts/N3fDxUdIC4Q?feature=share",  type: "youtube", label: "Carnaval en Pasman 2025 — repartiendo stickers" },
  { id: "v7",  src: "https://youtube.com/shorts/oexhN9ZIUFY?feature=share",  type: "youtube", label: "Carnaval en Pasman 2025 — resumen" },
  { id: "v8",  src: "https://youtube.com/shorts/CLUfry11HDQ?feature=share",  type: "youtube", label: "Despedida vacaciones 2024" },
  { id: "v9",  src: "https://youtube.com/shorts/DZCVDOuJgss?feature=share",  type: "youtube", label: "Día del Niño en el Nacio 2023 — Muchachos" },
  { id: "v10", src: "https://youtube.com/shorts/D1oyP9vwd20?feature=share",  type: "youtube", label: "Expo Rural 2025 — backstage 2" },
  { id: "v11", src: "https://youtube.com/shorts/hSc3reJgO9o?feature=share",  type: "youtube", label: "Expo Rural 2025 — backstage" },
  { id: "v12", src: "https://youtube.com/shorts/XbGtJ8I9xM0?feature=share",  type: "youtube", label: "Gira Día del Niño 2024" },
  { id: "v13", src: "https://youtube.com/shorts/-xsZRUMzPmk?feature=share",  type: "youtube", label: "Muchachos — Día del Niño 2023" },
  { id: "v14", src: "https://youtube.com/shorts/N4hyg30nHGQ?feature=share",  type: "youtube", label: "Pehuajó Día del Niño 2025 — prueba de sonido 2" },
  { id: "v15", src: "https://youtube.com/shorts/tt_EkYD-fd0?feature=share",  type: "youtube", label: "Pehuajó Día del Niño 2025 — prueba de sonido" },
  { id: "v16", src: "https://youtube.com/shorts/gIcKgnvRQRU?feature=share",  type: "youtube", label: "Presentación ByN 2024" },
  { id: "v17", src: "https://youtube.com/shorts/GRhcGxgGhjk?feature=share",  type: "youtube", label: "Resumen 4ta Tacuarock" },
  { id: "v18", src: "https://youtube.com/shorts/80Utp657kN8?feature=share",  type: "youtube", label: "Show en Carhué — prueba de sonido 2" },
  { id: "v19", src: "https://youtube.com/shorts/xdktRGLjp3o?feature=share",  type: "youtube", label: "Show en Carhué — prueba de sonido" },
  { id: "v20", src: "https://youtube.com/shorts/pHoD5p8gY10?feature=share",  type: "youtube", label: "Show en Las Encadenadas — resumen" },
  { id: "v21", src: "https://youtu.be/cOcV31pgRLM",                          type: "youtube", label: "Expo Rural 2025 — resumen" },
  { id: "v22", src: "https://youtu.be/kvlpoP08Jxg",                          type: "youtube", label: "Festival Casa Gigante — uno de nuestros primeros shows" },
  { id: "v23", src: "https://youtu.be/hpxCbDKiBMw",                          type: "youtube", label: "Pehuajó Día del Niño 2025 — Intro + Cucaracha" },
  { id: "v24", src: "https://youtu.be/YFfk5yFXlhI",                          type: "youtube", label: "Pehuajó Día del Niño 2025" },
  { id: "v25", src: "https://youtu.be/il-rsjh0wFs",                          type: "youtube", label: "Presentación Día del Niño 2024" },
  { id: "v26", src: "https://youtube.com/shorts/ZJD-M0OFs7M?feature=share",  type: "youtube", label: "Suárez peatonal 2023" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const CARD_W = "min(340px, 85vw)";
const CARD_H = "min(240px, 60vw)";

const slotStyle = (offset) => {
  const abs = Math.abs(offset);
  if (abs === 0) return { scale: 1,    opacity: 1,   zIndex: 10, x: "0%",     blur: 0 };
  if (abs === 1) return { scale: 0.78, opacity: 0.6, zIndex: 5,  x: offset < 0 ? "-68%" : "68%",   blur: 1 };
  if (abs === 2) return { scale: 0.58, opacity: 0.3, zIndex: 1,  x: offset < 0 ? "-118%" : "118%", blur: 2 };
  return              { scale: 0,    opacity: 0,   zIndex: 0,  x: offset < 0 ? "-150%" : "150%", blur: 3 };
};

// ─── THUMBNAIL ────────────────────────────────────────────────────────────────

function Thumb({ item }) {
  if (item.type === "youtube") {
    const ytId = getYouTubeId(item.src);
    return (
      <div className="relative w-full h-full bg-gray-900">
        <img
          src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`}
          alt={item.label}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="w-14 h-14 rounded-full bg-cv-red/90 flex items-center justify-center shadow-xl" style={{ border: "3px solid white" }}>
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white ml-1"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
      </div>
    );
  }
  return <img src={item.src} alt={item.label} className="w-full h-full object-cover" />;
}

// ─── LIGHTBOX ─────────────────────────────────────────────────────────────────

function Lightbox({ items, index, onClose, onPrev, onNext }) {
  const item = items[index];
  const ytId = item.type === "youtube" ? getYouTubeId(item.src) : null;

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
        {ytId ? (
          <div className="relative w-full rounded-2xl overflow-hidden" style={{ paddingTop: "56.25%", border: "4px solid white" }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
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

// ─── COVERFLOW ────────────────────────────────────────────────────────────────

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
        <h2 className="font-bangers text-2xl md:text-3xl text-cv-dark tracking-wide text-center mb-6">{sectionTitle}</h2>
      )}
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
                <div className="overflow-hidden rounded-2xl" style={{ width: CARD_W, height: CARD_H, boxShadow: offset === 0 ? "0 20px 60px rgba(0,0,0,0.35)" : "0 8px 24px rgba(0,0,0,0.15)", border: "3px solid #1a1a1a" }}>
                  <Thumb item={items[index]} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="text-center mt-4 mb-1">
        <p className="font-bangers text-cv-dark text-base tracking-wide">{items[current].label}</p>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button onClick={prev} className="bg-white hover:bg-cv-red hover:text-white shadow-md rounded-full p-2.5 transition-all" style={{ border: "2px solid #1a1a1a" }}>
          <ChevronLeft size={20} />
        </button>
        <span className="font-fredoka text-gray-500 text-base min-w-[60px] text-center">
          {current + 1} / {total}
        </span>
        <button onClick={next} className="bg-white hover:bg-cv-red hover:text-white shadow-md rounded-full p-2.5 transition-all" style={{ border: "2px solid #1a1a1a" }}>
          <ChevronRight size={20} />
        </button>
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox items={items} index={lightbox} onClose={() => setLightbox(null)} onPrev={() => setLightbox(i => (i - 1 + total) % total)} onNext={() => setLightbox(i => (i + 1) % total)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── SECCIÓN COLAPSABLE ───────────────────────────────────────────────────────

function ColapsableSection({ title, items }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-6">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bangers text-xl tracking-wide transition-all"
        style={{ background: open ? "#facc15" : "#fef9c310", border: "3px solid #facc15", boxShadow: open ? "4px 4px 0 #1a1a1a" : "none", color: "#1a1a1a" }}
      >
        <span>🎬 {title}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown size={22} />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35 }} className="overflow-hidden">
            <div className="pt-6 pb-2">
              <Coverflow items={items} sectionTitle={null} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── PÁGINA ───────────────────────────────────────────────────────────────────

export default function Fotos() {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <SectionHeader emoji="📸" title="Galería" subtitle="Fotos y videos del mundo de Cualquier Verdura" color="#facc15" />

          <ColapsableSection title="Producción y presentación La Gran Manada" items={GRAN_MANADA} />

          <div className="mt-8">
            <Coverflow items={GALERIA_GENERAL} sectionTitle={null} />
          </div>
        </div>
      </section>
    </div>
  );
}