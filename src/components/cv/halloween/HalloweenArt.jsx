/**
 * Dibujos Halloween del Club (SVG).
 * Estilo sticker de la marca: contorno grueso #1a1a1a, borde blanco de sticker,
 * luces duras (sin degradés), colores planos.
 */

const K = "#1a1a1a"; // contorno
const W = "#f5f3ff"; // borde sticker
const VIOLET_D = "#24093f";
const VIOLET = "#3b1670";
const VIOLET_L = "#6d28d9";
const ORANGE = "#f97316";
const YELLOW = "#facc15";

/* Pinta las formas dos veces: primero el borde blanco de sticker, después el dibujo */
function Sticker({ children }) {
  return (
    <>
      <g strokeLinejoin="round" strokeLinecap="round">{children(true)}</g>
      <g strokeLinejoin="round" strokeLinecap="round">{children(false)}</g>
    </>
  );
}
const sh = (o, fill, sw = 3) => ({
  fill: o ? W : fill,
  stroke: o ? W : K,
  strokeWidth: o ? sw + 6 : sw,
});

/* ---------------- Murciélago ---------------- */
export function Bat({ className = "", style }) {
  const wing = (o) => (
    <>
      <path
        d="M55 30 C42 12 20 10 4 20 C11 25 11 33 8 43 C16 38 23 41 27 49 C32 41 40 43 46 51 C49 43 52 39 55 37 Z"
        {...sh(o, VIOLET)}
      />
      {!o && (
        <g stroke={VIOLET_L} strokeWidth="2.2" fill="none" strokeLinecap="round">
          <path d="M53 31 L16 24" />
          <path d="M53 34 L24 40" />
          <path d="M53 36 L38 44" />
        </g>
      )}
    </>
  );
  return (
    <svg viewBox="0 0 120 70" className={className} style={style} aria-hidden="true">
      <Sticker>
        {(o) => (
          <>
            <g className="hw-wing-l" style={{ transformOrigin: "55px 32px", transformBox: "view-box" }}>
              {wing(o)}
            </g>
            <g className="hw-wing-r" style={{ transformOrigin: "65px 32px", transformBox: "view-box" }}>
              <g transform="translate(120,0) scale(-1,1)">{wing(o)}</g>
            </g>
            <path d="M52 20 L54 7 L59 17 M68 20 L66 7 L61 17" {...sh(o, VIOLET_D)} />
            <ellipse cx="60" cy="40" rx="9" ry="14" {...sh(o, VIOLET_D)} />
            <circle cx="60" cy="25" r="10" {...sh(o, VIOLET_D)} />
            {!o && (
              <>
                <circle cx="56" cy="24" r="2.6" fill={YELLOW} stroke={K} strokeWidth="1" />
                <circle cx="64" cy="24" r="2.6" fill={YELLOW} stroke={K} strokeWidth="1" />
                <path d="M57 30 L58.5 34 L60 30 M60 30 L61.5 34 L63 30" fill="#fff" stroke={K} strokeWidth="1.2" />
              </>
            )}
          </>
        )}
      </Sticker>
    </svg>
  );
}

