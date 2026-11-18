/**
 * Dibujos del tema Fiestas (SVG). Mismo estilo sticker de la marca:
 * contorno grueso #1a1a1a, colores planos. Nada de nieve: luces de colores y pinos.
 */
const K = "#1a1a1a";
export const BULB_COLORS = ["#ef4444", "#facc15", "#22c55e", "#38bdf8", "#f472b6", "#fb923c"];

/** Un tramo de guirnalda (cable que cuelga + 4 lamparitas). Se repite a lo ancho. */
export function GarlandTile({ offset = 0, className = "", style }) {
  const xs = [22, 62, 102, 142];
  return (
    <svg viewBox="0 0 160 54" className={className} style={style} aria-hidden="true">
      <path d="M0 8 C40 40 80 40 80 8 C80 40 120 40 160 8" fill="none" stroke={K} strokeWidth="2.6" strokeLinecap="round" />
      {xs.map((x, i) => {
        const y = 8 + 27 * (1 - Math.pow((((x % 80) - 40) / 40), 2)) * 0.74 + 1;
        const c = BULB_COLORS[(i + offset) % BULB_COLORS.length];
        return (
          <g key={x} className={`fi-bulb fi-bulb-${(i + offset) % 4}`}>
            <ellipse cx={x} cy={y + 12} rx="12" ry="14" fill={c} opacity=".3" />
            <path d={`M${x - 3} ${y} h6 l-1 6 h-4 z`} fill={K} />
            <ellipse cx={x} cy={y + 12} rx="6" ry="8" fill={c} stroke={K} strokeWidth="2.2" />
            <ellipse cx={x - 2} cy={y + 9} rx="1.7" ry="2.6" fill="#fff" opacity=".8" />
          </g>
        );
      })}
    </svg>
  );
}

/** Pinito decorativo con luces (se sienta sobre el footer) */
export function Pino({ className = "", style }) {
  const dots = [
    [48, 38, "#ef4444"], [66, 44, "#facc15"], [38, 70, "#38bdf8"], [58, 78, "#f472b6"],
    [78, 88, "#ef4444"], [30, 106, "#facc15"], [62, 112, "#22c55e"], [90, 118, "#38bdf8"],
    [44, 128, "#fb923c"],
  ];
  return (
    <svg viewBox="0 0 120 160" className={className} style={style} aria-hidden="true">
      <g stroke={K} strokeWidth="3.4" strokeLinejoin="round" strokeLinecap="round">
        <rect x="50" y="132" width="20" height="22" rx="3" fill="#92400e" />
        <path d="M60 52 L100 110 L88 106 L112 138 L8 138 L32 106 L20 110 Z" fill="#15803d" />
        <path d="M60 26 L92 70 L80 68 L100 96 L20 96 L40 68 L28 70 Z" fill="#16a34a" />
        <path d="M60 4 L84 38 L72 36 L88 58 L32 58 L48 36 L36 38 Z" fill="#22c55e" />
        <path d="M60 -2 l4 9 10 1 -8 6 3 10 -9 -6 -9 6 3 -10 -8 -6 10 -1z" transform="translate(0,2)" fill="#facc15" />
      </g>
      {dots.map(([x, y, c], i) => (
        <g key={i} className={`fi-bulb fi-bulb-${i % 4}`}>
          <circle cx={x} cy={y} r="9" fill={c} opacity=".3" />
          <circle cx={x} cy={y} r="4.6" fill={c} stroke={K} strokeWidth="2" />
        </g>
      ))}
    </svg>
  );
}
