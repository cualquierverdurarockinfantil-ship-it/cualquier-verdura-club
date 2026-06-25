import { motion } from "framer-motion";
import { DRAWINGS } from "@/lib/clubData";
import SectionHeader from "@/components/cv/SectionHeader";

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

export default function Dibujos() {
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

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
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
