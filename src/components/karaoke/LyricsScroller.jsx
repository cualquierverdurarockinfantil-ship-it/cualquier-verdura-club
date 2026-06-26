import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VEG_IMAGES } from "@/lib/clubData";

// ── Progreso del tomate siguiendo palabras (0→1) ──────────────────────────
function getWordProgress(lineText, lineProgress) {
  const words = lineText.trim().split(/\s+/);
  if (words.length <= 1) return lineProgress;
  const weights = words.map((w) => Math.max(w.length, 1));
  const total = weights.reduce((a, b) => a + b, 0);
  const thresholds = [];
  let acc = 0;
  for (const w of weights) { acc += w / total; thresholds.push(acc); }
  const wordIndex = thresholds.findIndex((t) => lineProgress < t);
  const safeIndex = wordIndex === -1 ? words.length - 1 : wordIndex;
  const prevThreshold = safeIndex === 0 ? 0 : thresholds[safeIndex - 1];
  const currThreshold = thresholds[safeIndex];
  const withinWord = (lineProgress - prevThreshold) / (currThreshold - prevThreshold);
  const step = words.length > 1 ? 90 / (words.length - 1) : 0;
  const baseX = -45 + safeIndex * step;
  const nextX = safeIndex < words.length - 1 ? -45 + (safeIndex + 1) * step : baseX;
  return (baseX + (nextX - baseX) * Math.min(withinWord, 0.7)) / 100 + 0.5;
}

// ── Detectar bloque especial activo ──────────────────────────────────────
function getActiveBlock(specialBlocks, currentTime) {
  if (!specialBlocks) return null;
  return specialBlocks.find(b => currentTime >= b.start && currentTime < b.end) || null;
}

