import { useRef, useEffect } from "react";
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

  const specialBlocks = song?.specialBlocks ?? [];
  const activeBlock = getActiveBlock(specialBlocks, currentTime);
  const isGap = !!activeBlock;

  // Guardamos el último índice REAL (≥0) para scroll durante el gap
  const lastRealIndex = useRef(0);
  if (activeIndex >= 0) lastRealIndex.current = activeIndex;

  // ── Scroll normal: cuando cambia la línea activa y NO estamos en gap ────
  useEffect(() => {
    if (isGap) return;
    if (activeIndex < 0) return;
    const el = lineRefs.current[activeIndex];
    const box = containerRef.current;
    if (!el || !box) return;
    const top = el.offsetTop - box.clientHeight / 2 + el.clientHeight / 2;
    box.scrollTo({ top, behavior: "smooth" });
  }, [activeIndex, isGap]);

  // ── Scroll durante gap: mantener actualizado MIENTRAS estamos en el gap ──
  // Esto es la clave: en vez de intentar posicionar al SALIR del gap
  // (donde el DOM todavía tiene la geometría vieja), posicionamos
  // CONTINUAMENTE durante el gap, DESPUÉS de que React colapsa las líneas.
  // Cuando el gap termina, el scroll ya está exactamente donde debe estar.
  useEffect(() => {
    if (!isGap) return;
    // La próxima línea después del bloque
    const nextLine = activeBlock
      ? lines.find(l => l.start >= activeBlock.end)
      : null;
    if (!nextLine) return;
    const nextIndex = lines.indexOf(nextLine);
    if (nextIndex < 0) return;

    // Usamos requestAnimationFrame para asegurarnos que React ya commitió
    // el colapso de líneas pasadas al DOM antes de medir y scrollear
    const raf = requestAnimationFrame(() => {
      const el = lineRefs.current[nextIndex];
      const box = containerRef.current;
      if (!el || !box) return;
      const top = el.offsetTop - box.clientHeight / 2 + el.clientHeight / 2;
      box.scrollTop = top;
    });
    return () => cancelAnimationFrame(raf);
  }, [isGap, activeIndex, activeBlock, lines]);

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

  // ── Calcular cuáles líneas son "de esta sección" ────────────────────────
  // Solo mostramos hasta el próximo bloque especial, el resto no se renderiza.
  // Esto resuelve que se vean líneas de la siguiente sección durante un gap.
  function getLinesForCurrentSection() {
    if (!activeBlock) {
      // No estamos en gap: mostrar desde el principio hasta el próximo bloque
      // que sea POSTERIOR a la línea activa
      let cutoff = lines.length;
      for (let i = 0; i < specialBlocks.length; i++) {
        const block = specialBlocks[i];
        // Buscar la primera línea después del tiempo actual que quede antes de un bloque
        if (block.start > currentTime) {
          const idx = lines.findIndex(l => l.end > block.start);
          if (idx >= 0) { cutoff = idx + 1; break; }
        }
      }
      return { sectionLines: lines.slice(0, cutoff), offset: 0 };
    } else {
      // Estamos en gap: mostrar las líneas DESPUÉS de este bloque (próxima sección)
      const nextBlockEnd = activeBlock.end;
      const startIdx = lines.findIndex(l => l.start >= nextBlockEnd);
      if (startIdx < 0) return { sectionLines: [], offset: 0 };

      // Encontrar el fin de esta sección (próximo bloque)
      let endIdx = lines.length;
      for (const b of specialBlocks) {
        if (b.start >= activeBlock.end) {
          const idx = lines.findIndex((l, i) => i >= startIdx && l.end > b.start);
          if (idx >= 0) { endIdx = idx + 1; break; }
        }
      }
      return { sectionLines: lines.slice(startIdx, endIdx), offset: startIdx };
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
  const BG = "linear-gradient(160deg, #1f1147 0%, #1a1a1a 60%, #2a0a1e 100%)";

  // Durante el gap mostramos TODAS las líneas en el DOM para que el scroll
  // pueda posicionarse correctamente. La sección "getLinesForCurrentSection"
  // solo determina lo que mostramos visualmente cuando NO hay gap.
  // Cuando hay gap, la capa oscura lo tapa todo de todas formas.

  return (
    <div
      className="relative h-[300px] sm:h-[330px] md:h-[370px] overflow-hidden rounded-2xl"
      style={{ border: "3px solid #1a1a1a", background: BG }}
    >

      {/* ── LETRA (siempre en DOM) ──────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-y-scroll px-3 sm:px-4 py-6"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
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
                  maxHeight: isPast ? 0 : 300,
                  opacity:   isPast ? 0 : 1,
                  scale:     isActive ? 1.08 : 0.96,
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {tomateMode && (
                  <div style={{ height: isActive ? 44 : 0, transition: "height 0.3s ease", overflow: "hidden", width: "100%" }}>
                    <AnimatePresence>
                      {isActive && <TomateRunner key={activeIndex} xPercent={xPercent} />}
                    </AnimatePresence>
                  </div>
                )}

                <motion.p
                  className="font-bangers text-center tracking-wider leading-tight px-2 py-1"
                  animate={{ color: isActive ? "#ffd60a" : "#c9c9d6" }}
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

      {/* ── BLOQUE ESPECIAL ─────────────────────────────────────────────── */}
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

      {/* ── MENSAJE FINAL ───────────────────────────────────────────────── */}
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