/* ---------------- Gato negro sentado ---------------- */
export function Cat({ className = "", style }) {
  return (
    <svg viewBox="0 0 110 134" className={className} style={style} aria-hidden="true">
      <Sticker>
        {(o) => (
          <>
            {/* cola */}
            <g className="hw-tail" style={{ transformOrigin: "76px 120px", transformBox: "view-box" }}>
              <path
                d="M76 121 C104 121 108 92 95 74"
                fill="none"
                stroke={o ? W : K}
                strokeWidth={o ? 19 : 13}
              />
              {!o && <path d="M76 121 C104 121 108 92 95 74" fill="none" stroke={VIOLET_D} strokeWidth="7" />}
            </g>
            {/* cuerpo */}
            <path
              d="M30 130 C13 128 11 101 24 82 C28 72 34 64 40 58 L62 58 C68 64 74 72 78 82 C91 101 89 128 72 130 Z"
              {...sh(o, VIOLET_D)}
            />
            {/* orejas */}
            <path d="M28 36 L25 8 L45 24 Z" {...sh(o, VIOLET_D)} />
            <path d="M76 36 L79 8 L59 24 Z" {...sh(o, VIOLET_D)} />
            {/* cabeza */}
            <ellipse cx="52" cy="44" rx="26" ry="21" {...sh(o, VIOLET_D)} />
            {!o && (
              <>
                {/* luz dura */}
                <path d="M30 40 C32 30 40 25 48 24" fill="none" stroke={VIOLET_L} strokeWidth="3" />
                <path d="M36 78 C32 88 32 104 36 118" fill="none" stroke={VIOLET_L} strokeWidth="3" />
                {/* orejas interiores */}
                <path d="M31 30 L29 16 L39 25 Z" fill="#7e22ce" />
                <path d="M73 30 L75 16 L65 25 Z" fill="#7e22ce" />
                {/* ojos */}
                <g className="hw-blink" style={{ transformOrigin: "52px 44px", transformBox: "view-box" }}>
                  <ellipse cx="41" cy="44" rx="7" ry="8" fill={YELLOW} stroke={K} strokeWidth="2" />
                  <ellipse cx="63" cy="44" rx="7" ry="8" fill={YELLOW} stroke={K} strokeWidth="2" />
                  <ellipse cx="41" cy="44" rx="1.8" ry="6" fill={K} />
                  <ellipse cx="63" cy="44" rx="1.8" ry="6" fill={K} />
                  <circle cx="43.5" cy="40" r="1.6" fill="#fff" />
                  <circle cx="65.5" cy="40" r="1.6" fill="#fff" />
                </g>
                {/* nariz y boca */}
                <path d="M49 54 L55 54 L52 58 Z" fill={ORANGE} stroke={K} strokeWidth="1.5" />
                <path d="M52 58 C52 62 47 63 45 61 M52 58 C52 62 57 63 59 61" fill="none" stroke="#fff" strokeWidth="1.8" />
                {/* bigotes */}
                <g stroke="#fff" strokeWidth="1.4" strokeLinecap="round">
                  <path d="M34 55 L16 52 M34 58 L17 62" />
                  <path d="M70 55 L88 52 M70 58 L87 62" />
                </g>
                {/* patitas */}
                <path d="M42 130 V116 M62 130 V116" stroke={VIOLET_L} strokeWidth="2.5" fill="none" />
              </>
            )}
          </>
        )}
      </Sticker>
    </svg>
  );
}

/* ---------------- Araña (cuelga de un hilo) ---------------- */
export function Spider({ className = "", style }) {
  const legs = [
    "M26 30 L9 16 L2 30",
    "M25 35 L5 33 L1 47",
    "M25 40 L7 50 L5 62",
    "M27 45 L14 58 L16 62",
  ];
  return (
    <svg viewBox="0 0 64 66" className={className} style={style} aria-hidden="true">
      <Sticker>
        {(o) => (
          <>
            {legs.map((d, i) => (
              <g key={i}>
                <path d={d} fill="none" stroke={o ? W : K} strokeWidth={o ? 9 : 3.2} />
                <path d={d} fill="none" stroke={o ? W : K} strokeWidth={o ? 9 : 3.2} transform="translate(64,0) scale(-1,1)" />
              </g>
            ))}
            <ellipse cx="32" cy="42" rx="14" ry="16" {...sh(o, VIOLET_D)} />
            <ellipse cx="32" cy="22" rx="9" ry="8" {...sh(o, VIOLET_D)} />
            {!o && (
              <>
                <path d="M26 36 H38 L32 42 L38 48 H26 L32 42 Z" fill={ORANGE} stroke={K} strokeWidth="1.2" />
                <path d="M22 38 C21 46 24 54 27 56" fill="none" stroke={VIOLET_L} strokeWidth="2.4" />
                <circle cx="28.5" cy="21" r="3" fill="#fff" stroke={K} strokeWidth="1.2" />
                <circle cx="35.5" cy="21" r="3" fill="#fff" stroke={K} strokeWidth="1.2" />
                <circle cx="29" cy="21.5" r="1.2" fill={K} />
                <circle cx="35" cy="21.5" r="1.2" fill={K} />
              </>
            )}
          </>
        )}
      </Sticker>
    </svg>
  );
}

