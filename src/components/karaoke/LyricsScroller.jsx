import { useRef, useEffect, useState } from "react";
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
  for (const w of weights) {
    acc += w / total;
    thresholds.push(acc);
  }

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

// ── Calcular líneas visibles hasta el próximo bloque especial ─────────────
function getVisibleLines(lines, specialBlocks, activeIndex) {
  if (!specialBlocks || specialBlocks.length === 0) return lines;
  const refIndex = activeIndex >= 0 ? activeIndex : 0;
  const refLine = lines[refIndex];
  if (!refLine) return lines;

  // Buscar si hay un bloque especial que empiece antes de que termine la línea actual
  // o el próximo bloque que interrumpe la secuencia de líneas
  for (let i = refIndex; i < lines.length - 1; i++) {
    const gapStart = lines[i].end;
    const gapEnd = lines[i + 1].start;
    // ¿Hay algún bloque especial que caiga en este hueco?
    const hasBlock = specialBlocks.some(b => b.start >= gapStart && b.start < gapEnd);
    if (hasBlock) {
      return lines.slice(0, i + 1);
    }
    // Fallback: hueco > 4s sin bloque definido
    if (gapEnd - gapStart > 4) {
      return lines.slice(0, i + 1);
    }
  }
  return lines;
}

export default function LyricsScroller({ song, lines, activeIndex, tomateMode = false, currentTime = 0, showFinalMessage = false }) {
  const lyricsScrollRef = useRef(null);
  const lineRefs = useRef([]);

  // Rastrear si veníamos de un gap para hacer scroll instantáneo al volver
  const wasInGapRef = useRef(false);

  const specialBlocks = song?.specialBlocks || [];
  const activeBlock = getActiveBlock(specialBlocks, currentTime);
  const isGap = !!activeBlock;

  // Scroll a la línea activa
  useEffect(() => {
    if (activeIndex < 0) return;
    const el = lineRefs.current[activeIndex];
    const container = lyricsScrollRef.current;
    if (!el || !container) return;

    const top = el.offsetTop - container.clientHeight / 2 + el.clientHeight / 2;

    if (wasInGapRef.current) {
      // Venimos de un gap: posicionamos ANTES de que AnimatePresence muestre la letra
      // guardamos la posición y la aplicamos al montar el scroll
      container.scrollTop = top;
    } else {
      container.scrollTo({ top, behavior: "smooth" });
    }
  }, [activeIndex]);

  // Cuando el gap termina, pre-posicionar el scroll antes de mostrar la letra
  useEffect(() => {
    if (!isGap && wasInGapRef.current) {
      // El gap acaba de terminar: forzar scroll correcto en el próximo frame
      const el = lineRefs.current[activeIndex];
      const container = lyricsScrollRef.current;
      if (el && container) {
        const top = el.offsetTop - container.clientHeight / 2 + el.clientHeight / 2;
        container.scrollTop = top;
      }
    }
    wasInGapRef.current = isGap;
  }, [isGap]);

  // Progreso dentro de la línea activa (0→1)
  const lineProgress = (() => {
    if (activeIndex < 0 || !lines[activeIndex]) return 0;
    const curr = lines[activeIndex];
    const duration = curr.end - curr.start;
    if (duration <= 0) return 0;
    return Math.max(0, Math.min(1, (currentTime - curr.start) / duration));
  })();

  // Posición horizontal del tomate
  const wordProgress = activeIndex >= 0 && lines[activeIndex]
    ? getWordProgress(lines[activeIndex].text, lineProgress)
    : 0.5;
  const xPercent = -28 + wordProgress * 56;

  // Countdown: últimos 3 segs antes de que vuelva la letra
  const nextLineAfterBlock = activeBlock
    ? lines.find(l => l.start >= activeBlock.end)
    : null;
  const secsUntilNext = nextLineAfterBlock ? nextLineAfterBlock.start - currentTime : null;
  const countdown = secsUntilNext !== null && secsUntilNext <= 3 && secsUntilNext > 0
    ? Math.ceil(secsUntilNext)
    : null;

  // Líneas visibles — cuando estamos en un gap, mostramos TODO para que el scroll
  // esté en la posición correcta cuando vuelva la letra (la capa del gap lo cubre visualmente)
  const visibleLines = getVisibleLines(lines, specialBlocks, isGap ? activeIndex : activeIndex);

  return (
    <div
      className="relative h-[300px] sm:h-[330px] md:h-[370px] overflow-hidden rounded-2xl"
      style={{
        border: "3px solid #1a1a1a",
        background: "linear-gradient(160deg, #1f1147 0%, #1a1a1a 60%, #2a0a1e 100%)",
      }}
    >
      {/* ── LETRA — siempre montada, nunca se desmonta para no perder scroll ── */}
      <div
        className="absolute inset-0 overflow-y-scroll px-3 sm:px-4 py-6"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          opacity: isGap ? 0 : 1,
          pointerEvents: isGap ? "none" : "auto",
          transition: "opacity 0.3s ease",
        }}
        ref={lyricsScrollRef}
      >
        <div className="flex flex-col items-center gap-1 py-24">
          {visibleLines.map((line, i) => {
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
                animate={{ scale: target.scale, opacity: target.opacity, maxHeight: isPast ? 0 : 300 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                {tomateMode && (
                  <div
                    className="w-full overflow-hidden"
                    style={{ height: isActive ? 44 : 0, transition: "height 0.3s ease" }}
                  >
                    <AnimatePresence>
                      {isActive && (
                        <TomateRunner key={activeIndex} xPercent={xPercent} />
                      )}
                    </AnimatePresence>
                  </div>
                )}

                <motion.p
                  className="font-bangers text-center tracking-wider leading-tight px-2 py-1"
                  animate={{ color: target.color }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  style={{
                    fontSize: isActive
                      ? isLong ? "1.3rem" : "1.85rem"
                      : "1.2rem",
                    textShadow: isActive ? "0 0 22px rgba(255,214,10,0.55)" : "none",
                    maxWidth: "100%",
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    lineHeight: "1.3",
                  }}
                >
                  {line.text}
                </motion.p>

                {i < visibleLines.length - 1 && (
                  <div style={{ height: isActive ? 8 : 4 }} />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── BLOQUE ESPECIAL — superpuesto sobre la letra ── */}
      <AnimatePresence>
        {isGap && !showFinalMessage && (
          <motion.div
            key={`block-${activeBlock.start}`}
            className="absolute inset-0 flex flex-col items-center justify-center px-4"
            style={{ background: "linear-gradient(160deg, #1f1147 0%, #1a1a1a 60%, #2a0a1e 100%)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {countdown ? (
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
              <>
                <motion.p
                  className="font-bangers text-white/60 text-xl tracking-widest mb-1"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {activeBlock.emoji}
                </motion.p>
                <motion.p
                  className="font-bangers text-white text-3xl tracking-widest mb-2"
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
            style={{ background: "linear-gradient(160deg, #1f1147 0%, #1a1a1a 60%, #2a0a1e 100%)" }}
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