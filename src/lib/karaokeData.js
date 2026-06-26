// ============================================
// CLUB VERDURA — KARAOKE DATA
// Estructura por secciones.
//
// Cada canción tiene un array de `sections`.
// Cada sección tiene:
//   intro: { title, message, emoji, start, end }  ← bloque que se muestra antes de la letra
//   lines: [{ text, start, end }]                 ← letra de esa sección
//
// La intro de la primera sección es el INTRO de la canción.
// Si una sección no tiene intro (ej: arranca directo), omitir el campo intro.
//
// El mensaje final de la canción va en `finishMessage`.
// Se muestra cuando termina la última línea de letra.
// ============================================

export const KARAOKE_SONGS = [
  {
    id: "un-buen-plan",
    title: "Un Buen Plan",
    artist: "Cualquier Verdura",
    duration: "2:44",
    durationSecs: 164,
    cover: "/assets/karaoke/cover-un-buen-plan.jpg",
    audioOriginal: "/assets/karaoke/un-buen-plan-original.wav",
    audioInstrumental: "/assets/karaoke/un-buen-plan-instrumental.mp3",
    videoUrl: "https://youtu.be/_CIjJpfptaA",
    character: "tomate",
    difficulty: "fácil",
    finishMessage: "¡¡Llegaste al final, muy bien!!",

    sections: [
      // ── Sección 1: Estrofa 1 + Estribillo 1 ──────────────────────────
      {
        intro: {
          title: "RIFF",
          message: "¡¡Anda preparandote!!",
          emoji: "🎸",
          start: 0,
          end: 14,
        },
        lines: [
          { text: "Yo te estaré esperando", start: 14, end: 17 },
          { text: "que me pases a buscar", start: 17, end: 20 },
          { text: "a que vengas a mi casa", start: 20, end: 23 },
          { text: "y me lleves a pasear", start: 23, end: 26.5 },
          { text: "Dar una vuelta por la plaza", start: 26.5, end: 30 },
          { text: "no estaría mal", start: 30, end: 32 },
          { text: "ir a probar gustos de helado", start: 32, end: 35 },
          { text: "ese es un buen plan", start: 35, end: 38 },
          { text: "ES UN BUEN PLAN", start: 38, end: 41 },
          { text: "UN BUEN PLAN", start: 41, end: 44 },
          { text: "SALIR A JUGAR", start: 44, end: 47 },
          { text: "SIEMPRE ES UN BUEN PLAN", start: 47, end: 50 },
        ],
      },

      // ── Sección 2: Estrofa 2 + Estribillo 2 ──────────────────────────
      {
        intro: {
          title: "RIFF LEGENDARIO",
          message: "¡¡Relaja y baila un poco!!",
          emoji: "🎸",
          start: 50,
          end: 62,
        },
        lines: [
          { text: "Mirá que lindo que está el día", start: 62, end: 65.5 },
          { text: "para ir a jugar", start: 65.5, end: 68 },
          { text: "o patear una pelota", start: 68, end: 71 },
          { text: "ese es un buen plan", start: 71, end: 74 },
          { text: "Hacer castillos con arena", start: 74, end: 77.5 },
          { text: "o ropa para mis muñecas", start: 77.5, end: 81 },
          { text: "un pastel de barro", start: 81, end: 84 },
          { text: "un barquito de papel", start: 84, end: 87 },
          { text: "ES UN BUEN PLAN", start: 87, end: 90 },
          { text: "UN BUEN PLAN", start: 90, end: 93 },
          { text: "SALIR A JUGAR", start: 93, end: 96 },
          { text: "SIEMPRE ES UN BUEN PLAN", start: 96, end: 99 },
          { text: "ES UN BUEN PLAN", start: 99, end: 101.5 },
          { text: "UN BUEN PLAN", start: 101.5, end: 104 },
          { text: "SALIR A JUGAR", start: 104, end: 107 },
          { text: "SIEMPRE ES UN BUEN PLAN", start: 107, end: 110 },
        ],
      },

      // ── Sección 3: Estribillo final ───────────────────────────────────
      {
        intro: {
          title: "SOLO DE GUITARRA",
          message: "¡¡Momento de bailar!!",
          emoji: "🎸",
          start: 110,
          end: 135,
        },
        lines: [
          { text: "ES UN BUEN PLAN", start: 135, end: 137.5 },
          { text: "UN BUEN PLAN", start: 137.5, end: 140 },
          { text: "SALIR A JUGAR", start: 140, end: 143 },
          { text: "SIEMPRE ES UN BUEN PLAN", start: 143, end: 146 },
          { text: "ES UN BUEN PLAN", start: 146, end: 148.5 },
          { text: "UN BUEN PLAN", start: 148.5, end: 151 },
          { text: "SALIR A JUGAR", start: 151, end: 155 },
        ],
      },
    ],
  },

  // ── La Gran Manada ────────────────────────────────────────────────────────
  {
    id: "la-gran-manada",
    title: "La Gran Manada",
    artist: "Cualquier Verdura",
    duration: "3:43",
    durationSecs: 223,
    cover: "/assets/karaoke/cover-gran-manada.png",
    audioOriginal: "/assets/karaoke/la-gran-manada-original.mp3",
    audioInstrumental: "/assets/karaoke/la-gran-manada-instrumental.mp3",
    videoUrl: "https://youtu.be/ijV2LFd25qw",
    character: "tomate",
    difficulty: "medio",
    finishMessage: "¡¡Muy bien, la rompiste!!",

    sections: [
      // ── Sección 1 ─────────────────────────────────────────────────────
      {
        intro: { title: "INTRO", message: "¡¡A prepararse!!", emoji: "🎸", start: 0, end: 24 },
        lines: [
          { text: "Esta es la historia de un león", start: 24, end: 27 },
          { text: "que a todos molestaba", start: 27, end: 30 },
          { text: "nadie quería cruzarse con el", start: 30, end: 33 },
          { text: "que ni se les acercara", start: 33, end: 36 },
          { text: "Hacía bromas en cada ocasión", start: 36, end: 39 },
          { text: "y 2x3 se peleaba", start: 39, end: 42 },
          { text: "si era un oso o era un ratón", start: 42, end: 45 },
          { text: "nadie de él se salvaba", start: 45, end: 48 },
        ],
      },
      // ── Sección 2 ─────────────────────────────────────────────────────
      {
        intro: { title: "PUENTE", message: "Toma aire", emoji: "🌬️", start: 48, end: 54 },
        lines: [
          { text: "Los animales de la región", start: 54, end: 57 },
          { text: "ya no lo soportaban", start: 57, end: 60 },
          { text: "enfrentaron la situación", start: 60, end: 63 },
          { text: "todos juntos en manada", start: 63, end: 66 },
          { text: "Yo propongo dijo el ratón", start: 66, end: 69 },
          { text: "hacerle una broma pesada", start: 69, end: 72 },
          { text: "o pelearnos de a mil contra el", start: 72, end: 75 },
          { text: "dijo una pulga enojada", start: 75, end: 78 },
        ],
      },
      // ── Sección 3 ─────────────────────────────────────────────────────
      {
        intro: { title: "PUENTE", message: "¡¡Recuperá!!", emoji: "💪", start: 78, end: 83 },
        lines: [
          { text: "Entre los gritos de la reunión", start: 83, end: 86 },
          { text: "se oyó una voz muy calmada", start: 86, end: 89 },
          { text: "y si mejor hablamos con él?", start: 89, end: 92 },
          { text: "dijo la tortuga más sabia", start: 92, end: 95 },
          { text: "Así lo hicieron y el león confesó", start: 95, end: 98 },
          { text: "que así es como demostraba", start: 98, end: 101 },
          { text: "que quería alguien con quien jugar", start: 101, end: 104 },
          { text: "y que muy solo estaba", start: 104, end: 108 },
        ],
      },
      // ── Sección 4 ─────────────────────────────────────────────────────
      {
        intro: { title: "PUENTE", message: "De acá al final", emoji: "🏁", start: 108, end: 113 },
        lines: [
          { text: "Pidió disculpas a cada animal", start: 113, end: 116 },
          { text: "al que había molestado", start: 116, end: 119 },
          { text: "y prometió no hacer nunca más", start: 119, end: 122 },
          { text: "cosas que le hicieran daño", start: 122, end: 125 },
          { text: "Ahora en la selva reina la amistad", start: 125, end: 128 },
          { text: "ya nadie anda asustado", start: 128, end: 131 },
          { text: "el león abrió su corazón", start: 131, end: 134 },
          { text: "y todos lo perdonaron", start: 134, end: 138 },
        ],
      },
      // ── Sección 5 ─────────────────────────────────────────────────────
      {
        intro: { title: "PUENTE", message: "Se viene la murga en la selva", emoji: "🎉", start: 138, end: 148 },
        lines: [
          { text: "LA SELVA ESTA DE FIESTA", start: 148, end: 153.5 },
          { text: "TODOS CANTAN Y BAILAN", start: 153.5, end: 159 },
          { text: "AHORA SON TODOS AMIGOS", start: 159, end: 164.5 },
          { text: "UNA GRAN MANADA", start: 164.5, end: 170 },
          { text: "LA SELVA ESTA DE FIESTA", start: 170, end: 175.5 },
          { text: "TODOS CANTAN Y BAILAN", start: 175.5, end: 181 },
          { text: "AHORA SON TODOS AMIGOS", start: 181, end: 186.5 },
          { text: "UNA GRAN MANADAAAAA", start: 186.5, end: 193 },
        ],
      },
      // ── Sección 6: riff final ─────────────────────────────────────────
      {
        intro: { title: "RIFF DEL FINAL", message: "¡¡A dejar todo!!", emoji: "🎸", start: 193, end: 223 },
        lines: [],
      },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

// Dado el tiempo actual, devuelve { sectionIndex, lineIndex, inIntro }
export function getKaraokeState(song, currentTime) {
  const sections = song.sections ?? [];

  for (let si = 0; si < sections.length; si++) {
    const section = sections[si];
    const { intro, lines } = section;

    // ¿Estamos en la intro de esta sección?
    if (intro && currentTime >= intro.start && currentTime < intro.end) {
      return { sectionIndex: si, lineIndex: -1, inIntro: true };
    }

    // ¿Estamos en alguna línea de esta sección?
    if (lines && lines.length > 0) {
      const sectionStart = intro ? intro.end : (lines[0]?.start ?? 0);
      const sectionEnd = lines[lines.length - 1]?.end ?? sectionStart;

      if (currentTime >= sectionStart && currentTime <= sectionEnd) {
        const lineIndex = lines.findIndex(
          l => currentTime >= l.start && currentTime < l.end
        );
        return { sectionIndex: si, lineIndex, inIntro: false };
      }
    }
  }

  return { sectionIndex: -1, lineIndex: -1, inIntro: false };
}
