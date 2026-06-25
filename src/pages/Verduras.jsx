import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VEGETABLES, KIDS_CHARACTERS } from "@/lib/clubData";
import SectionHeader from "@/components/cv/SectionHeader";

function VegetableCard({ veg, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, rotate: 2 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(veg)}
      className="card-cv p-6 text-center cursor-pointer"
      style={{ background: veg.color + "10" }}
    >
      <motion.div
        className="flex justify-center mb-4"
        animate={{ rotate: [-5, 5, -5] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <img
          src={veg.image}
          alt={veg.name}
          className="w-28 h-28 object-contain"
        />
      </motion.div>
      <h3 className="text-2xl font-bangers text-cv-dark tracking-wider">{veg.name}</h3>
      <p className="text-sm font-fredoka text-gray-500 mt-1">{veg.role}</p>
      <div
        className="mt-3 px-3 py-1 rounded-full text-xs font-fredoka inline-block"
        style={{ background: veg.color, color: "white" }}
      >
        {veg.instrument}
      </div>
    </motion.div>
  );
}

function VegetableModal({ veg, onClose }) {
  if (!veg) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative bg-white rounded-3xl p-8 max-w-md w-full z-10"
        style={{ border: "4px solid #1a1a1a", boxShadow: "10px 10px 0 #1a1a1a" }}
        initial={{ scale: 0.5, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0.5, rotate: 10 }}
        transition={{ type: "spring", damping: 20 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-cv-red text-white font-bangers flex items-center justify-center"
        >
          X
        </button>

        <motion.div
          className="flex justify-center mb-5"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <img
            src={veg.image}
            alt={veg.name}
            className="w-36 h-36 object-contain"
          />
        </motion.div>

        <div
          className="inline-block px-4 py-1 rounded-full text-white text-sm font-fredoka mb-3"
          style={{ background: veg.color }}
        >
          {veg.instrument}
        </div>

        <h2 className="text-3xl font-bangers text-cv-dark mb-1 tracking-wider">{veg.name}</h2>
        <p className="font-fredoka text-cv-fuchsia font-bold mb-4">{veg.role}</p>

        <div className="bg-gray-50 rounded-2xl p-4 mb-4">
          <h4 className="font-bangers text-cv-dark text-base mb-2 tracking-wider">Personalidad</h4>
          <p className="font-fredoka text-gray-600 leading-relaxed">{veg.personality}</p>
        </div>

        <div className="bg-cv-yellow/20 rounded-2xl p-4" style={{ border: "2px dashed #facc15" }}>
          <h4 className="font-bangers text-cv-dark text-base mb-2 tracking-wider">Curiosidad</h4>
          <p className="font-fredoka text-gray-600 text-sm">{veg.curiosity}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function KidCard({ kid }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="card-cv p-6 text-center"
      style={{ background: kid.color + "10" }}
      whileHover={{ scale: 1.03 }}
    >
      <motion.div
        className="flex justify-center mb-4"
        animate={{ y: [0, -8, 0], rotate: [-3, 3, -3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <img
          src={kid.image}
          alt={kid.name}
          className="w-28 h-28 object-contain"
        />
      </motion.div>
      <h3 className="text-xl font-bangers text-cv-dark tracking-wider">{kid.name}</h3>
      <p className="text-sm font-fredoka text-gray-500 mt-2 leading-relaxed">{kid.description}</p>
      <div
        className="mt-3 px-3 py-1 rounded-full text-xs font-fredoka inline-block text-white"
        style={{ background: kid.color }}
      >
        Fan del Club
      </div>
    </motion.div>
  );
}

export default function Verduras() {
  const [selectedVeg, setSelectedVeg] = useState(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="py-20 px-4 bg-cv-green/5 relative overflow-hidden">
        {/* Decorative characters peeking */}
        <motion.img
          src={VEGETABLES[0].image}
          alt="Tomate"
          className="absolute -left-6 bottom-0 w-40 object-contain pointer-events-none opacity-30"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.img
          src={VEGETABLES[2].image}
          alt="Zanahoria"
          className="absolute -right-4 bottom-0 w-36 object-contain pointer-events-none opacity-30"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, delay: 0.5 }}
        />
        <div className="max-w-6xl mx-auto relative z-10">
          <SectionHeader
            title="Los Personajes"
            subtitle="La banda de verduras más rockera del mundo"
            color="#22c55e"
          />
        </div>
      </section>

      {/* Vegetables Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bangers text-cv-dark mb-8 text-center tracking-wider">
            La Banda — Las Verduras
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {VEGETABLES.map((veg) => (
              <VegetableCard key={veg.id} veg={veg} onClick={setSelectedVeg} />
            ))}
          </div>
        </div>
      </section>

      {/* Kids Section */}
      <section className="py-16 px-4 bg-cv-fuchsia/5">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            title="Los Fans"
            subtitle="Los nenes y nenas del Club Verdura"
            color="#ec4899"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {KIDS_CHARACTERS.map((kid) => (
              <KidCard key={kid.id} kid={kid} />
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selectedVeg && (
          <VegetableModal veg={selectedVeg} onClose={() => setSelectedVeg(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}