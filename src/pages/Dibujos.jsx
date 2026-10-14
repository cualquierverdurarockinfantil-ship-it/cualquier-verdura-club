import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DRAWINGS } from "@/lib/clubData";
import SectionHeader from "@/components/cv/SectionHeader";
import { useHalloween, HALLOWEEN_DRAWINGS, HALLOWEEN_PACK_URL } from "@/lib/halloween";

function DrawingCard({ drawing, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
    >
      <motion.div
        className="card-cv overflow-hidden h-full flex flex-col"
        whileHover={{ scale: 1.04, rotate: 1 }}
      >
        <div
          className="h-40 flex items-center justify-center bg-gray-50"
          style={{ borderBottom: "3px solid #1a1a1a" }}
        >
          <img
            src={drawing.thumbnail}
            alt={drawing.title}
            className="h-full w-full object-contain p-4"
          />
        </div>
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-fredoka-one text-cv-dark text-lg mb-3">{drawing.title}</h3>
          <a
            href={drawing.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cv-primary w-full justify-center text-sm"
          >
            🖨 Descargar PDF
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

function PackCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0 }}
      className="col-span-2 md:col-span-3 lg:col-span-4"
    >
      <motion.div
        className="overflow-hidden flex flex-col md:flex-row items-center gap-6 p-8 rounded-3xl bg-white"
        style={{ border: "3px solid #ec4899", boxShadow: "6px 6px 0 #ec4899" }}
        whileHover={{ scale: 1.01 }}
      >
        <div className="text-5xl">📦</div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="font-bangers text-cv-dark text-2xl tracking-wider mb-1">
            Pack Completo — 1 sola hoja
          </h3>
          <p className="font-fredoka text-gray-500 text-base">
            Todas las verduras juntas en una sola hoja, listas para imprimir y colorear
          </p>
        </div>
        <a
          href="/assets/dibujos/pack-completo.pdf"
          target="_blank"
          rel="noopener noreferrer"
          download="cualquier-verdura-pack-completo.pdf"
          className="btn-cv-primary flex-shrink-0"
          style={{ background: "#ec4899" }}
        >
          📥 Descargar Pack Completo
        </a>
      </motion.div>
    </motion.div>
  );
}

/* Subsección "Halloween Verdura": queda siempre dentro de la sección, detrás de un botón que la abre.
   Durante el tema (19/10 al 31/10) arranca abierta; el resto del año, cerrada. */
function HalloweenDrawings({ open, onToggle }) {
  return (
    <section className="px-4 pt-10">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={onToggle}
          aria-expanded={open}
          className="w-full flex items-center justify-between gap-3 px-6 py-4 rounded-3xl font-bangers text-2xl md:text-3xl tracking-wider text-left"
          style={{ background: "#1a0a2e", color: "#fff", border: "4px solid #1a1a1a", boxShadow: "6px 6px 0 #f97316" }}
        >
          <span>🎃 Halloween Verdura <span className="font-fredoka text-base text-violet-200 normal-case tracking-normal block md:inline md:ml-2">dibujos de las verduras monstruo para colorear</span></span>
          <span className="text-3xl transition-transform" style={{ transform: open ? "rotate(180deg)" : "none", color: "#f97316" }}>▾</span>
        </button>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{ overflow: "hidden" }}
          >
            <HalloweenDrawingsBody />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function HalloweenDrawingsBody() {
  return (
    <div className="py-8">
      <div className="max-w-5xl mx-auto rounded-3xl p-5 md:p-8" style={{ background: "#1a0a2e" }}>
        <p className="font-fredoka text-violet-200 text-center mb-6 max-w-xl mx-auto">
          Las verduras monstruo para imprimir y pintar. ¡Descargá una por una o llevate el pack en una sola hoja!
        </p>

        <motion.div
          className="overflow-hidden flex flex-col md:flex-row items-center gap-6 p-6 md:p-8 rounded-3xl bg-[#fff7ed] mb-8"
          style={{ border: "3px solid #f97316", boxShadow: "6px 6px 0 #f97316" }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-5xl">🦇</div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-bangers text-cv-dark text-2xl tracking-wider mb-1">Pack Halloween — 1 sola hoja</h3>
            <p className="font-fredoka text-gray-600 text-base">
              Las 8 verduras terror juntas en una hoja, listas para imprimir y colorear
            </p>
          </div>
          <a
            href={HALLOWEEN_PACK_URL}
            target="_blank"
            rel="noopener noreferrer"
            download="cualquier-verdura-halloween-pack.pdf"
            className="btn-cv-primary flex-shrink-0"
            style={{ background: "#f97316", color: "#1a1a1a" }}
          >
            📥 Descargar Pack Halloween
          </a>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {HALLOWEEN_DRAWINGS.map((drawing, i) => (
            <motion.div
              key={drawing.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <motion.div className="card-cv overflow-hidden h-full flex flex-col bg-[#fff7ed]" whileHover={{ scale: 1.04, rotate: -1 }}>
                <div className="h-40 flex items-center justify-center" style={{ borderBottom: "3px solid #1a1a1a", background: "#ffedd5" }}>
                  <img src={drawing.thumbnail} alt={drawing.title} className="h-full w-full object-contain p-4" />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bangers text-cv-dark text-xl tracking-wider mb-3">{drawing.title}</h3>
                  <a
                    href={drawing.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={`halloween-${drawing.id}.pdf`}
                    className="btn-cv-primary w-full justify-center text-sm mt-auto"
                    style={{ background: "#f97316", color: "#1a1a1a" }}
                  >
                    🖨 Descargar PDF
                  </a>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Dibujos() {
  const h = useHalloween();
  const [halloweenOpen, setHalloweenOpen] = useState(h);
  return (
    <div className="min-h-screen bg-white">
      <section className="py-20 px-4 bg-cv-yellow/10 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {["✏️", "🖍️", "🎨", "⭐", "🌟"].map((emoji, i) => (
            <motion.div
              key={i}
              className="absolute text-3xl opacity-20"
              style={{ left: `${10 + i * 20}%`, top: `${20 + (i % 2) * 50}%` }}
              animate={{ y: [-10, 10, -10], rotate: [-10, 10, -10] }}
              transition={{ duration: 2.5 + i * 0.3, repeat: Infinity }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <SectionHeader
            emoji="✏️"
            title="Dibujos para Colorear"
            subtitle="Imprimí y pintá a todas las verduras rockeras"
            color="#facc15"
          />

          <motion.div
            className="max-w-2xl mx-auto text-center mb-8 p-6 rounded-3xl bg-white"
            style={{ border: "3px solid #1a1a1a", boxShadow: "6px 6px 0 #facc15" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center gap-6 text-3xl mb-3">
              <span>1️⃣</span>
              <span className="text-gray-300">→</span>
              <span>2️⃣</span>
              <span className="text-gray-300">→</span>
              <span>3️⃣</span>
            </div>
            <div className="flex gap-4 text-sm font-fredoka text-gray-500 justify-center">
              <span className="flex-1">Elegís tu dibujo favorito</span>
              <span className="flex-1">Lo descargás e imprimís</span>
              <span className="flex-1">¡Lo pintás con colores!</span>
            </div>
          </motion.div>
        </div>
      </section>

      <HalloweenDrawings open={halloweenOpen} onToggle={() => setHalloweenOpen((o) => !o)} />

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          {halloweenOpen && (
            <h2 className="font-bangers text-cv-dark text-3xl text-center tracking-wider mb-8">Los dibujos de siempre</h2>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <PackCard />
            {DRAWINGS.map((drawing, i) => (
              <DrawingCard key={drawing.id} drawing={drawing} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
