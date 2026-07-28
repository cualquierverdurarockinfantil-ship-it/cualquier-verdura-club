import { AnimatePresence, motion } from "framer-motion";
import { Play, Plus, X } from "lucide-react";
import { useMusicPlayer } from "@/context/MusicPlayerContext";

export default function PlayChoiceModal() {
  const { pendingTrack, confirmPlayNow, confirmAddToQueue, cancelPending } = useMusicPlayer();

  return (
    <AnimatePresence>
      {pendingTrack && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={cancelPending} />
          <motion.div
            className="relative bg-white rounded-3xl p-6 max-w-sm w-full z-10"
            style={{ border: "4px solid #1a1a1a", boxShadow: "10px 10px 0 #1a1a1a" }}
            initial={{ scale: 0.5, rotate: -6 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.5, rotate: 6 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <h2 className="font-bangers text-2xl tracking-wider text-cv-dark text-center mb-1">
              ¿Qué querés hacer?
            </h2>
            <p className="font-fredoka text-gray-500 text-sm text-center mb-5 truncate">
              🎵 {pendingTrack.title}
            </p>

            <div className="space-y-2.5">
              <button
                onClick={confirmPlayNow}
                className="w-full flex items-center justify-center gap-2 font-bangers tracking-wide text-base py-3 rounded-2xl"
                style={{ background: "#22c55e", color: "#fff", border: "3px solid #1a1a1a", boxShadow: "3px 3px 0 #1a1a1a" }}
              >
                <Play size={18} className="fill-white" /> Reproducir ahora
              </button>
              <button
                onClick={confirmAddToQueue}
                className="w-full flex items-center justify-center gap-2 font-bangers tracking-wide text-base py-3 rounded-2xl"
                style={{ background: "#06b6d4", color: "#fff", border: "3px solid #1a1a1a", boxShadow: "3px 3px 0 #1a1a1a" }}
              >
                <Plus size={18} /> Agregar a la playlist
              </button>
              <button
                onClick={cancelPending}
                className="w-full flex items-center justify-center gap-2 font-fredoka text-gray-500 text-sm py-2.5"
              >
                <X size={16} /> Cancelar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