/* ---------------- Telaraña de rincón (nace en la esquina sup-izq) ---------------- */
const WEB_ANGLES = [0, 22.5, 45, 67.5, 90].map((a) => (a * Math.PI) / 180);
const WEB_RINGS = [26, 50, 76, 104];
const webPt = (r, a) => [r * Math.cos(a), r * Math.sin(a)];
const WEB_RADIALS = WEB_ANGLES.map((a) => {
  const [x, y] = webPt(118, a);
  return `M0 0 L${x.toFixed(1)} ${y.toFixed(1)}`;
}).join(" ");
const WEB_ARCS = WEB_RINGS.map((r) => {
  let d = "";
  for (let i = 0; i < WEB_ANGLES.length - 1; i++) {
    const [x1, y1] = webPt(r, WEB_ANGLES[i]);
    const [x2, y2] = webPt(r, WEB_ANGLES[i + 1]);
    const [mx, my] = webPt(r * 0.8, (WEB_ANGLES[i] + WEB_ANGLES[i + 1]) / 2);
    d += (i === 0 ? `M${x1.toFixed(1)} ${y1.toFixed(1)}` : "") + ` Q${mx.toFixed(1)} ${my.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }
  return d;
});
const WEB_PATH = `${WEB_RADIALS} ${WEB_ARCS.join(" ")}`;

export function Web({ className = "", style, flip = false }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      style={{ ...style, transform: flip ? "scaleX(-1)" : undefined }}
      aria-hidden="true"
    >
      <path d={WEB_PATH} fill="none" stroke={K} strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d={WEB_PATH} fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------------- Luna ---------------- */
export function Moon({ className = "", style }) {
  return (
    <svg viewBox="0 0 110 110" className={className} style={style} aria-hidden="true">
      <Sticker>
        {(o) => (
          <>
            <circle cx="55" cy="55" r="44" {...sh(o, "#fde68a", 4)} />
            {!o && (
              <>
                <path d="M85 80 C70 96 42 98 26 82 C46 90 72 84 85 80 Z" fill="#fbbf24" />
                <path d="M22 44 C26 28 40 17 55 14 C42 22 30 30 22 44 Z" fill="#fffbeb" />
                <circle cx="70" cy="36" r="7" fill="#fcd34d" stroke={K} strokeWidth="2" />
                <circle cx="44" cy="60" r="9" fill="#fcd34d" stroke={K} strokeWidth="2" />
                <circle cx="72" cy="66" r="4.5" fill="#fcd34d" stroke={K} strokeWidth="2" />
              </>
            )}
          </>
        )}
      </Sticker>
    </svg>
  );
}

/* ---------------- Fantasmita ---------------- */
export function Ghost({ className = "", style }) {
  return (
    <svg viewBox="0 0 76 96" className={className} style={style} aria-hidden="true">
      <Sticker>
        {(o) => (
          <>
            <path
              d="M8 84 V38 C8 16 22 5 38 5 C54 5 68 16 68 38 V84 L58 75 L48 86 L38 75 L28 86 L18 75 Z"
              {...sh(o, "#f5f3ff")}
            />
            {!o && (
              <>
                <path d="M60 28 C64 40 64 58 62 74 L68 80 V38 C68 30 65 25 60 20 Z" fill="#ddd6fe" />
                <ellipse cx="28" cy="38" rx="5" ry="7" fill={K} />
                <ellipse cx="48" cy="38" rx="5" ry="7" fill={K} />
                <circle cx="29.6" cy="35" r="1.6" fill="#fff" />
                <circle cx="49.6" cy="35" r="1.6" fill="#fff" />
                <ellipse cx="38" cy="54" rx="6" ry="8" fill={K} />
                <ellipse cx="18" cy="50" rx="4.5" ry="3" fill="#fdba74" />
                <ellipse cx="58" cy="50" rx="4.5" ry="3" fill="#fdba74" />
              </>
            )}
          </>
        )}
      </Sticker>
    </svg>
  );
}

/* ---------------- Calabaza con cara ---------------- */
export function Pumpkin({ className = "", style }) {
  return (
    <svg viewBox="0 0 110 96" className={className} style={style} aria-hidden="true">
      <Sticker>
        {(o) => (
          <>
            <path d="M52 22 C50 12 54 6 62 4 C60 10 60 16 60 22 Z" {...sh(o, "#22c55e")} />
            <ellipse cx="30" cy="58" rx="24" ry="30" {...sh(o, ORANGE)} />
            <ellipse cx="80" cy="58" rx="24" ry="30" {...sh(o, ORANGE)} />
            <ellipse cx="55" cy="58" rx="27" ry="33" {...sh(o, ORANGE)} />
            {!o && (
              <>
                <path d="M78 36 C92 44 96 66 84 84 C98 76 104 56 94 42 Z" fill="#c2410c" />
                <path d="M20 40 C26 32 34 30 40 32 C32 36 26 42 22 52 Z" fill="#fdba74" />
                <path d="M36 50 L46 50 L41 40 Z" fill={YELLOW} stroke={K} strokeWidth="2.5" strokeLinejoin="round" />
                <path d="M64 50 L74 50 L69 40 Z" fill={YELLOW} stroke={K} strokeWidth="2.5" strokeLinejoin="round" />
                <path
                  d="M32 66 L40 62 L46 70 L52 62 L58 70 L64 62 L72 66 C70 80 62 86 52 86 C42 86 34 80 32 66 Z"
                  fill={YELLOW}
                  stroke={K}
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                <path d="M46 70 V76 M58 70 V76" stroke={K} strokeWidth="2" />
              </>
            )}
          </>
        )}
      </Sticker>
    </svg>
  );
}

/* ---------------- Sombrero de bruja (para disfraces) ---------------- */
export function WitchHat({ className = "", style }) {
  return (
    <svg viewBox="0 0 110 100" className={className} style={style} aria-hidden="true">
      <Sticker>
        {(o) => (
          <>
            <path d="M26 80 C36 60 42 32 66 6 C62 22 68 32 74 46 C78 58 82 70 82 80 Z" {...sh(o, "#4c1d95")} />
            <ellipse cx="54" cy="82" rx="49" ry="12" {...sh(o, "#2e1065")} />
            {!o && (
              <>
                <path d="M30 70 C48 76 66 76 79 69 L82 80 C66 86 44 86 26 80 Z" fill={ORANGE} stroke={K} strokeWidth="2.5" strokeLinejoin="round" />
                <rect x="49" y="70" width="14" height="14" rx="2" fill={YELLOW} stroke={K} strokeWidth="2.5" />
                <rect x="53" y="74" width="6" height="6" fill="#4c1d95" />
                <path d="M44 56 C48 46 52 38 58 28" fill="none" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" />
              </>
            )}
          </>
        )}
      </Sticker>
    </svg>
  );
}

/* ---------------- Guirnalda de banderines (franja horizontal) ---------------- */
const G_W = 240;
const G_COLORS = [ORANGE, "#7e22ce", "#22c55e", ORANGE, "#7e22ce", "#facc15"];
const quad = (t) => {
  const x = t * G_W;
  const y = 3 + 92 * t * (1 - t); // misma curva que la cuerda (Q con control en y=49)
  return [x, y];
};
const G_FLAGS = G_COLORS.map((c, i) => {
  const [x, y] = quad((i + 0.5) / G_COLORS.length);
  return { c, x, y };
});

export function Garland({ className = "", style }) {
  return (
    <svg className={className} style={style} width="100%" height="56" aria-hidden="true">
      <defs>
        <pattern id="hw-garland" width={G_W} height="56" patternUnits="userSpaceOnUse">
          <path d={`M0 3 Q${G_W / 2} 49 ${G_W} 3`} fill="none" stroke={K} strokeWidth="2.5" />
          {G_FLAGS.map((f, i) => (
            <path
              key={i}
              d={`M${f.x - 13} ${f.y - 1} L${f.x + 13} ${f.y - 1} L${f.x} ${f.y + 24} Z`}
              fill={f.c}
              stroke={K}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="56" fill="url(#hw-garland)" />
    </svg>
  );
}

/* ---------------- Colinas del fondo (silueta, 2 planos) ---------------- */
export function Hills({ className = "", style }) {
  return (
    <svg
      viewBox="0 0 800 200"
      preserveAspectRatio="xMidYMax slice"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* plano lejano */}
      <path d="M0 120 C90 80 170 90 260 118 C350 146 430 70 530 80 C630 90 700 130 800 100 V200 H0 Z" fill="#2b0f52" />
      {/* plano cercano */}
      <path d="M0 160 C110 128 220 150 330 154 C450 158 560 126 680 140 C740 147 780 156 800 152 V200 H0 Z" fill="#12051f" />
      <path d="M0 160 C110 128 220 150 330 154 C450 158 560 126 680 140 C740 147 780 156 800 152" fill="none" stroke={ORANGE} strokeWidth="3" />
      {/* árboles secos */}
      <g stroke="#12051f" strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M70 160 V104 M70 126 L52 110 M70 116 L88 98 M52 110 L44 100 M88 98 L96 90" />
        <path d="M730 142 V90 M730 112 L714 98 M730 104 L748 84 M748 84 L756 76" />
      </g>
      {/* mini calabazas */}
      <g>
        <ellipse cx="196" cy="156" rx="13" ry="10" fill={ORANGE} stroke={K} strokeWidth="2.5" />
        <path d="M196 146 V140" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
        <path d="M190 154 L194 152 L193 157 Z M199 152 L203 154 L199 157 Z" fill={YELLOW} />
        <ellipse cx="610" cy="146" rx="11" ry="8.5" fill={ORANGE} stroke={K} strokeWidth="2.5" />
        <path d="M610 138 V133" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
        <path d="M605 145 L608 143 L608 148 Z M612 143 L616 145 L612 148 Z" fill={YELLOW} />
      </g>
    </svg>
  );
}

/* ---------------- Rayo (silueta tenue para el destello) ---------------- */
export function Bolt({ className = "", style }) {
  return (
    <svg viewBox="0 0 60 160" className={className} style={style} aria-hidden="true">
      <path d="M38 0 L10 78 H28 L16 160 L52 62 H32 Z" fill="#fef9c3" stroke="#fde047" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------------- Estrellita de 4 puntas ---------------- */
export function Sparkle({ className = "", style }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden="true">
      <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z" fill="#fde68a" />
    </svg>
  );
}
