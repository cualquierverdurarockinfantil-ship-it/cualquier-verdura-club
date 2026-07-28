import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Botón "📋 Reglas" + ventana emergente con las reglas del juego.
 * Usalo dentro de la pantalla de inicio de cada juego, antes de arrancar.
 *
 * <GameRulesButton title="Memoria Verdura" accentColor="#22c55e" rules={[...]} />
 */
export default function GameRulesButton({ title, accentColor = "#22c55e", rules = [] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 font-bangers text-base tracking-wide px-4 py-2 rounded-full mb-4"
        style={{
          background: "#fff",
          color: "#1a1a1a",
          border: "3px solid #1a1a1a",
          boxShadow: "3px 3px 0 #1a1a1a",
        }}
      >
        📋 Ver las reglas
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="relative bg-white rounded-3xl p-6 md:p-8 max-w-md w-full z-10 max-h-[85vh] overflow-y-auto"
              style={{ border: "4px solid #1a1a1a", boxShadow: "10px 10px 0 #1a1a1a" }}
              initial={{ scale: 0.5, rotate: -6 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.5, rotate: 6 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-cv-red text-white font-bangers flex items-center justify-center"
                aria-label="Cerrar"
              >
                X
              </button>

              <div
                className="inline-block px-4 py-1 rounded-full text-white text-sm font-fredoka mb-3"
                style={{ background: accentColor }}
              >
                Cómo se juega
              </div>

              <h2 className="text-2xl md:text-3xl font-bangers text-cv-dark mb-4 tracking-wider pr-8">
                {title}
              </h2>

              <ol className="space-y-3 mb-2">
                {rules.map((rule, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span
                      className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-bangers text-white text-sm"
                      style={{ background: accentColor }}
                    >
                      {i + 1}
                    </span>
                    <span className="font-fredoka text-cv-dark leading-snug pt-0.5">{rule}</span>
                  </li>
                ))}
              </ol>

              <button
                onClick={() => setOpen(false)}
                className="btn-cv-primary w-full justify-center mt-5"
              >
                ¡Entendido, a jugar! 🎉
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
