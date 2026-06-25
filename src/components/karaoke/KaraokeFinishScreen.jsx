import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { VEG_IMAGES } from "@/lib/clubData";

// Pantalla amigable de finalización. Sin puntajes ni rankings.
// 3 botones: cantar de nuevo, escuchar (Disco), ver videoclip (Videos).
export default function KaraokeFinishScreen({ song, onRestart }) {
  const navigate = useNavigate();

  const buttons = [
    { icon: "🎤", label: "Cantar de nuevo", color: "#ec4899", action: onRestart },
    { icon: "🎧", label: "Escuchar canción", color: "#22c55e", action: () => navigate("/disco") },
    { icon: "🎬", label: "Ver videoclip", color: "#06b6d4", action: () => navigate("/videos") },
  ];

  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center px-6 py-10"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", damping: 18 }}
    >
      <motion.img
        src={VEG_IMAGES.tomate}
        alt="Tomate"
        className="w-28 h-28 object-contain mb-2"
        animate={{ rotate: [-10, 10, -10], y: [0, -8, 0] }}
        transition={{ duration: 0.9, repeat: Infinity }}
      />
      <div className="flex items-center gap-3 mb-1">
        <h2 className="text-4xl font-bangers text-cv-dark tracking-wider">¡Muy bien!</h2>
        <img
          src="/assets/mano.svg"
          alt="mano rockera"
          className="w-10 h-10 object-contain"
        />
      </div>
      <p className="font-fredoka text-gray-500 text-lg mt-1 mb-1">Terminaste la canción</p>
      <p className="font-bangers text-cv-fuchsia text-xl tracking-wide mb-6">{song.title}</p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        {buttons.map((b, i) => (
          <motion.button
            key={i}
            onClick={b.action}
            className="flex items-center justify-center gap-2 rounded-full py-4 px-6 font-bangers text-white text-lg tracking-wider"
            style={{ background: b.color, border: "3px solid #1a1a1a", boxShadow: "4px 4px 0 #1a1a1a" }}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
          >
            <span className="text-2xl">{b.icon}</span> {b.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}