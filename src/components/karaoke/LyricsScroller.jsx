import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VEG_IMAGES } from "@/lib/clubData";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getActiveBlock(specialBlocks = [], t) {
  return specialBlocks.find(b => t >= b.start && t < b.end) ?? null;
}

function getWordProgress(text, progress) {
  const words = text.trim().split(/\s+/);
  if (words.length <= 1) return progress;
  const weights = words.map(w => Math.max(w.length, 1));
  const total = weights.reduce((a, b) => a + b, 0);
  let acc = 0;
  const thresholds = weights.map(w => { acc += w / total; return acc; });
  const idx = thresholds.findIndex(t => progress < t);
  const i = idx === -1 ? words.length - 1 : idx;
  const prev = i === 0 ? 0 : thresholds[i - 1];
  const curr = thresholds[i];
  const within = (progress - prev) / (curr - prev);
  const step = words.length > 1 ? 90 / (words.length - 1) : 0;
  const baseX = -45 + i * step;
  const nextX = i < words.length - 1 ? -45 + (i + 1) * step : baseX;
  return (baseX + (nextX - baseX) * Math.min(within, 0.7)) / 100 + 0.5;
}

// ─────────────────────────────────────────────────────────────────────────────
// TomateRunner
// ─────────────────────────────────────────────────────────────────────────────
function TomateRunner({ xPercent }) {
  return (
    <motion.div
      className="flex items-end justify-center h-full"
      initial={{ x: `${xPercent}%`, opacity: 0, scale: 0.5 }}
      animate={{ x: `${xPercent}%`, opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{
        x: { type: "spring", stiffness: 80, damping: 28 },
        opacity: { duration: 0.2 },
        scale: { type: "spring", stiffness: 300, damping: 15 },
      }}
    >
      <motion.img
        src={VEG_IMAGES.tomate}
        alt=""
        className="w-9 h-9 object-contain drop-shadow-lg"
        animate={{ y: [0, -3, 0], rotate: [-8, 8, -8] }}
        transition={{ y: { duration: 0.6, repeat: Infinity }, rotate: { duration: 0.8, repeat: Infinity } }}
      />
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
export default function LyricsScroller({
  song,
  lines,
  activeIndex,
  tomateMode = false,
  currentTime = 0,
  showFinalMessage = false,
}) {
  const containerRef = useRef(null);
  const lineRefs = useRef([]);

  // Guardamos el último índice real (≥0) para posicionar el scroll al salir del gap
  const lastRealIndex = useRef(0);
  if (activeIndex >= 0) lastRealIndex.current = activeIndex;

  // Flag: ¿estábamos en gap en el render anterior?
  const prevWasGap = useRef(false);

  const specialBlocks = song?.specialBlocks ?? [];
  const activeBlock = getActiveBlock(specialBlocks, currentTime);
  const isGap = !!activeBlock;

  // ── Scroll normal (letra corriendo) ────────────────────────────────────
  useEffect(() => {
    if (isGap) return;          // durante gap no tocamos el scroll
    if (activeIndex < 0) return;
    const el = lineRefs.current[activeIndex];
    const box = containerRef.current;
    if (!el || !box) return;
    const top = el.offsetTop - box.clientHeight / 2 + el.clientHeight / 2;
    box.scrollTo({ top, behavior: "smooth" });
  }, [activeIndex, isGap]);

  // ── Al SALIR del gap: posicionar el scroll INSTANTÁNEO antes del fade-in ─
  useEffect(() => {
    const justLeftGap = prevWasGap.current && !isGap;
    prevWasGap.current = isGap;

    if (!justLeftGap) return;

    // Usamos el último índice real (puede que activeIndex sea todavía -1
    // en el frame exacto en que termina el bloque)
    const targetIndex = activeIndex >= 0 ? activeIndex : lastRealIndex.current;
    const el = lineRefs.current[targetIndex];
    const box = containerRef.current;
    if (!el || !box) return;
    const top = el.offsetTop - box.clientHeight / 2 + el.clientHeight / 2;
    // Scroll instantáneo — sin animación para que no se vea el "viaje"
    box.scrollTop = top;
  });
  // Sin dependencias → corre en cada render, pero solo actúa cuando justLeftGap

  // ── Progreso en la línea activa ─────────────────────────────────────────
  const lineProgress = (() => {
    if (activeIndex < 0 || !lines[activeIndex]) return 0;
    const { start, end } = lines[activeIndex];
    const dur = end - start;
    return dur <= 0 ? 0 : Math.max(0, Math.min(1, (currentTime - start) / dur));
  })();

  const wordProgress = activeIndex >= 0 && lines[activeIndex]
    ? getWordProgress(lines[activeIndex].text, lineProgress)
    : 0.5;
  const xPercent = -28 + wordProgress * 56;

  // ── Countdown antes de que vuelva la letra ──────────────────────────────
  const nextLineAfterBlock = activeBlock
    ? lines.find(l => l.start >= activeBlock.end)
    : null;
  const secsUntilNext = nextLineAfterBlock ? nextLineAfterBlock.start - currentTime : null;
  const countdown = secsUntilNext != null && secsUntilNext > 0 && secsUntilNext <= 3
    ? Math.ceil(secsUntilNext)
    : null;

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
  const BG = "linear-gradient(160deg, #1f1147 0%, #1a1a1a 60%, #2a0a1e 100%)";

  return (
    <div
      className="relative h-[300px] sm:h-[330px] md:h-[370px] overflow-hidden rounded-2xl"
      style={{ border: "3px solid #1a1a1a", background: BG }}
    >

      {/* ── LETRA (siempre montada en el DOM) ──────────────────────────── */}
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-y-scroll px-3 sm:px-4 py-6"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          // Ocultar visualmente durante gap o mensaje final (pero mantener en DOM
          // para que el scroll esté listo cuando vuelva)
          opacity: (isGap || showFinalMessage) ? 0 : 1,
          pointerEvents: (isGap || showFinalMessage) ? "none" : "auto",
          transition: "opacity 0.4s ease",
        }}
      >
        <div className="flex flex-col items-center gap-1 py-24">
          {lines.map((line, i) => {
            const isActive = i === activeIndex;
            const isPast   = activeIndex >= 0 && i < activeIndex;
            const isLong   = line.text.length > 22;

            return (
              <motion.div
                key={i}
                ref={el => (lineRefs.current[i] = el)}
                className="w-full flex flex-col items-center overflow-hidden"
                animate={{
                  // Líneas pasadas: colapsar sin ocupar espacio
                  maxHeight: isPast ? 0 : 300,
                  opacity:   isPast ? 0 : 1,
                  scale:     isActive ? 1.08 : 0.96,
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {/* Tomate corredor */}
                {tomateMode && (
                  <div style={{ height: isActive ? 44 : 0, transition: "height 0.3s ease", overflow: "hidden", width: "100%" }}>
                    <AnimatePresence>
                      {isActive && <TomateRunner key={activeIndex} xPercent={xPercent} />}
                    </AnimatePresence>
                  </div>
                )}

                {/* Texto */}
                <motion.p
                  className="font-bangers text-center tracking-wider leading-tight px-2 py-1"
                  animate={{
                    color: isActive ? "#ffd60a" : "#c9c9d6",
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  style={{
                    fontSize: isActive ? (isLong ? "1.3rem" : "1.85rem") : "1.2rem",
                    textShadow: isActive ? "0 0 22px rgba(255,214,10,0.55)" : "none",
                    wordBreak: "break-word",
                    lineHeight: "1.3",
                  }}
                >
                  {line.text}
                </motion.p>

                <div style={{ height: isActive ? 8 : 4 }} />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── BLOQUE ESPECIAL (intermedio musical) ───────────────────────── */}
      <AnimatePresence>
        {isGap && !showFinalMessage && (
          <motion.div
            key={`gap-${activeBlock.start}`}
            className="absolute inset-0 flex flex-col items-center justify-center px-4"
            style={{ background: BG }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {countdown ? (
              /* 3 - 2 - 1 */
              <>
                <motion.p
                  className="font-bangers text-white text-3xl tracking-widest text-center mb-3"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ¡¡A cantaar!!
                </motion.p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={countdown}
                    className="font-bangers text-cv-yellow text-8xl drop-shadow-lg"
                    initial={{ scale: 1.6, opacity: 0 }}
                    animate={{ scale: 1,   opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    {countdown}
                  </motion.p>
                </AnimatePresence>
              </>
            ) : (
              /* Pantalla del intermedio */
              <>
                <motion.p
                  className="text-4xl mb-2"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {activeBlock.emoji}
                </motion.p>
                <motion.p
                  className="font-bangers text-white text-3xl tracking-widest text-center mb-2"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {activeBlock.title}
                </motion.p>
                {activeBlock.message && (
                  <p className="font-fredoka text-white/70 text-base text-center">
                    {activeBlock.message}
                  </p>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MENSAJE FINAL ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {showFinalMessage && song?.finishMessage && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center px-4"
            style={{ background: BG }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.p
              className="font-bangers text-cv-yellow text-3xl md:text-4xl tracking-widest text-center"
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {song.finishMessage}
            </motion.p>
            <motion.img
              src="/assets/mano.svg"
              alt="Mano rockera"
              className="w-20 h-20 object-contain mt-6"
              animate={{ rotate: [-8, 8, -8], y: [0, -8, 0] }}
              transition={{ duration: 0.9, repeat: Infinity }}
            />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
