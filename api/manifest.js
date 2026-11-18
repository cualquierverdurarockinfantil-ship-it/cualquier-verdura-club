// Manifest de la app instalada (PWA) según el tema vigente HOY (hora de Argentina).
// Así el ícono y la pantalla de arranque de quienes instalaron la app siguen al tema:
// Halloween 19/10 al 5/11, Fiestas 8/12 al 10/1, y el resto del año el tomate original.
// Se sirve desde /manifest.webmanifest y /manifest-halloween.webmanifest (ver vercel.json),
// porque las apps instaladas durante Halloween quedaron apuntando a esa dirección.

const THEMES = [
  { from: "2026-10-19", to: "2026-11-06", prefix: "hw", bg: "#1a0a2e", theme: "#f97316" },
  { from: "2026-12-08", to: "2027-01-11", prefix: "fi", bg: "#ffffff", theme: "#16a34a" },
];

function todayAR() {
  // Argentina es UTC-3 todo el año
  const d = new Date(Date.now() - 3 * 3600 * 1000);
  return d.toISOString().slice(0, 10);
}

export default function handler(req, res) {
  const t = todayAR();
  const th = THEMES.find((x) => t >= x.from && t < x.to) || { prefix: "cv", bg: "#ffffff", theme: "#22c55e" };
  const manifest = {
    name: "Club Verdura",
    short_name: "Club Verdura",
    description: "El lugar secreto de Cualquier Verdura Rock Infantil",
    start_url: "/",
    display: "standalone",
    background_color: th.bg,
    theme_color: th.theme,
    icons: [
      { src: `/icons/${th.prefix}-192.png`, sizes: "192x192", type: "image/png", purpose: "any" },
      { src: `/icons/${th.prefix}-512.png`, sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
  res.setHeader("Content-Type", "application/manifest+json; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=3600, must-revalidate");
  res.status(200).send(JSON.stringify(manifest));
}
