import { motion } from "framer-motion";
import { TACUAROCK } from "@/lib/clubData";
import SectionHeader from "@/components/cv/SectionHeader";

export default function Tacuarock() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero dark */}
      <section className="py-20 px-4 bg-cv-dark relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none">
          {["🎸", "⚡", "🥁", "🎵", "🤘", "⭐"].map((emoji, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl opacity-20"
              style={{ left: `${5 + i * 16}%`, top: `${15 + (i % 2) * 50}%` }}
              animate={{ y: [-15, 15, -15], rotate: [-15, 15, -15] }}
              transition={{ duration: 2 + i * 0.4, repeat: Infinity }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          {/* Logo Tacuarock style */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
          >
            <motion.h1
              className="text-6xl md:text-8xl font-fredoka-one leading-none"
              style={{ color: "#ec4899", textShadow: "4px 4px 0 #06b6d4, 8px 8px 0 #facc15" }}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              TACUA
            </motion.h1>
            <motion.h1
              className="text-6xl md:text-8xl font-fredoka-one leading-none"
              style={{ color: "#facc15", textShadow: "4px 4px 0 #ef4444, 8px 8px 0 #a855f7" }}
              animate={{ scale: [1.02, 1, 1.02] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              ROCK
            </motion.h1>
          </motion.div>

          <motion.p
            className="text-xl md:text-2xl font-fredoka text-white/70 mt-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Alta Energía. Volumen al Máximo. 🎸
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="text-6xl mb-4">🤘</div>
          </motion.div>
        </div>
      </section>

      {/* Info */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src={TACUAROCK.image}
                alt="Tacuarock"
                className="w-full rounded-2xl"
                style={{ border: "4px solid #1a1a1a", boxShadow: "8px 8px 0 #a855f7" }}
              />
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="badge-cv mb-4" style={{ background: "#a855f720", borderColor: "#a855f7" }}>
                🎪 Festival
              </div>
              <h2 className="text-4xl font-fredoka-one text-cv-dark mb-4">
                {TACUAROCK.name} {TACUAROCK.edition}
              </h2>
              <p className="font-fredoka text-gray-600 text-lg leading-relaxed mb-4">
                {TACUAROCK.description}
              </p>
              <p className="font-fredoka text-gray-500 leading-relaxed">
                {TACUAROCK.longDescription}
              </p>
            </motion.div>
          </div>

          {/* Highlights */}
          <div className="mt-16">
            <h3 className="text-3xl font-fredoka-one text-cv-dark mb-8 text-center">¿Qué vas a encontrar?</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {TACUAROCK.highlights.map((highlight, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card-cv p-4 text-center"
                  style={{ background: ["#ec4899", "#22c55e", "#06b6d4", "#facc15", "#a855f7"][i] + "15" }}
                >
                  <div className="text-3xl mb-2">
                    {["🎸", "🎵", "🎨", "🎮", "👕"][i]}
                  </div>
                  <p className="font-fredoka-one text-cv-dark text-sm">{highlight}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Upcoming date */}
          {TACUAROCK.upcomingDate ? (
            <motion.div
              className="mt-12 text-center p-8 rounded-3xl bg-cv-dark text-white"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-fredoka-one text-cv-yellow mb-2">📅 Próxima Fecha</h3>
              <p className="text-2xl font-fredoka">{TACUAROCK.upcomingDate}</p>
              <div className="mt-4 flex gap-3 justify-center">
                <a href={TACUAROCK.socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                  className="btn-cv-primary">📸 Instagram</a>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="mt-12 text-center p-8 rounded-3xl bg-cv-yellow/20"
              style={{ border: "3px dashed #facc15" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl mb-3">📢</div>
              <h3 className="text-2xl font-fredoka-one text-cv-dark mb-2">¡Próximas fechas en camino!</h3>
              <p className="font-fredoka text-gray-500">Seguinos en Instagram para no perderte nada 🤘</p>
              <div className="mt-4 flex gap-3 justify-center">
                <a href={TACUAROCK.socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                  className="btn-cv-primary">📸 Seguir en Instagram</a>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}