export default function LyricsScroller({
  song,
  lines,
  activeIndex,
  tomateMode = false,
  currentTime = 0,
  showFinalMessage = false,
}) {
  const lyricsScrollRef = useRef(null);
  const lineRefs = useRef([]);
  const wasInGapRef = useRef(false);

  const specialBlocks = song?.specialBlocks || [];
  const activeBlock = getActiveBlock(specialBlocks, currentTime);

  // Un bloque es "gap" si no es de tipo "final" (el final lo manejamos como finishMessage)
  const isGap = !!activeBlock && activeBlock.type !== "final";

  // ── Scroll a la línea activa ─────────────────────────────────────────────
  useEffect(() => {
    if (activeIndex < 0) return;
    const el = lineRefs.current[activeIndex];
    const container = lyricsScrollRef.current;
    if (!el || !container) return;
    const top = el.offsetTop - container.clientHeight / 2 + el.clientHeight / 2;
    if (wasInGapRef.current) {
      // Venimos de un gap: scroll instantáneo para que la letra arranque
      // exactamente donde se quedó, sin animación que confunda
      container.scrollTop = top;
    } else {
      container.scrollTo({ top, behavior: "smooth" });
    }
  }, [activeIndex]);

  // Detectar transición gap→letra para el scroll instantáneo
  useEffect(() => {
    if (!isGap && wasInGapRef.current) {
      // El gap acaba de terminar — pre-posicionar antes de que aparezca la letra
      const el = lineRefs.current[activeIndex];
      const container = lyricsScrollRef.current;
      if (el && container) {
        const top = el.offsetTop - container.clientHeight / 2 + el.clientHeight / 2;
        container.scrollTop = top;
      }
    }
    wasInGapRef.current = isGap;
  }, [isGap, activeIndex]);

  // ── Progreso en línea activa ─────────────────────────────────────────────
  const lineProgress = (() => {
    if (activeIndex < 0 || !lines[activeIndex]) return 0;
    const curr = lines[activeIndex];
    const dur = curr.end - curr.start;
    if (dur <= 0) return 0;
    return Math.max(0, Math.min(1, (currentTime - curr.start) / dur));
  })();

  // Posición horizontal del tomate
  const wordProgress = activeIndex >= 0 && lines[activeIndex]
    ? getWordProgress(lines[activeIndex].text, lineProgress)
    : 0.5;
  const xPercent = -28 + wordProgress * 56;

  // ── Countdown: últimos 3 segs antes de que vuelva la letra ───────────────
  const nextLineAfterBlock = activeBlock
    ? lines.find(l => l.start >= activeBlock.end)
    : null;
  const secsUntilNext = nextLineAfterBlock ? nextLineAfterBlock.start - currentTime : null;
  const countdown =
    secsUntilNext !== null && secsUntilNext <= 3 && secsUntilNext > 0
      ? Math.ceil(secsUntilNext)
      : null;

  // ── Líneas visibles ──────────────────────────────────────────────────────
  // IMPORTANTE: siempre mostramos TODAS las líneas en el DOM para que el scroll
  // esté en la posición correcta cuando vuelve la letra.
  // Las líneas pasadas se colapsan (maxHeight→0) para no ocupar espacio visual.
  // La capa del bloque especial cubre todo cuando estamos en un gap.

  return (
    <div
      className="relative h-[300px] sm:h-[330px] md:h-[370px] overflow-hidden rounded-2xl"
      style={{
        border: "3px solid #1a1a1a",
        background: "linear-gradient(160deg, #1f1147 0%, #1a1a1a 60%, #2a0a1e 100%)",
      }}
    >
      {/* ── LETRA — siempre montada, nunca se desmonta ── */}
      <div
        className="absolute inset-0 overflow-y-scroll px-3 sm:px-4 py-6"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          // Ocultar letra durante gap o finishMessage, pero mantenerla en DOM
          opacity: (isGap || showFinalMessage) ? 0 : 1,
          pointerEvents: (isGap || showFinalMessage) ? "none" : "auto",
          transition: "opacity 0.3s ease",
        }}
        ref={lyricsScrollRef}
      >
        <div className="flex flex-col items-center gap-1 py-24">
          {lines.map((line, i) => {
            const isActive = i === activeIndex;
            const isPast = activeIndex >= 0 && i < activeIndex;
            const isLong = line.text.length > 22;

            let target;
            if (isActive) {
              target = { color: "#ffd60a", scale: 1.08, opacity: 1 };
            } else if (isPast) {
              target = { color: "#7a7a8c", scale: 0.92, opacity: 0 };
            } else {
              target = { color: "#c9c9d6", scale: 0.96, opacity: 0.75 };
            }

            return (
              <motion.div
                key={i}
                ref={(el) => (lineRefs.current[i] = el)}
                className="w-full flex flex-col items-center"
                style={{ position: "relative", zIndex: isActive ? 20 : 1, overflow: "hidden" }}
                animate={{
                  scale: target.scale,
                  opacity: target.opacity,
                  maxHeight: isPast ? 0 : 300,
                }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                {tomateMode && (
                  <div
                    className="w-full overflow-hidden"
                    style={{ height: isActive ? 44 : 0, transition: "height 0.3s ease" }}
                  >
                    <AnimatePresence>
                      {isActive && <TomateRunner key={activeIndex} xPercent={xPercent} />}
                    </AnimatePresence>
                  </div>
                )}

                <motion.p
                  className="font-bangers text-center tracking-wider leading-tight px-2 py-1"
                  animate={{ color: target.color }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  style={{
                    fontSize: isActive ? (isLong ? "1.3rem" : "1.85rem") : "1.2rem",
                    textShadow: isActive ? "0 0 22px rgba(255,214,10,0.55)" : "none",
                    maxWidth: "100%",
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    lineHeight: "1.3",
                  }}
                >
                  {line.text}
                </motion.p>

                {i < lines.length - 1 && (
                  <div style={{ height: isActive ? 8 : 4 }} />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── BLOQUE ESPECIAL (intermedios musicales) ── */}
      <AnimatePresence>
        {isGap && !showFinalMessage && (
          <motion.div
            key={`block-${activeBlock.start}`}
            className="absolute inset-0 flex flex-col items-center justify-center px-4"
            style={{
              background: "linear-gradient(160deg, #1f1147 0%, #1a1a1a 60%, #2a0a1e 100%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {countdown ? (
              /* Cuenta regresiva antes de que vuelva la letra */
              <>
                <motion.p
                  className="font-bangers text-white text-3xl md:text-4xl tracking-widest text-center mb-2"
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ¡¡A cantaar!!
                </motion.p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={countdown}
                    className="font-bangers text-cv-yellow text-8xl drop-shadow-lg"
                    initial={{ scale: 1.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    {countdown}
                  </motion.p>
                </AnimatePresence>
              </>
            ) : (
              /* Pantalla del intermedio: título + mensaje */
              <>
                <motion.p
                  className="font-bangers text-white/60 text-3xl tracking-widest mb-1"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {activeBlock.emoji}
                </motion.p>
                <motion.p
                  className="font-bangers text-white text-3xl tracking-widest mb-2 text-center"
                  animate={{ scale: [1, 1.06, 1] }}
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

      {/* ── MENSAJE FINAL — con la manito rockera ── */}
      <AnimatePresence>
        {showFinalMessage && song?.finishMessage && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center px-4"
            style={{
              background: "linear-gradient(160deg, #1f1147 0%, #1a1a1a 60%, #2a0a1e 100%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
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

// ── TomateRunner ──────────────────────────────────────────────────────────
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
        transition={{
          y: { duration: 0.6, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 0.8, repeat: Infinity, ease: "easeInOut" },
        }}
      />
    </motion.div>
  );
}
