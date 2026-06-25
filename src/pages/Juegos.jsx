import { useState } from "react";
import { motion } from "framer-motion";
import { GAMES } from "@/lib/clubData";
import SectionHeader from "@/components/cv/SectionHeader";
import MemoryGame from "@/components/cv/games/MemoryGame";
import GuessSongGame from "@/components/cv/games/GuessSongGame";
import ChallengeCards from "@/components/cv/games/ChallengeCards";
import MysteryVeggie from "@/components/cv/games/MysteryVeggie";

const GAME_COMPONENTS = {
  memoria: MemoryGame,
  "adivina-cancion": GuessSongGame,
  desafios: ChallengeCards,
  "verdura-misteriosa": MysteryVeggie,
};

export default function Juegos() {
  const [activeGame, setActiveGame] = useState(null);

  const ActiveComponent = activeGame ? GAME_COMPONENTS[activeGame] : null;

  return (
    <div className="min-h-screen bg-white">
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            emoji="🎮"
            title="Juegos"
            subtitle="¡A jugar con las verduras!"
            color="#06b6d4"
          />

          {!activeGame ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {GAMES.map((game, i) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <motion.div
                    className="card-cv p-8 text-center cursor-pointer"
                    style={{ background: game.color + "15" }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveGame(game.id)}
                  >
                    <motion.div
                      className="text-6xl mb-4"
                      animate={{ rotate: [-5, 5, -5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {game.icon}
                    </motion.div>
                    <h3 className="text-2xl font-fredoka-one text-cv-dark mb-2">
                      {game.title}
                    </h3>
                    <p className="font-fredoka text-gray-500 mb-4">{game.description}</p>
                    {game.available ? (
                      <div className="btn-cv-primary">¡Jugar! →</div>
                    ) : (
                      <span
                        className="badge-cv bg-gray-100"
                        style={{ borderColor: "#e5e7eb" }}
                      >
                        ⏳ Próximamente
                      </span>
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <button
                onClick={() => setActiveGame(null)}
                className="btn-cv-secondary mb-6 text-sm"
              >
                ← Volver a Juegos
              </button>
              {ActiveComponent && <ActiveComponent />}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}