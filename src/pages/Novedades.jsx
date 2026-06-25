import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { NEWS } from "@/lib/clubData";
import SectionHeader from "@/components/cv/SectionHeader";

const TYPE_COLORS = {
  video: "#ef4444",
  foto: "#facc15",
  show: "#ec4899",
  musica: "#22c55e",
  novedad: "#06b6d4",
};

function NewsCard({ item, index }) {
  const color = TYPE_COLORS[item.type] || "#a855f7";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
    >
      <motion.div
        className="card-cv overflow-hidden"
        whileHover={{ scale: 1.02 }}
      >
        {item.image && (
          <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
        )}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <span
              className="badge-cv text-xs text-white"
              style={{ background: color }}
            >
              {item.type}
            </span>
            <span className="text-sm font-fredoka text-gray-400">{item.date}</span>
          </div>
          <h3 className="text-xl font-fredoka-one text-cv-dark mb-2">{item.title}</h3>
          <p className="font-fredoka text-gray-600 leading-relaxed">{item.content}</p>
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex btn-cv-primary text-sm"
            >
              Ver más →
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Novedades() {
  if (NEWS.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <motion.div
            className="text-8xl mb-6"
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            📢
          </motion.div>
          <h2 className="text-4xl font-fredoka-one text-cv-dark mb-3">¡Pronto habrá novedades!</h2>
          <p className="font-fredoka text-gray-500 text-xl mb-6">
            Seguinos en redes para enterarte primero de todo 🥦
          </p>
          <Link to="/" className="btn-cv-primary">← Volver al Club</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            emoji="📢"
            title="Bitácora Verdura"
            subtitle="Todo lo que pasa en el Club"
            color="#ec4899"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {NEWS.map((item, i) => (
              <NewsCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}