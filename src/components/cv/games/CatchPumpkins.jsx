import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import GameRulesButton from "./GameRulesButton";
import { Bat, Ghost, Moon, Pumpkin } from "../halloween/HalloweenArt";

/**
 * ATRAPÁ LA CALABAZA (juego especial de Halloween)
 * Caen calabazas, fantasmas y murciélagos. Tocá las calabazas y esquivá lo demás.
 * 3 vidas. Cada 10 puntos sube el nivel (más rápido y más seguido).
 */

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

function pickType() {
  const r = Math.random();
  if (r < 0.06) return "golden";
  if (r < 0.64) return "pumpkin";
  if (r < 0.86) return "ghost";
  return "bat";
}

function ItemArt({ type }) {
  if (type === "ghost") return <Ghost style={{ width: SIZES.ghost, height: "auto" }} />;
  if (type === "bat") return <Bat style={{ width: SIZES.bat, height: "auto" }} />;
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
  const [hud, setHud] = useState({ score: 0, lives: 3, level: 1 });
  const [best, setBest] = useState(readBest);
  const [hurt, setHurt] = useState(false);
  const area = useRef(null);
  const g = useRef({ items: [], pops: [], score: 0, lives: 3, level: 1, spawn: 0, id: 1, t: 0 });
  const raf = useRef(0);

  const start = () => {
    g.current = { items: [], pops: [], score: 0, lives: 3, level: 1, spawn: 0.4, id: 1, t: 0 };
    setHud({ score: 0, lives: 3, level: 1 });
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
    const gain = item.type === "golden" ? 5 : item.type === "pumpkin" ? 1 : 0;
    if (gain) {
      s.score += gain;
      s.level = 1 + Math.floor(s.score / 10);
      s.pops.push({ id: item.id, x: item.x, y: item.y, text: `+${gain}`, color: "#fde047", until: s.t + 0.6 });
    } else {
      s.lives -= 1;
      s.pops.push({ id: item.id, x: item.x, y: item.y, text: "¡Uy!", color: "#f87171", until: s.t + 0.7 });
      setHurt(true);
      setTimeout(() => setHurt(false), 250);
    }
    setHud({ score: s.score, lives: s.lives, level: s.level });
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
        const type = pickType();
        s.items.push({
          id: s.id++,
          type,
          x: 6 + Math.random() * 82,
          x0: 6 + Math.random() * 82,
          y: -90,
          vy: (120 + s.level * 20 + Math.random() * 50) * calm * (type === "bat" ? 1.15 : 1),
          phase: Math.random() * 6,
        });
        s.spawn = Math.max(0.32, 1.05 - s.level * 0.07) + Math.random() * 0.25;
      }
      s.items.forEach((i) => {
        i.y += i.vy * dt;
        if (i.type === "bat") i.x = Math.min(90, Math.max(4, i.x0 + Math.sin(s.t * 2.6 + i.phase) * 9));
      });
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
                "Si una calabaza se te escapa no pasa nada, ¡pero es un punto que no sumás!",
                "Cada 10 puntos subís de nivel y todo cae más rápido. El juego termina cuando perdés las 3 vidas.",
              ]}
            />
          </div>
          <button onClick={start} className="btn-cv-primary w-full justify-center" style={{ background: "#f97316", color: "#1a1a1a" }}>
            🎃 ¡Jugar!
          </button>
        </motion.div>
      )}

      {phase !== "intro" && (
        <>
          <div className="flex items-center justify-between mb-2 font-bangers text-lg tracking-wide">
            <span className="badge-cv">🎃 {hud.score}</span>
            <span className="badge-cv">Nivel {hud.level}</span>
            <span className="badge-cv">{"❤️".repeat(Math.max(0, hud.lives)) || "💀"}</span>
          </div>

          <div
            ref={area}
            className="relative overflow-hidden rounded-3xl select-none"
            style={{
              height: "min(70vh, 520px)",
              background: "#1a0a2e",
              border: "4px solid #1a1a1a",
              boxShadow: hurt ? "6px 6px 0 #ef4444" : "6px 6px 0 #f97316",
              touchAction: "manipulation",
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
                  background: "transparent",
                  border: 0,
                  padding: 14,
                  cursor: "pointer",
                  touchAction: "manipulation",
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
              </motion.div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
