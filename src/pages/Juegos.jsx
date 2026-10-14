import { useState } from "react";
import { motion } from "framer-motion";
import { GAMES } from "@/lib/clubData";
import SectionHeader from "@/components/cv/SectionHeader";
import MemoryGame from "@/components/cv/games/MemoryGame";
import GuessSongGame from "@/components/cv/games/GuessSongGame";
import ChallengeCards from "@/components/cv/games/ChallengeCards";
import MysteryVeggie from "@/components/cv/games/MysteryVeggie";
import CatchPumpkins from "@/components/cv/games/CatchPumpkins";
import SpookyVeggie from "@/components/cv/games/SpookyVeggie";
import HauntedMemory from "@/components/cv/games/HauntedMemory";
import { useHalloween, HALLOWEEN_GAMES, CATCH_GAME } from "@/lib/halloween";

const GAME_COMPONENTS = {
  memoria: MemoryGame,
  "adivina-cancion": GuessSongGame,
  desafios: ChallengeCards,
  "verdura-misteriosa": MysteryVeggie,
  // Atrapá la Calabaza: fijo todo el año. Los otros dos son especiales de Halloween (19/10 al 31/10)
  "atrapa-calabaza": CatchPumpkins,
  "h-misteriosa": SpookyVeggie,
  "h-memoria": HauntedMemory,
};

export default function Juegos() {
  const [activeGame, setActiveGame] = useState(null);
  const h = useHalloween();

  const ActiveComponent = activeGame ? GAME_COMPONENTS[activeGame] : null;

  const openGame = (id) => {
    setActiveGame(id);
    // Scroll al top para que el juego aparezca en pantalla
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeGame = () => {
    setActiveGame(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderCard = (game, i) => (
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
                    onClick={() => openGame(game.id)}
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
                      <span className="badge-cv bg-gray-100" style={{ borderColor: "#e5e7eb" }}>
                        ⏳ Próximamente
                      </span>
                    )}
                  </motion.div>
                </motion.div>
  );

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
              {h && (
                <>
                  <div className="md:col-span-2 text-center">
                    <h2 className="font-bangers text-3xl tracking-wider text-cv-dark" style={{ textShadow: "2px 2px 0 #f97316" }}>
                      🎃 Especiales de Halloween
                    </h2>
                  </div>
                  {[CATCH_GAME, ...HALLOWEEN_GAMES].map((game, i) => renderCard(game, i))}
                  <div className="md:col-span-2 text-center mt-4">
                    <h2 className="font-bangers text-2xl tracking-wider text-cv-dark">Los juegos de siempre</h2>
                  </div>
                </>
              )}
              {(h ? GAMES : [...GAMES, CATCH_GAME]).map((game, i) => renderCard(game, i))}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <button onClick={closeGame} className="btn-cv-secondary mb-6 text-sm">
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
