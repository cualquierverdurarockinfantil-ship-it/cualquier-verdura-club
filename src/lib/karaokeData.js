// ============================================
// CLUB VERDURA — KARAOKE DATA
// Estructura reutilizable para todas las canciones
// ============================================

/**
 * Estructura de una línea sincronizada:
 * { text: string, start: number (seg), end: number (seg), words?: [{text,start,end}] }
 *   - words es opcional, para futura sincronización palabra por palabra.
 *
 * Estructura de una canción:
 * {
 *   id, title, artist, duration, durationSecs,
 *   cover, audioOriginal, audioInstrumental,
 *   videoUrl, chords, character, difficulty,
 *   lines: LineType[]   // letra sincronizada línea por línea
 * }
 */

/**
 * Estructura de un bloque especial (instrumental, puente, etc.):
 * {
 *   type: "instrumental" | "bridge" | "solo" | ...  (extensible)
 *   start: number (seg)
 *   end: number (seg)
 *   title: string       — título que se muestra grande (ej: "Solo de guitarra")
 *   message: string     — mensaje debajo (ej: "¡Aprovechá para bailar!")
 *   emoji: string       — emoji decorativo opcional
 * }
 *
 * Estos bloques se definen por canción y son leídos por LyricsScroller.
 * El componente nunca tiene hardcodeados los textos instrumentales.
 */

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
    chords: "",
    character: "tomate",
    difficulty: "fácil",
    finishMessage: "¡¡Llegaste al final, muy bien!!",

    // ── BLOQUES ESPECIALES ──────────────────────────────────────────────────
    specialBlocks: [
      {
        type: "instrumental",
        start: 0,
        end: 14,
        title: "RIFF",
        message: "¡¡Anda preparandote!!",
        emoji: "🎸",
      },
      {
        type: "instrumental",
        start: 50,
        end: 62,
        title: "RIFF LEGENDARIO",
        message: "¡¡Relaja y baila un poco!!",
        emoji: "🎸",
      },
      {
        type: "instrumental",
        start: 110,
        end: 135,
        title: "SOLO DE GUITARRA",
        message: "¡¡Momento de bailar!!",
        emoji: "🎸",
      },
    ],

    // ── LETRA SINCRONIZADA ──────────────────────────────────────────────────
    lines: [
      // Estrofa 1 (00:14 - 00:38)
      { text: "Yo te estaré esperando", start: 14, end: 17 },
      { text: "que me pases a buscar", start: 17, end: 20 },
      { text: "a que vengas a mi casa", start: 20, end: 23 },
      { text: "y me lleves a pasear", start: 23, end: 26.5 },
      { text: "Dar una vuelta por la plaza", start: 26.5, end: 30 },
      { text: "no estaría mal", start: 30, end: 32 },
      { text: "ir a probar gustos de helado", start: 32, end: 35 },
      { text: "ese es un buen plan", start: 35, end: 38 },
      // Estribillo 1 (00:38 - 00:50)
      { text: "ES UN BUEN PLAN", start: 38, end: 41 },
      { text: "UN BUEN PLAN", start: 41, end: 44 },
      { text: "SALIR A JUGAR", start: 44, end: 47 },
      { text: "SIEMPRE ES UN BUEN PLAN", start: 47, end: 50 },
      // Estrofa 2 (01:02 - 01:27)
      { text: "Mirá que lindo que está el día", start: 62, end: 65.5 },
      { text: "para ir a jugar", start: 65.5, end: 68 },
      { text: "o patear una pelota", start: 68, end: 71 },
      { text: "ese es un buen plan", start: 71, end: 74 },
      { text: "Hacer castillos con arena", start: 74, end: 77.5 },
      { text: "o ropa para mis muñecas", start: 77.5, end: 81 },
      { text: "un pastel de barro", start: 81, end: 84 },
      { text: "un barquito de papel", start: 84, end: 87 },
      // Estribillo 2 (01:27 - 01:50)
      { text: "ES UN BUEN PLAN", start: 87, end: 90 },
      { text: "UN BUEN PLAN", start: 90, end: 93 },
      { text: "SALIR A JUGAR", start: 93, end: 96 },
      { text: "SIEMPRE ES UN BUEN PLAN", start: 96, end: 99 },
      { text: "ES UN BUEN PLAN", start: 99, end: 101.5 },
      { text: "UN BUEN PLAN", start: 101.5, end: 104 },
      { text: "SALIR A JUGAR", start: 104, end: 107 },
      { text: "SIEMPRE ES UN BUEN PLAN", start: 107, end: 110 },
      // Estribillo final (02:15 - 02:35)
      { text: "ES UN BUEN PLAN", start: 135, end: 137.5 },
      { text: "UN BUEN PLAN", start: 137.5, end: 140 },
      { text: "SALIR A JUGAR", start: 140, end: 143 },
      { text: "SIEMPRE ES UN BUEN PLAN", start: 143, end: 146 },
      { text: "ES UN BUEN PLAN", start: 146, end: 148.5 },
      { text: "UN BUEN PLAN", start: 148.5, end: 151 },
      { text: "SALIR A JUGAR", start: 151, end: 155 },
    ],
  },
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
    chords: "",
    character: "tomate",
    difficulty: "medio",
    finishMessage: "¡¡Muy bien, la rompiste!!",

    // ── BLOQUES ESPECIALES ──────────────────────────────────────────────────
    specialBlocks: [
      { type: "instrumental", start: 0, end: 24, title: "INTRO", message: "¡¡A prepararse!!", emoji: "🎸" },
      { type: "puente", start: 48, end: 54, title: "PUENTE", message: "Toma aire", emoji: "🌬️" },
      { type: "puente", start: 78, end: 83, title: "PUENTE", message: "¡¡Recuperá!!", emoji: "💪" },
      { type: "puente", start: 108, end: 113, title: "PUENTE", message: "De acá al final", emoji: "🏁" },
      { type: "puente", start: 138, end: 148, title: "PUENTE", message: "Se viene la murga en la selva", emoji: "🎉" },
      { type: "instrumental", start: 193, end: 223, title: "RIFF DEL FINAL", message: "¡¡A dejar todo!!", emoji: "🎸" },
    ],

    // ── LETRA SINCRONIZADA ──────────────────────────────────────────────────
    lines: [
      // Verso 1 (24 - 48)
      { text: "Esta es la historia de un león", start: 24, end: 27 },
      { text: "que a todos molestaba", start: 27, end: 30 },
      { text: "nadie quería cruzarse con el", start: 30, end: 33 },
      { text: "que ni se les acercara", start: 33, end: 36 },
      { text: "Hacía bromas en cada ocasión", start: 36, end: 39 },
      { text: "y 2x3 se peleaba", start: 39, end: 42 },
      { text: "si era un oso o era un ratón", start: 42, end: 45 },
      { text: "nadie de él se salvaba", start: 45, end: 48 },
      // Verso 2 (54 - 78)
      { text: "Los animales de la región", start: 54, end: 57 },
      { text: "ya no lo soportaban", start: 57, end: 60 },
      { text: "enfrentaron la situación", start: 60, end: 63 },
      { text: "todos juntos en manada", start: 63, end: 66 },
      { text: "Yo propongo dijo el ratón", start: 66, end: 69 },
      { text: "hacerle una broma pesada", start: 69, end: 72 },
      { text: "o pelearnos de a mil contra el", start: 72, end: 75 },
      { text: "dijo una pulga enojada", start: 75, end: 78 },
      // Verso 3 (83 - 108)
      { text: "Entre los gritos de la reunión", start: 83, end: 86 },
      { text: "se oyó una voz muy calmada", start: 86, end: 89 },
      { text: "y si mejor hablamos con él?", start: 89, end: 92 },
      { text: "dijo la tortuga más sabia", start: 92, end: 95 },
      { text: "Así lo hicieron y el león confesó", start: 95, end: 98 },
      { text: "que así es como demostraba", start: 98, end: 101 },
      { text: "que quería alguien con quien jugar", start: 101, end: 104 },
      { text: "y que muy solo estaba", start: 104, end: 108 },
      // Verso 4 (113 - 138)
      { text: "Pidió disculpas a cada animal", start: 113, end: 116 },
      { text: "al que había molestado", start: 116, end: 119 },
      { text: "y prometió no hacer nunca más", start: 119, end: 122 },
      { text: "cosas que le hicieran daño", start: 122, end: 125 },
      { text: "Ahora en la selva reina la amistad", start: 125, end: 128 },
      { text: "ya nadie anda asustado", start: 128, end: 131 },
      { text: "el león abrió su corazón", start: 131, end: 134 },
      { text: "y todos lo perdonaron", start: 134, end: 138 },
      // Verso 5 y final (148 - 193)
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
];

// Devuelve el índice de la línea activa según el tiempo actual.
// Si estamos en un hueco instrumental, devuelve la próxima línea que viene.
export function getActiveLineIndex(lines, currentTime) {
  for (let i = 0; i < lines.length; i++) {
    if (currentTime >= lines[i].start && currentTime < lines[i].end) {
      return i;
    }
  }
  return -1; // ninguna línea activa (intro/instrumental)
}