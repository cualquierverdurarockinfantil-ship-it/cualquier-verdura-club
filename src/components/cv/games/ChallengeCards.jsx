import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 50 desafíos — fácil de ampliar agregando más al array
const CHALLENGES = [
  { emoji: "💃", text: "Bailá durante 10 segundos" },
  { emoji: "🥕", text: "Inventá una verdura nueva" },
  { emoji: "🎤", text: "Cantá una canción" },
  { emoji: "😜", text: "Hacé una cara graciosa" },
  { emoji: "🥦", text: "Imitá una verdura" },
  { emoji: "🎸", text: "Cantá como cantante de rock" },
  { emoji: "🎸", text: "Tocá una guitarra imaginaria" },
  { emoji: "🥁", text: "Hacé el sonido de una batería" },
  { emoji: "📝", text: "Inventá una letra sobre tu comida favorita" },
  { emoji: "🍅", text: "Caminá como un tomate" },
  { emoji: "🥦", text: "Saltá 5 veces como un brócoli" },
  { emoji: "🌟", text: "Hacé una pose de rockstar" },
  { emoji: "🎸", text: "Imitá el sonido de una guitarra eléctrica" },
  { emoji: "🔤", text: "Cantá el abecedario al revés" },
  { emoji: "😮", text: "Hacé una cara de sorpresa" },
  { emoji: "🎤", text: "Bailá como si estuvieras en un escenario" },
  { emoji: "💃", text: "Inventá un baile nuevo" },
  { emoji: "🥁", text: "Tocá una batería imaginaria" },
  { emoji: "🎤", text: "Hacé el sonido de un micrófono" },
  { emoji: "🥕", text: "Nombrá 3 verduras que empiecen con la misma letra" },
  { emoji: "⭐", text: "Imitá a una estrella de rock" },
  { emoji: "😠", text: "Hacé una cara de enojo" },
  { emoji: "🧅", text: "Bailá lento como una cebolla" },
  { emoji: "🎵", text: "Cantá una canción sin palabras" },
  { emoji: "🎸", text: "Inventá un nombre para una banda de verduras" },
  { emoji: "🎹", text: "Hacé el gesto de tocar el piano" },
  { emoji: "🐰", text: "Saltá como un conejo" },
  { emoji: "😄", text: "Hacé una cara de alegría" },
  { emoji: "🎭", text: "Imitá a un cantante de ópera" },
  { emoji: "🥕", text: "Bailá rápido como una zanahoria" },
  { emoji: "🎤", text: "Cantá tu nombre con ritmo de rock" },
  { emoji: "📣", text: "Inventá un grito de guerra para el Club Verdura" },
  { emoji: "🎸", text: "Hacé el sonido de un bajo" },
  { emoji: "🎸", text: "Tocá una guitarra invisible" },
  { emoji: "😨", text: "Hacé una cara de miedo" },
  { emoji: "🤖", text: "Bailá como un robot" },
  { emoji: "🥁", text: "Imitá a un baterista" },
  { emoji: "🎵", text: "Cantá una canción de cuna" },
  { emoji: "🍆", text: "Inventá una verdura que vuele" },
  { emoji: "🦸", text: "Hacé una pose de superhéroe" },
  { emoji: "🩰", text: "Bailá en un pie" },
  { emoji: "🥁", text: "Hacé el sonido de un platillo" },
  { emoji: "🎤", text: "Cantá como si estuvieras en un karaoke" },
  { emoji: "📖", text: "Inventá una historia sobre una verdura" },
  { emoji: "😕", text: "Hacé una cara de confusión" },
  { emoji: "🌧️", text: "Bailá como si lloviera" },
  { emoji: "🎺", text: "Imitá a un trompetista" },
  { emoji: "🎂", text: "Cantá una canción de cumpleaños" },
  { emoji: "🎵", text: "Inventá un nuevo instrumento musical" },
  { emoji: "🤘", text: "Hacé la mejor cara de rockstar que puedas" },
];

export default function ChallengeCards() {
  const [currentIdx, setCurrentIdx] = useState(null);
  const [drawn, setDrawn] = useState([]);

  const drawCard = () => {
    let idx;
    let attempts = 0;
    do {
      idx = Math.floor(Math.random() * CHALLENGES.length);
      attempts++;
    } while (drawn.includes(idx) && attempts < CHALLENGES.length);

    const newDrawn = drawn.length >= CHALLENGES.length ? [idx] : [...drawn, idx];
    setDrawn(newDrawn);
    setCurrentIdx(idx);
  };

  const current = currentIdx !== null ? CHALLENGES[currentIdx] : null;

  return (
    <div className="text-center">
      {!current ? (
        <div>
          <motion.div
            className="text-6xl mb-4"
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎲
          </motion.div>
          <h3 className="text-2xl font-fredoka-one text-cv-dark mb-2">Desafíos Verdura</h3>
          <p className="font-fredoka text-gray-500 mb-6 max-w-md mx-auto">
            Sacá una tarjeta al azar y cumplí el desafío. ¡Rápido, divertido y para toda la familia!
          </p>
          <button onClick={drawCard} className="btn-cv-primary">
            🎴 Sacar una tarjeta
          </button>
        </div>
      ) : (
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIdx}
              className="card-cv p-8 md:p-10 max-w-md mx-auto"
              initial={{ rotateY: 180, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4 }}
              style={{ background: "#a855f720" }}
            >
              <div className="text-6xl mb-4">{current.emoji}</div>
              <p className="font-fredoka-one text-cv-dark text-xl leading-relaxed">
                {current.text}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={drawCard} className="btn-cv-primary">
              🎴 Otra tarjeta →
            </button>
          </div>

          <p className="font-fredoka text-gray-400 text-sm mt-4">
            {drawn.length} de {CHALLENGES.length} tarjetas sacadas
          </p>
        </div>
      )}
    </div>
  );
}