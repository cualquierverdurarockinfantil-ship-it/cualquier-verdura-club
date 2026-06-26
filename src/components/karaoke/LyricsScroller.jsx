import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VEG_IMAGES } from "@/lib/clubData";

// ── Helpers ───────────────────────────────────────────────────────────────────

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

// ── TomateRunner ──────────────────────────────────────────────────────────────
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
          y: { duration: 0.6, repeat: Infinity },
          rotate: { duration: 0.8, repeat: Infinity },
        }}
      />
    </motion.div>
  );
}

// ── IntroScreen ───────────────────────────────────────────────────────────────
function IntroScreen({ intro, countdown }) {
  const BG = "linear-gradient(160deg, #1f1147 0%, #1a1a1a 60%, #2a0a1e 100%)";
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center px-4"
      style={{ background: BG }}
    >
      {countdown !== null ? (
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
          {intro.emoji && (
            <motion.p
              className="text-4xl mb-3"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {intro.emoji}
            </motion.p>
          )}
          <motion.p
            className="font-bangers text-white text-3xl tracking-widest text-center mb-2"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {intro.title}
          </motion.p>
          {intro.message && (
            <p className="font-fredoka text-white/70 text-base text-center">
              {intro.message}
            </p>
          )}
        </>
      )}
    </div>
  );
}

// ── LyricsSection ─────────────────────────────────────────────────────────────
// Una pantalla de letra: muestra TODAS las líneas de la sección,
// las pasadas desaparecen arriba, la activa resaltada, las futuras apagadas.
function LyricsSection({ lines, activeLineIndex, currentTime, tomateMode }) {
  const containerRef = useRef(null);
  const lineRefs = useRef([]);

  // Progreso dentro de la línea activa
  const lineProgress = (() => {
    if (activeLineIndex < 0 || !lines[activeLineIndex]) return 0;
    const { start, end } = lines[activeLineIndex];
    const dur = end - start;
    return dur <= 0 ? 0 : Math.max(0, Math.min(1, (currentTime - start) / dur));
  })();

  const wordProgress = activeLineIndex >= 0 && lines[activeLineIndex]
    ? getWordProgress(lines[activeLineIndex].text, lineProgress)
    : 0.5;
  const xPercent = -28 + wordProgress * 56;

  // Scroll suave a la línea activa
  useEffect(() => {
    if (activeLineIndex < 0) return;
    const el = lineRefs.current[activeLineIndex];
    const box = containerRef.current;
    if (!el || !box) return;
    const top = el.offsetTop - box.clientHeight / 2 + el.clientHeight / 2;
    box.scrollTo({ top, behavior: "smooth" });
  }, [activeLineIndex]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-y-scroll px-3 sm:px-4 py-6"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <div className="flex flex-col items-center gap-1 py-24">
        {lines.map((line, i) => {
          const isActive = i === activeLineIndex;
          const isPast   = activeLineIndex >= 0 && i < activeLineIndex;
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
                <div
                  style={{
                    height: isActive ? 44 : 0,
                    transition: "height 0.3s ease",
                    overflow: "hidden",
                    width: "100%",
                  }}
                >
                  <AnimatePresence>
                    {isActive && (
                      <TomateRunner key={activeLineIndex} xPercent={xPercent} />
                    )}
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
  );
}

// ── Main: LyricsScroller ──────────────────────────────────────────────────────
const BG = "linear-gradient(160deg, #1f1147 0%, #1a1a1a 60%, #2a0a1e 100%)";

export default function LyricsScroller({
  song,
  sectionIndex,
  lineIndex,
  inIntro,
  currentTime,
  showFinalMessage,
  tomateMode = false,
}) {
  const sections = song?.sections ?? [];
  const currentSection = sections[sectionIndex] ?? null;

  // Countdown: últimos 3s antes de que empiece la primera línea de la sección
  const firstLine = currentSection?.lines?.[0];
  const secsUntilFirst = firstLine ? firstLine.start - currentTime : null;
  const countdown =
    inIntro && secsUntilFirst != null && secsUntilFirst > 0 && secsUntilFirst <= 3
      ? Math.ceil(secsUntilFirst)
      : null;

  return (
    <div
      className="relative h-[300px] sm:h-[330px] md:h-[370px] overflow-hidden rounded-2xl"
      style={{ border: "3px solid #1a1a1a", background: BG }}
    >
      {/* ── SECCIÓN ACTIVA: Intro o Letra ── */}
      <AnimatePresence mode="wait">
        {showFinalMessage ? (
          // Mensaje final
          <motion.div
            key="final"
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
        ) : inIntro && currentSection?.intro ? (
          // Pantalla de intro/intermedio
          <motion.div
            key={`intro-${sectionIndex}`}
            className="absolute inset-0"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
          >
            <IntroScreen
              intro={currentSection.intro}
              countdown={countdown}
            />
          </motion.div>
        ) : currentSection && (currentSection.lines?.length ?? 0) > 0 ? (
          // Pantalla de letra
          <motion.div
            key={`lyrics-${sectionIndex}`}
            className="absolute inset-0"
            style={{ background: BG }}
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
          >
            <LyricsSection
              lines={currentSection.lines}
              activeLineIndex={lineIndex}
              currentTime={currentTime}
              tomateMode={tomateMode}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
