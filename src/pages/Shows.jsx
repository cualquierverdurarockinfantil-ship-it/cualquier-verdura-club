import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { SHOWS } from "@/lib/clubData";
import SectionHeader from "@/components/cv/SectionHeader";

function ShowCard({ show, index }) {
  const date = new Date(show.date);
  const month = date.toLocaleDateString("es-AR", { month: "short" }).toUpperCase();
  const day = date.getDate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <motion.div
        className="card-cv p-6 flex flex-col md:flex-row gap-6 items-center"
        whileHover={{ scale: 1.02 }}
      >
        {/* Date badge */}
        <div
          className="flex-shrink-0 w-20 h-20 rounded-2xl flex flex-col items-center justify-center text-white"
          style={{ background: "#ec4899", border: "3px solid #1a1a1a" }}
        >
          <span className="text-xs font-fredoka-one">{month}</span>
          <span className="text-3xl font-fredoka-one leading-none">{day}</span>
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-2xl font-fredoka-one text-cv-dark">{show.venue}</h3>
          <p className="font-fredoka text-gray-500 text-lg">{show.city}, {show.country}</p>
        </div>

        {/* CTA */}
        <div className="flex-shrink-0">
          {show.isSoldOut ? (
            <span className="px-6 py-3 rounded-full font-fredoka-one text-gray-400 bg-gray-100" style={{ border: "2px solid #e5e7eb" }}>
              Agotado 😢
            </span>
          ) : (
            <a
              href={show.ticketsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cv-primary"
            >
              🎟 Entradas
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Shows() {
  if (SHOWS.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <motion.div
            className="text-8xl mb-6"
            animate={{ rotate: [-5, 5, -5], y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎪
          </motion.div>
          <h2 className="text-4xl font-fredoka-one text-cv-dark mb-3">¡Próximamente!</h2>
          <p className="font-fredoka text-gray-500 text-xl mb-6">
            Los shows están en camino. ¡Seguinos para enterarte primero! 🤘
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
            emoji="🎪"
            title="Shows"
            subtitle="¡Próximas presentaciones de Cualquier Verdura!"
            color="#f97316"
          />
          <div className="space-y-4 mt-8">
            {SHOWS.map((show, i) => (
              <ShowCard key={show.id} show={show} index={i} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <div className="inline-block px-6 py-4 rounded-2xl bg-white text-sm font-fredoka text-gray-400"
              style={{ border: "2px dashed #e5e7eb" }}>
              💡 Para agregar shows, editá <code className="text-cv-green">src/lib/clubData.js</code> → array <code>SHOWS</code>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}