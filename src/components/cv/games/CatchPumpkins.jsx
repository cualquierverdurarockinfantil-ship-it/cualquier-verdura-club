import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import GameRulesButton from "./GameRulesButton";
import { Bat, Ghost, Moon, Pumpkin } from "../halloween/HalloweenArt";

/**
 * ATRAPÁ LA CALABAZA
 * Caen calabazas, fantasmas y murciélagos. Tocá las calabazas y esquivá lo demás.
 * 3 vidas. Cada 8 puntos sube el nivel (más rápido, más seguido y con trampas nuevas):
 *   nivel 2: aparecen calabazas verdes (malditas)  ·  nivel 3: las calabazas van en zigzag
 *   nivel 4: los fantasmas titilan y a veces caen ráfagas  ·  combo x2 con 5 calabazas seguidas
 */

const HUD_BADGE = { background: "#fff7ed", color: "#1a1a1a", border: "2px solid #1a1a1a", padding: "2px 12px" };
const BEST_KEY = "cv-halloween-catch-best";
const SIZES = { pumpkin: 74, golden: 82, ghost: 58, bat: 70 };

function readBest() {
  try {
    return Number(window.localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}
function saveBest(v) {
  try {
    window.localStorage.setItem(BEST_KEY, String(v));
  } catch {
    /* sin almacenamiento: no pasa nada */
  }
}
function reducedMotion() {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

function pickType(level) {
  // [tipo, peso]: la calabaza común es la más frecuente; las malditas aparecen desde el nivel 2
  const table = [
    ["pumpkin", 52],
    ["golden", 5],
    ["ghost", 17],
    ["bat", level >= 2 ? 13 : 8],
    ["cursed", level >= 2 ? 14 : 0],
  ];
  const total = table.reduce((n, [, w]) => n + w, 0);
  let r = Math.random() * total;
  for (const [type, w] of table) {
    r -= w;
    if (r < 0) return type;
  }
  return "pumpkin";
}

function ItemArt({ type }) {
  if (type === "ghost") return <Ghost style={{ width: SIZES.ghost, height: "auto" }} />;
  if (type === "bat") return <Bat style={{ width: SIZES.bat, height: "auto" }} />;
  if (type === "cursed")
    return (
      <Pumpkin
        style={{
          width: SIZES.pumpkin,
          height: "auto",
          filter: "hue-rotate(95deg) saturate(1.1) brightness(0.8) drop-shadow(0 0 8px #22c55e)",
        }}
      />
    );
  if (type === "golden")
    return (
      <Pumpkin
        style={{
          width: SIZES.golden,
          height: "auto",
          filter: "hue-rotate(38deg) saturate(1.7) brightness(1.25) drop-shadow(0 0 10px #fde047)",
        }}
      />
    );
  return <Pumpkin style={{ width: SIZES.pumpkin, height: "auto" }} />;
}

export default function CatchPumpkins() {
  const [phase, setPhase] = useState("intro"); // intro | playing | over
  const [, setTick] = useState(0);
  const [hud, setHud] = useState({ score: 0, lives: 3, level: 1, combo: 0 });
  const [banner, setBanner] = useState(null);
  const [best, setBest] = useState(readBest);
  const [hurt, setHurt] = useState(false);
  const area = useRef(null);
  const g = useRef({ items: [], pops: [], score: 0, lives: 3, level: 1, spawn: 0, id: 1, t: 0 });
  const raf = useRef(0);
  const shell = useRef(null);

  // Pantalla completa mientras se juega: se congela la página de atrás para que no se mueva sola
  // (en el celular, un dedo que arrastra o rebota sobre el juego hacía scrollear toda la página).
  const fullscreen = phase !== "intro";
  useEffect(() => {
    if (!fullscreen) return undefined;
    const y = window.scrollY;
    const b = document.body;
    const prev = { position: b.style.position, top: b.style.top, width: b.style.width, overflow: b.style.overflow };
    const htmlPrev = document.documentElement.style.overscrollBehavior;
    b.style.position = "fixed";
    b.style.top = `-${y}px`;
    b.style.width = "100%";
    b.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";
    return () => {
      b.style.position = prev.position;
      b.style.top = prev.top;
      b.style.width = prev.width;
      b.style.overflow = prev.overflow;
      document.documentElement.style.overscrollBehavior = htmlPrev;
      window.scrollTo(0, y);
    };
  }, [fullscreen]);

  // touchmove no pasivo: ningún gesto sobre el juego mueve la página
  useEffect(() => {
    const el = shell.current;
    if (!el) return undefined;
    const stop = (e) => e.preventDefault();
    el.addEventListener("touchmove", stop, { passive: false });
    return () => el.removeEventListener("touchmove", stop);
  }, [fullscreen]);

  const exitGame = () => {
    const sc = g.current.score;
    if (sc > readBest()) {
      saveBest(sc);
      setBest(sc);
    }
    setPhase("intro");
  };

  const start = () => {
    g.current = { items: [], pops: [], score: 0, lives: 3, level: 1, spawn: 0.4, id: 1, t: 0, combo: 0 };
    setHud({ score: 0, lives: 3, level: 1, combo: 0 });
    setBanner(null);
    setPhase("playing");
  };

  const endGame = () => {
    const s = g.current.score;
    if (s > readBest()) {
      saveBest(s);
      setBest(s);
    }
    setPhase("over");
  };

  const hit = (item, e) => {
    e.preventDefault();
    const s = g.current;
    if (!s.items.find((i) => i.id === item.id)) return;
    s.items = s.items.filter((i) => i.id !== item.id);
    const base = item.type === "golden" ? 5 : item.type === "pumpkin" ? 1 : 0;
    if (base) {
      s.combo += 1;
      const mult = s.combo >= 5 ? 2 : 1;
      const gain = base * mult;
      s.score += gain;
      const newLevel = 1 + Math.floor(s.score / 8);
      if (newLevel > s.level) {
        s.level = newLevel;
        setBanner(`¡Nivel ${newLevel}!`);
        setTimeout(() => setBanner(null), 1100);
      }
      s.pops.push({ id: item.id, x: item.x, y: item.y, text: `+${gain}`, color: mult > 1 ? "#fb923c" : "#fde047", until: s.t + 0.6 });
    } else {
      s.lives -= 1;
      s.combo = 0;
      s.pops.push({ id: item.id, x: item.x, y: item.y, text: item.type === "cursed" ? "¡Maldita!" : "¡Uy!", color: "#f87171", until: s.t + 0.7 });
      setHurt(true);
      setTimeout(() => setHurt(false), 250);
    }
    setHud({ score: s.score, lives: s.lives, level: s.level, combo: s.combo });
    if (s.lives <= 0) endGame();
    setTick((t) => t + 1);
  };

  useEffect(() => {
    if (phase !== "playing") return undefined;
    const calm = reducedMotion() ? 0.6 : 1;
    let last = performance.now();
    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const s = g.current;
      const H = area.current ? area.current.clientHeight : 480;
      s.t += dt;
      s.spawn -= dt;
      if (s.spawn <= 0) {
        const burst = s.level >= 4 && Math.random() < 0.2 ? 3 : 1; // ráfaga
        for (let k = 0; k < burst; k++) {
          const type = pickType(s.level);
          const x0 = 8 + Math.random() * 80;
          s.items.push({
            id: s.id++,
            type,
            x: x0,
            x0,
            y: -90 - k * 70,
            vy: (200 + s.level * 34 + Math.random() * 70) * calm * (type === "bat" ? 1.15 : 1),
            phase: Math.random() * 6,
          });
        }
        s.spawn = Math.max(0.2, 0.78 - s.level * 0.065) + Math.random() * 0.18;
      }
      s.items.forEach((i) => {
        i.y += i.vy * dt;
        if (i.type === "bat") i.x = Math.min(90, Math.max(4, i.x0 + Math.sin(s.t * 2.6 + i.phase) * 9));
        else if (s.level >= 3 && (i.type === "pumpkin" || i.type === "cursed")) i.x = Math.min(90, Math.max(4, i.x0 + Math.sin(s.t * 2.2 + i.phase) * 7));
      });
      // una calabaza que se escapa corta el combo
      if (s.items.some((i) => i.y >= H + 20 && (i.type === "pumpkin" || i.type === "golden")) && s.combo > 0) {
        s.combo = 0;
        setHud((h0) => ({ ...h0, combo: 0 }));
      }
      s.items = s.items.filter((i) => i.y < H + 20);
      s.pops = s.pops.filter((p) => p.until > s.t);
      setTick((t) => t + 1);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [phase]);

  const s = g.current;

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-4">
        <div className="text-5xl mb-1">🎃</div>
        <h3 className="font-bangers text-cv-dark text-3xl tracking-wider">Atrapá la Calabaza</h3>
      </div>

      {phase === "intro" && (
        <motion.div className="card-cv p-6 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="font-fredoka text-gray-600 mb-4">
            ¡Caen calabazas del cielo! Tocalas para atraparlas, pero cuidado con los fantasmas y los murciélagos.
          </p>
          <div className="flex justify-center gap-5 items-end mb-5">
            <div className="text-center"><Pumpkin style={{ width: 54 }} /><p className="font-bangers text-sm">+1</p></div>
            <div className="text-center"><Pumpkin style={{ width: 58, filter: "hue-rotate(38deg) saturate(1.7) brightness(1.25)" }} /><p className="font-bangers text-sm">+5</p></div>
            <div className="text-center"><Pumpkin style={{ width: 54, filter: "hue-rotate(95deg) saturate(1.1) brightness(0.8)" }} /><p className="font-bangers text-sm text-red-500">¡NO!</p></div>
            <div className="text-center"><Ghost style={{ width: 40 }} /><p className="font-bangers text-sm text-red-500">¡NO!</p></div>
            <div className="text-center"><Bat style={{ width: 54 }} /><p className="font-bangers text-sm text-red-500">¡NO!</p></div>
          </div>
          {best > 0 && <p className="font-fredoka text-sm text-gray-500 mb-3">Tu mejor puntaje: <strong>{best}</strong></p>}
          <div className="flex justify-center">
            <GameRulesButton
              title="Atrapá la Calabaza"
              accentColor="#f97316"
              rules={[
                "Caen calabazas, fantasmas y murciélagos. Tocá las calabazas para atraparlas.",
                "Una calabaza común vale 1 punto. La calabaza dorada, que aparece pocas veces, vale 5.",
                "Si tocás un fantasma o un murciélago perdés una vida. Tenés 3 vidas.",
                "Cuidado: desde el nivel 2 caen calabazas verdes (malditas). ¡Esas también te sacan una vida!",
                "Si atrapás 5 calabazas seguidas, ¡combo x2! El combo se corta si tocás algo malo o se te escapa una calabaza.",
                "Cada 8 puntos subís de nivel y todo cae más rápido. Desde el nivel 3 las calabazas se mueven en zigzag y desde el 4 los fantasmas titilan y caen ráfagas.",
                "El juego termina cuando perdés las 3 vidas.",
              ]}
            />
          </div>
          <button onClick={start} className="btn-cv-primary w-full justify-center" style={{ background: "#f97316", color: "#1a1a1a" }}>
            🎃 ¡Jugar!
          </button>
        </motion.div>
      )}

      {phase !== "intro" && createPortal(
        <div
          ref={shell}
          className="fixed inset-0 flex flex-col"
          style={{
            zIndex: 100,
            height: "100dvh",
            background: "#0f0420",
            padding: "max(10px, env(safe-area-inset-top)) max(10px, env(safe-area-inset-right)) max(10px, env(safe-area-inset-bottom)) max(10px, env(safe-area-inset-left))",
            touchAction: "none",
            overscrollBehavior: "none",
          }}
        >
          <div className="w-full max-w-lg mx-auto flex flex-col flex-1 min-h-0">
          <div className="flex items-center justify-between gap-2 mb-2 font-bangers text-lg tracking-wide">
            <button onClick={exitGame} aria-label="Salir del juego" className="badge-cv" style={{ ...HUD_BADGE, touchAction: "manipulation" }}>✕</button>
            <span className="badge-cv" style={HUD_BADGE}>🎃 {hud.score}</span>
            <span className="badge-cv" style={HUD_BADGE}>Nivel {hud.level}{hud.combo >= 5 ? " · 🔥 x2" : hud.combo > 0 ? ` · ${hud.combo}/5` : ""}</span>
            <span className="badge-cv" style={HUD_BADGE}>{"❤️".repeat(Math.max(0, hud.lives)) || "💀"}</span>
          </div>

          <div
            ref={area}
            className="relative overflow-hidden rounded-3xl select-none"
            style={{
              flex: 1,
              minHeight: 0,
              background: "#1a0a2e",
              border: "4px solid #1a1a1a",
              boxShadow: hurt ? "6px 6px 0 #ef4444" : "6px 6px 0 #f97316",
              touchAction: "none",
            }}
          >
            <Moon className="absolute" style={{ right: "8%", top: "5%", width: 70, opacity: 0.9 }} />
            <div className="absolute inset-x-0 bottom-0 h-10" style={{ background: "#12051f", borderTop: "3px solid #f97316" }} />

            {phase === "playing" && s.items.map((i) => (
              <button
                key={i.id}
                onPointerDown={(e) => hit(i, e)}
                aria-label={i.type === "pumpkin" || i.type === "golden" ? "Calabaza" : "Peligro"}
                className="absolute"
                style={{
                  left: `${i.x}%`,
                  top: 0,
                  transform: `translate(-50%, ${i.y}px) rotate(${Math.sin(i.y / 60 + i.phase) * 12}deg)`,
                  opacity: i.type === "ghost" && s.level >= 4 ? 0.2 + 0.8 * Math.abs(Math.sin(s.t * 3 + i.phase)) : 1,
                  background: "transparent",
                  border: 0,
                  padding: 14,
                  cursor: "pointer",
                  touchAction: "none",
                }}
              >
                <ItemArt type={i.type} />
              </button>
            ))}

            {s.pops.map((p) => (
              <span
                key={`pop-${p.id}`}
                className="absolute font-bangers text-2xl pointer-events-none"
                style={{ left: `${p.x}%`, top: 0, transform: `translate(-50%, ${p.y - 24 - (p.until - s.t) * 0}px)`, color: p.color, textShadow: "2px 2px 0 #1a1a1a" }}
              >
                {p.text}
              </span>
            ))}

            {banner && phase === "playing" && (
              <div className="absolute inset-x-0 top-1/3 text-center font-bangers text-4xl pointer-events-none" style={{ color: "#fde047", textShadow: "3px 3px 0 #1a1a1a" }}>
                {banner}
              </div>
            )}

            {phase === "over" && (
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
                style={{ background: "rgba(26,10,46,0.88)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-6xl mb-2">👻</div>
                <h3 className="font-bangers text-white text-3xl tracking-wider mb-1" style={{ textShadow: "3px 3px 0 #f97316" }}>
                  ¡Se acabó la noche!
                </h3>
                <p className="font-fredoka text-violet-100 mb-1">Atrapaste <strong>{hud.score}</strong> puntos · Nivel {hud.level}</p>
                <p className="font-fredoka text-violet-200 text-sm mb-4">
                  {hud.score >= best && hud.score > 0 ? "¡Nuevo récord! 🏆" : `Tu mejor puntaje: ${best}`}
                </p>
                <button onClick={start} className="btn-cv-primary" style={{ background: "#f97316", color: "#1a1a1a" }}>
                  ¡Jugar de nuevo!
                </button>
                <button onClick={exitGame} className="btn-cv-secondary mt-3 text-sm">← Volver</button>
              </motion.div>
            )}
          </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
