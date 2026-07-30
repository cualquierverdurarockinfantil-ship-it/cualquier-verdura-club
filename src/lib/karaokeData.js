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
    audioOriginal: "/assets/karaoke/un-buen-plan-original.mp3",
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

// ============================================
// Karaoke de las 9 canciones del disco (temporal, timing proporcional — a ajustar)
// Se combinan con ALBUM.tracks en la pagina de Karaoke usando el campo "slug".
// ============================================
export const ALBUM_KARAOKE_SECTIONS = [
  {
    id: "asi-asa",
    title: "Así Asá",
    artist: "Cualquier Verdura",
    duration: "3:07",
    durationSecs: 187.7,
    cover: "/assets/album-cover.jpg",
    audioOriginal: "/assets/audio/album/asi-asa-voz.mp3",
    audioInstrumental: "/assets/audio/album/asi-asa-instrumental.mp3",
    videoUrl: null,
    difficulty: "medio",
    finishMessage: "¡¡Viajemos de nuevo!!",
    sections: [
      {
        intro: { title: "MELO DE GUITARRA", message: "¡¡A tomar carrera!!", emoji: "🎸", start: 0, end: 12 },
        lines: [
          { text: "Un verano fui de vacaciones, a conocer la playa", start: 12, end: 17.9 },
          { text: "El mar, la arena y los caracoles, no me interesaban", start: 17.9, end: 24.3 },
          { text: "yo fui hasta la playa, para ver cómo bailaban", start: 24.3, end: 30 },
          { text: "ASÍ ASÍ, TODOS BAILAN ASÍ", start: 33, end: 38.4 },
          { text: "ASA ASA, TODOS BAILAN ALLÁ", start: 38.4, end: 44 },
          { text: "En el otoño me fui de viaje, a conocer montañas", start: 44, end: 50.4 },
          { text: "Los ríos, el bosque y acampar, no me interesaba", start: 50.4, end: 56.8 },
          { text: "Yo me fui a la montaña, para ver cómo saltaban", start: 56.8, end: 63 },
          { text: "ASÍ ASÍ, TODOS SALTAN ASÍ", start: 63, end: 69.9 },
          { text: "ASA ASA, TODOS SALTAN ALLÁ", start: 69.9, end: 77 },
          { text: "Llegó el invierno y como hace frío, me volví a mi casa", start: 77, end: 84.1 },
          { text: "La estufa, el sofá y las pantuflas, no me interesaban", start: 84.1, end: 91.1 },
          { text: "Yo me quedé en mi casa, para ver cómo giraban", start: 91.1, end: 97 },
          { text: "ASÍ ASÍ, TODOS GIRAN ASÍ", start: 97, end: 102.9 },
          { text: "ASA ASA, TODOS GIRAN ALLÁ", start: 102.9, end: 109 },
        ],
      },
      {
        intro: { title: "PRIMAVERA REGGAE", message: "¡¡Toma aire!!", emoji: "🎷", start: 109, end: 124 },
        lines: [
          { text: "Vuelve la primavera, el sol calienta en el cielo", start: 124, end: 131.4 },
          { text: "Los pajaritos cantan, las flores aparecieron", start: 131.4, end: 138.3 },
          { text: "Y a mí ya me están dando, ganas de viajar de nuevo", start: 138.3, end: 146 },
          { text: "VIAJAR VIAJAR, CÓMO ME GUSTA VIAJAR", start: 146, end: 152 },
          { text: "VIAJAR VIAJAR, CÓMO ME GUSTA VIAJAR", start: 152, end: 158 },
          { text: "VIAJAR VIAJAR, CÓMO ME GUSTA VIAJAR", start: 158, end: 164 },
          { text: "VIAJAR VIAJAR, CÓMO ME GUSTA VIAJAR", start: 164, end: 170 },
          { text: "VIAJAR VIAJAR, VIAJAR VIAJAR VIAJAR", start: 170, end: 176 },
          { text: "VIAJAR VIAJAR, CÓMO ME GUSTA VIAJAR", start: 176, end: 187.7 },
        ],
      },
    ],
  },
  {
    id: "dulces",
    title: "Dulces",
    artist: "Cualquier Verdura",
    duration: "3:13",
    durationSecs: 192.8,
    cover: "/assets/album-cover.jpg",
    audioOriginal: "/assets/audio/album/dulces-voz.mp3",
    audioInstrumental: "/assets/audio/album/dulces-instrumental.mp3",
    videoUrl: null,
    difficulty: "fácil",
    finishMessage: "¡¡A bailar con las verduras!!",
    sections: [
      {
        intro: { title: "RITMO DISCO", message: "¡¡Bailemoos!!", emoji: "🕺", start: 0, end: 12 },
        lines: [
          { text: "¡Dulces!", start: 12, end: 14 },
          { text: "Cómo me gustan a mí los dulces", start: 14, end: 17 },
          { text: "No me importa romperme las muelas", start: 17, end: 21 },
          { text: "Siempre y cuando yo tenga mis golosinas", start: 21, end: 27 },
          { text: "¡Dulces!", start: 27, end: 30 },
          { text: "Cómo me gusta a mí comer dulces", start: 30, end: 34 },
          { text: "No hay un solo momento del día", start: 34, end: 38 },
          { text: "Que no piense yo en esas golosinas", start: 38, end: 43 },
          { text: "¡Es que me gustan tanto mamaa!", start: 43, end: 47 },
          { text: "¡Después de todo solo se vive una vez!", start: 47, end: 50 },
          { text: "Los dientes me van a volver a crecer", start: 50, end: 55 },
          { text: "Y ese sabor especial", start: 55, end: 57 },
          { text: "Que invade mi paladar", start: 57, end: 59 },
          { text: "Cualquier verdura no me lo daaaa.", start: 59, end: 63 },
          { text: "¡Dulces!", start: 63, end: 65 },
          { text: "Cómo me gustan a mí los dulces", start: 65, end: 69 },
          { text: "No me importa romperme las muelas", start: 69, end: 72 },
          { text: "Siempre y cuando yo tenga mis golosinas", start: 72, end: 80 },
          { text: "¡Dulces!", start: 80, end: 82 },
          { text: "Cómo me gusta a mí comer dulces", start: 82, end: 85 },
          { text: "No hay un solo momento del día", start: 85, end: 88 },
          { text: "Que no piense yo en esas golosinas", start: 88, end: 94 },
          { text: "¡Siempre pensando en lo mismo che!", start: 94, end: 97 },
          { text: "¡Después de todo solo se vive una vez!", start: 97, end: 101 },
          { text: "Los dientes me van a volver a crecer", start: 101, end: 107 },
          { text: "Y ese sabor especial", start: 107, end: 109 },
          { text: "Que invade mi paladar", start: 109, end: 111 },
          { text: "Cualquier verdura no me lo daaaa.", start: 111, end: 115 },
          { text: "¡Mejor comete vos las verduras!", start: 115, end: 119 },
          { text: "No pienso cuidar yo mi dentadura", start: 119, end: 124 },
          { text: "Y cuando empiece a crecer", start: 124, end: 126 },
          { text: "Veré mis dientes caer", start: 126, end: 128 },
          { text: "Y solo ahí recordaré", start: 128, end: 133 },
          { text: "Que me decías", start: 133, end: 135 },
          { text: "Que me cepille todos los días", start: 135, end: 140 },
          { text: "Qué tanto dulce hace mal", start: 140, end: 142 },
          { text: "Que eso me puede afectar", start: 142, end: 144 },
          { text: "Si sigo así no podré disfrutar de los ¡Dulces!", start: 144, end: 150 },
        ],
      },
      {
        intro: { title: "FINAL", message: "De acá al final — ¡¡A bailar con las verduras!!", emoji: "💃", start: 150, end: 192.8 },
        lines: [],
      },
    ],
  },
  {
    id: "el-baile-de-los-piojos",
    title: "El Baile de los Piojos",
    artist: "Cualquier Verdura",
    duration: "2:36",
    durationSecs: 155.5,
    cover: "/assets/album-cover.jpg",
    audioOriginal: "/assets/audio/album/el-baile-de-los-piojos-voz.mp3",
    audioInstrumental: "/assets/audio/album/el-baile-de-los-piojos-instrumental.mp3",
    videoUrl: null,
    difficulty: "difícil",
    finishMessage: "¡¡Muy bien, terminamos!!",
    sections: [
      {
        intro: { title: "CUMBIA", message: "¡¡Preparense!!", emoji: "💃", start: 0, end: 5 },
        lines: [
          { text: "Todos a bailar el baile de los piojos", start: 5, end: 7.3 },
          { text: "Si me pica la cabeza tengo piojos", start: 7.3, end: 9.3 },
          { text: "Todos a bailar el baile de los piojos", start: 9.3, end: 11.5 },
          { text: "¡El baile de los piojos!", start: 11.5, end: 13.0 },
          { text: "Si tenés piojos no pasa nada,", start: 13, end: 15.0 },
          { text: "Todos tuvimos en la primaria,", start: 15.0, end: 17.1 },
          { text: "Inclusive tu mamá, preguntale a tu papá", start: 17.1, end: 19.8 },
          { text: "que te suben por arriba que te trepan por detrás", start: 19.8, end: 23.2 },
          { text: "si me pican yo me rasco pero ahora", start: 23.2, end: 25.6 },
          { text: "me vuelven a picaaar", start: 25.6, end: 27.0 },
          { text: "Un piojo se le puede contagiar", start: 27, end: 29.6 },
          { text: "a un caballero como a una mujer", start: 29.6, end: 32.3 },
          { text: "Con vinagre los podés sacar", start: 32.3, end: 34.7 },
          { text: "O con un poco de kerosene", start: 34.7, end: 36.9 },
          { text: "Yo me los quiero sacar pero no puedo", start: 36.9, end: 40.0 },
          { text: "Todos a bailar el baile de los piojos", start: 40, end: 43.1 },
          { text: "Si me pica la cabeza tengo piojos", start: 43.1, end: 45.9 },
          { text: "Todos a bailar el baile de los piojos", start: 45.9, end: 49.0 },
          { text: "el baile de los piojos!!", start: 49.0, end: 51.0 },
        ],
      },
      {
        intro: { title: "CUMBIAA", message: "¡¡A bailar todo el mundo!!", emoji: "💃", start: 51, end: 63 },
        lines: [
          { text: "Todos a bailar el baile de los piojos", start: 63, end: 65.8 },
          { text: "Si me pica la cabeza tengo piojos", start: 65.8, end: 68.2 },
          { text: "Todos a bailar el baile de los piojos...", start: 68.2, end: 71.2 },
          { text: "el baile de los piojos!!", start: 71.2, end: 73.0 },
        ],
      },
      {
        intro: { title: "ROOOCK", message: "¡¡A mover la cabeza!!", emoji: "🤘", start: 73, end: 82 },
        lines: [
          { text: "Yo no voy", start: 82, end: 84.5 },
          { text: "a salir", start: 84.5, end: 86.6 },
          { text: "de tu cabeza", start: 86.6, end: 89.9 },
          { text: "yo soy el piojo", start: 89.9, end: 94.0 },
          { text: "mal bicho, dicen que soy", start: 94, end: 96.7 },
          { text: "mal bicho, así es como me ven", start: 96.7, end: 100.0 },
          { text: "mal bicho, sequesensen", start: 100.0, end: 102.5 },
          { text: "mal bicho querrequeten", start: 102.5, end: 105.0 },
          { text: "Todos a bailar el baile de los piojos", start: 105, end: 108.5 },
          { text: "Si me pica la cabeza tengo piojos", start: 108.5, end: 111.7 },
          { text: "Todos a bailar el baile de los piojos...", start: 111.7, end: 115.5 },
          { text: "el baile de los piojos!!", start: 115.5, end: 117.7 },
          { text: "Un piojo se le puede contagiar,", start: 117.7, end: 120.7 },
          { text: "a un caballero como a una mujer,", start: 120.7, end: 123.7 },
          { text: "Con vinagre los podés sacar", start: 123.7, end: 126.3 },
          { text: "O con un poco de kerosene", start: 126.3, end: 128.7 },
          { text: "Yo me los quiero sacar pero no puedo", start: 128.7, end: 132.1 },
          { text: "Todos a bailar el baile de los piojos", start: 132.1, end: 135.6 },
          { text: "Si me pica la cabeza tengo piojos", start: 135.6, end: 138.7 },
          { text: "Todos a bailar el baile de los piojos", start: 138.7, end: 142.3 },
          { text: "Todos a bailar el baile de los piojos", start: 142.3, end: 145.8 },
          { text: "Si me pica la cabeza tengo piojos", start: 145.8, end: 148.9 },
          { text: "Todos a bailar el baile de los piojos...", start: 148.9, end: 152.7 },
          { text: "el baile de los piojos!!", start: 152.7, end: 155.0 },
        ],
      },
    ],
  },
  {
    id: "el-reino-del-reves",
    title: "El Reino del Revés",
    artist: "Cualquier Verdura",
    duration: "2:15",
    durationSecs: 135.2,
    cover: "/assets/album-cover.jpg",
    audioOriginal: "/assets/audio/album/el-reino-del-reves-voz.mp3",
    audioInstrumental: "/assets/audio/album/el-reino-del-reves-instrumental.mp3",
    videoUrl: null,
    difficulty: "difícil",
    finishMessage: "¡¡Y todos a bailar!!",
    sections: [
      {
        intro: { title: "INTRO ROCKERA", message: "¡¡Preparense!!", emoji: "🎸", start: 0, end: 24 },
        lines: [
          { text: "Me dijeron que en el Reino del Revés", start: 24, end: 27.5 },
          { text: "Nada el pájaro y vuela el pez", start: 27.5, end: 30.4 },
          { text: "Que los gatos no hacen miau y dicen yes", start: 30.4, end: 34.2 },
          { text: "Porque estudian mucho inglés", start: 34.2, end: 37.0 },
          { text: "Vamos a ver cómo es", start: 37, end: 39.8 },
          { text: "El Reino del Revés", start: 39.8, end: 42.5 },
          { text: "Vamos a ver cómo es", start: 42.5, end: 45.3 },
          { text: "El Reino del Revés", start: 45.3, end: 48.0 },
          { text: "Me dijeron que en el Reino del Revés", start: 48, end: 51.7 },
          { text: "Nadie baila con los pies", start: 51.7, end: 54.2 },
          { text: "Que un ladrón es vigilante y otro es juez", start: 54.2, end: 58.5 },
          { text: "Y que dos y dos son tres", start: 58.5, end: 61.0 },
          { text: "Vamos a ver cómo es", start: 61, end: 64.3 },
          { text: "El Reino del Revés", start: 64.3, end: 67.5 },
          { text: "Vamos a ver cómo es", start: 67.5, end: 70.8 },
          { text: "El Reino del Revés", start: 70.8, end: 74.0 },
          { text: "Me dijeron que en el Reino del Revés", start: 74, end: 77.7 },
          { text: "Cabe un oso en una nuez", start: 77.7, end: 80.0 },
          { text: "Que usan barbas y bigotes los bebés", start: 80.0, end: 83.6 },
          { text: "Y que un año dura un mes", start: 83.6, end: 86.0 },
          { text: "Vamos a ver cómo es", start: 86, end: 86.5 },
          { text: "El Reino del Revés", start: 86.5, end: 87.0 },
          { text: "Vamos a ver cómo es", start: 87.0, end: 87.5 },
          { text: "El Reino del Revés", start: 87.5, end: 88.0 },
        ],
      },
      {
        intro: { title: "SOLO DE GUITARRA", message: "¡¡Y todos a bailar!!", emoji: "🎸", start: 88, end: 135.2 },
        lines: [
        ],
      },
    ],
  },
  {
    id: "pajaros-volando",
    title: "Pájaros Volando",
    artist: "Cualquier Verdura",
    duration: "3:20",
    durationSecs: 200.2,
    cover: "/assets/album-cover.jpg",
    audioOriginal: "/assets/audio/album/pajaros-volando-voz.mp3",
    audioInstrumental: "/assets/audio/album/pajaros-volando-instrumental.mp3",
    videoUrl: null,
    difficulty: "fácil",
    finishMessage: "¡¡Bien, volando llegamos al final!!",
    sections: [
      {
        intro: { title: "COMENZAMOS", message: "¡¡Baila como si volaras!!", emoji: "🐦", start: 0, end: 12 },
        lines: [
          { text: "Yo solo soy", start: 12, end: 15.1 },
          { text: "Un pequeño pajarito", start: 15.1, end: 20.5 },
          { text: "Alejado del montón.", start: 20.5, end: 25.9 },
          { text: "Todos volando menos yo.", start: 25.9, end: 32.4 },
          { text: "Acá estoy", start: 32.4, end: 34.9 },
          { text: "Entre los dedos de un chabón.", start: 34.9, end: 43.1 },
          { text: "No me quiere soltar,", start: 43.1, end: 48.8 },
          { text: "Se la quiere asegurar.", start: 48.8, end: 55.0 },
          { text: "Y yo extraño a mi bandada.", start: 55, end: 60.8 },
          { text: "Volar el cielo en libertad.", start: 60.8, end: 66.8 },
          { text: "Recorrer el mundo.", start: 66.8, end: 70.8 },
          { text: "Volando siempre en libertad.", start: 70.8, end: 77.0 },
        ],
      },
      {
        intro: { title: "VOLEMOS", message: "¡¡Tomemos aire!!", emoji: "🐦", start: 77, end: 90 },
        lines: [
          { text: "Es mejor pájaro en mano", start: 90, end: 95.0 },
          { text: "Que cien pájaros volando.", start: 95.0, end: 100.4 },
          { text: "Nadie pensó en mí.", start: 100.4, end: 104.3 },
          { text: "Cuando hicieron el refrán.", start: 104.3, end: 110.0 },
          { text: "Y yo extraño a mi bandada.", start: 110, end: 115.8 },
          { text: "Volar el cielo en libertad.", start: 115.8, end: 121.8 },
          { text: "Recorrer el mundo.", start: 121.8, end: 125.8 },
          { text: "Volando siempre en libertad.", start: 125.8, end: 132.0 },
        ],
      },
      {
        intro: { title: "SOLO DE GUITARRA", message: "¡¡Hagamos que volamos!!", emoji: "🎸", start: 132, end: 154 },
        lines: [
          { text: "Y yo extraño a mi bandada.", start: 154, end: 160.8 },
          { text: "Volar el cielo en libertad.", start: 160.8, end: 167.8 },
          { text: "Recorrer el mundo.", start: 167.8, end: 172.5 },
          { text: "Volando siempre en libertad.", start: 172.5, end: 179.8 },
          { text: "Oh oh oh oh oh", start: 179.8, end: 183.4 },
          { text: "ooooohh en libertad", start: 183.4, end: 188.4 },
          { text: "Oh oh oh oh oh", start: 188.4, end: 192.0 },
          { text: "ooooohh en libertad", start: 192.0, end: 197.0 },
        ],
      },
    ],
  },
  {
    id: "se-hace-tarde",
    title: "Se Hace Tarde",
    artist: "Cualquier Verdura",
    duration: "3:37",
    durationSecs: 216.7,
    cover: "/assets/album-cover.jpg",
    audioOriginal: "/assets/audio/album/se-hace-tarde-voz.mp3",
    audioInstrumental: "/assets/audio/album/se-hace-tarde-instrumental.mp3",
    videoUrl: null,
    difficulty: "medio",
    finishMessage: "¡¡Muy bueno, te felicito!!",
    sections: [
      {
        intro: { title: "RIFF PUNK", message: "¡¡A saltar!!", emoji: "🎸", start: 0, end: 12 },
        lines: [
          { text: "Todas las veces que decía", start: 12, end: 18 },
          { text: "que comas toda la comida", start: 18, end: 24 },
          { text: "todas las veces que un dulce te negué", start: 24, end: 30 },
          { text: "era por tu propio bien", start: 30, end: 35 },
          { text: "Cada vez que te mandaba", start: 35, end: 41 },
          { text: "a ponerte más abrigo", start: 41, end: 47 },
          { text: "por más que vos no sientas que hace frío abrigate igual", start: 47, end: 53 },
          { text: "o te podés enfermar", start: 53, end: 58 },
          { text: "vestite, bañate, abrigate", start: 58, end: 61 },
          { text: "lavate los dientes, andá a peinarte", start: 61, end: 64 },
          { text: "ordená tu cuarto, acostate", start: 64, end: 68 },
          { text: "levantate, se hace tarde", start: 68, end: 70 },
          { text: "eeehh uooohh ya es tarde", start: 70, end: 76 },
          { text: "eeee eehh uoo uooo", start: 76, end: 82 },
        ],
      },
      {
        intro: { title: "MELO DE GUITARRA", message: "¡¡Toma aire!!", emoji: "🎸", start: 82, end: 93 },
        lines: [
          { text: "mamá no quiero abrigarme", start: 93, end: 99 },
          { text: "papá no cocines más verduras", start: 99, end: 105 },
          { text: "yo quiero comer golosinas todo el día", start: 105, end: 111 },
          { text: "y no me pienso ir a peinar", start: 111, end: 117 },
          { text: "lalala no me quiero peinar", start: 117, end: 123 },
          { text: "lalala ni bañar", start: 123, end: 128 },
        ],
      },
      {
        intro: { title: "MELO DE GUITARRA", message: "¡¡Aprovecha a descansar!!", emoji: "🎸", start: 128, end: 140 },
        lines: [
          { text: "mamá eso era mentira", start: 140, end: 146 },
          { text: "te prometo que me voy a portar muy bien", start: 146, end: 152 },
          { text: "pero acordate que la niñez es una vez", start: 152, end: 158 },
          { text: "y yo la quiero disfrutar", start: 158, end: 163 },
          { text: "lalala yo quiero disfrutarla", start: 163, end: 169 },
          { text: "lalala disfrutar", start: 169, end: 173 },
          { text: "lalala yo quiero disfrutarla", start: 173, end: 181 },
          { text: "lalala disfrutar", start: 181, end: 186 },
        ],
      },
      {
        intro: { title: "SOLO DE GUITARRA", message: "¡¡Muy bien, ahora a bailar hasta el final!!", emoji: "🎸", start: 186, end: 216.7 },
        lines: [],
      },
    ],
  },
  {
    id: "super-poder",
    title: "Súper Poder",
    artist: "Cualquier Verdura",
    duration: "2:47",
    durationSecs: 167.1,
    cover: "/assets/album-cover.jpg",
    audioOriginal: "/assets/audio/album/super-poder-voz.mp3",
    audioInstrumental: "/assets/audio/album/super-poder-instrumental.mp3",
    videoUrl: null,
    difficulty: "difícil",
    finishMessage: "¡¡Llegamos, y este es re difícil!!",
    sections: [
      {
        intro: { title: "RITMO SKA", message: "¡¡A mover esas piernas!!", emoji: "🎷", start: 0, end: 12 },
        lines: [
          { text: "Me voy a ir a buscar", start: 12, end: 15 },
          { text: "lo que me pidió mamá", start: 15, end: 18 },
          { text: "me dijo que está ahí", start: 18, end: 21 },
          { text: "y no lo puedo encontrar", start: 21, end: 24 },
          { text: "porque no buscas mejor", start: 24, end: 27 },
          { text: "ella me dijo, me insistió", start: 27, end: 31 },
          { text: "seguro que si voy", start: 31, end: 34 },
          { text: "lo encuentro yo", start: 34, end: 38 },
          { text: "y acá no está", start: 38, end: 42 },
          { text: "ya no sé dónde más buscar", start: 42, end: 46 },
          { text: "voy a pedirle ayuda", start: 46, end: 48 },
          { text: "a mi papá", start: 48, end: 54 },
          { text: "yo no sé", start: 54, end: 57 },
          { text: "alguna vez lo intenté", start: 57, end: 60 },
          { text: "por más que quise", start: 60, end: 63 },
          { text: "nunca encontré", start: 63, end: 66 },
          { text: "tu mamá", start: 66, end: 69 },
          { text: "debe tener un súper poder", start: 69, end: 72 },
          { text: "hace las cosas", start: 72, end: 74 },
          { text: "aparecer", start: 74, end: 80 },
          { text: "y acá no está", start: 80, end: 84 },
          { text: "ya busqué en cada lugar", start: 84, end: 87 },
          { text: "solo ella sabe", start: 87, end: 90 },
          { text: "dónde encontrar", start: 90, end: 93 },
          { text: "me dijo que está ahí", start: 93, end: 96 },
          { text: "me volvió a repetir", start: 96, end: 99 },
          { text: "seguro que si voy", start: 99, end: 102 },
          { text: "lo encuentro yo", start: 102, end: 107 },
        ],
      },
      {
        intro: { title: "SOLO DE GUITARRA", message: "¡¡A saltar todo el mundo!!", emoji: "🎸", start: 107, end: 134 },
        lines: [
          { text: "y acá no está", start: 134, end: 137 },
          { text: "ya busqué en cada lugar", start: 137, end: 140 },
          { text: "solo ella sabe", start: 140, end: 143 },
          { text: "dónde encontrar", start: 143, end: 146 },
          { text: "me dijo que está ahí", start: 146, end: 149 },
          { text: "me volvió a repetir", start: 149, end: 152 },
          { text: "seguro que si voy", start: 152, end: 155 },
          { text: "lo encuentro yo", start: 155, end: 161 },
        ],
      },
    ],
  },
  {
    id: "caballo-regalado",
    title: "Caballo Regalado",
    artist: "Cualquier Verdura",
    duration: "2:36",
    durationSecs: 155.5,
    cover: "/assets/album-cover.jpg",
    audioOriginal: "/assets/audio/album/caballo-regalado-voz.mp3",
    audioInstrumental: "/assets/audio/album/caballo-regalado-instrumental.mp3",
    videoUrl: null,
    difficulty: "fácil",
    finishMessage: "¡¡Muy bien, terminamos!!",
    sections: [
      {
        intro: { title: "REGGAE", message: "¡¡A bailaar!!", emoji: "🎷", start: 0, end: 18 },
        lines: [
          { text: "Cuántos dichos hemos dicho", start: 18, end: 21.6 },
          { text: "Sin medir las consecuencias", start: 21.6, end: 25.4 },
          { text: "Como la historia de mi amigo,", start: 25.4, end: 29.4 },
          { text: "Dueño de un caballo que le regaló el patrón.", start: 29.4, end: 35.6 },
          { text: "Hoy al caballo se le aflojó un diente,", start: 35.6, end: 40.9 },
          { text: "Ningún veterinario lo quiere mirar.", start: 40.9, end: 45.8 },
          { text: "Porque a caballo regalado no se le miran los dientes.", start: 45.8, end: 53.2 },
          { text: "Que aparezca un veterinario, que lo pueda ayudar.", start: 53.2, end: 60.0 },
        ],
      },
      {
        intro: { title: "MELO DE GUITARRA", message: "¡¡Bailemos!!", emoji: "🎸", start: 60, end: 76 },
        lines: [
          { text: "Otra opción es venderlo al pingo,", start: 76, end: 79.8 },
          { text: "Que de caballo vendido no hay refrán.", start: 79.8, end: 84.0 },
          { text: "Pero a un caballo con dolor de dientes,", start: 84.0, end: 88.4 },
          { text: "Nadie lo quiere comprar.", start: 88.4, end: 91.1 },
          { text: "Voy a tener que regalarlo.", start: 91.1, end: 94.1 },
          { text: "Creo que ya entiendo, de dónde es el refrán", start: 94.1, end: 99.0 },
          { text: "Porque a caballo regalado no se le miran los dientes.", start: 99, end: 105.2 },
          { text: "Que aparezca un veterinario, que lo pueda ayudar.", start: 105.2, end: 111.0 },
        ],
      },
      {
        intro: { title: "SOLO DE GUITARRA", message: "¡¡Todo el mundo a saltar!!", emoji: "🎸", start: 111, end: 123 },
        lines: [
          { text: "Que aparezca un veterinario", start: 123, end: 127.8 },
          { text: "Que pueda ayudar a mi caballo", start: 127.8, end: 132.9 },
          { text: "Porque a un caballo con dolor de dientes", start: 132.9, end: 140.0 },
          { text: "Nadie lo quiere mirar", start: 140.0, end: 143.7 },
          { text: "Voy a tener que regalarlo", start: 143.7, end: 148.1 },
          { text: "Creo que ya entiendo de dónde es el refrán", start: 148.1, end: 155.5 },
        ],
      },
    ],
  },
  {
    id: "rock-and-colors",
    title: "Rock & Colors",
    artist: "Cualquier Verdura",
    duration: "3:32",
    durationSecs: 211.6,
    cover: "/assets/album-cover.jpg",
    audioOriginal: "/assets/audio/album/rock-and-colors-voz.mp3",
    audioInstrumental: "/assets/audio/album/rock-and-colors-instrumental.mp3",
    videoUrl: null,
    difficulty: "medio",
    finishMessage: "¡¡Muy bien, terminamos!!",
    sections: [
      {
        intro: { title: "ROCK CLÁSICO", message: "¡¡A bailaaar!!", emoji: "🎸", start: 0, end: 34 },
        lines: [
          { text: "Está muy bien, si esta vez", start: 34, end: 37 },
          { text: "decidís mezclar los colores", start: 37, end: 40 },
          { text: "Rojo amarillo y azul también", start: 40, end: 43 },
          { text: "puedes hacer muchas combinaciones", start: 43, end: 46 },
          { text: "Son los colores primarios", start: 46, end: 52 },
          { text: "ROJO AMARILLO Y AZUL", start: 52, end: 56 },
          { text: "HACEN VERDE VIOLETA Y NARANJA", start: 56, end: 59 },
          { text: "TODOS ESOS COLORES", start: 59, end: 61 },
          { text: "Y MUCHOS MÁS", start: 61, end: 64 },
          { text: "TÚ PODRÁS COMBINAR", start: 64, end: 66 },
        ],
      },
      {
        intro: { title: "RIFF COLORIDO", message: "¡¡Toma aire!!", emoji: "🎨", start: 66, end: 78 },
        lines: [
          { text: "Azul azul", start: 78, end: 84 },
          { text: "azul azul", start: 84, end: 91 },
          { text: "Azul con amarillo da verde", start: 97, end: 100 },
          { text: "como el color de un melón", start: 100, end: 103 },
          { text: "Azul con rojo es morado", start: 103, end: 107 },
          { text: "como un tomate en mal estado", start: 107, end: 109 },
          { text: "Rojo y amarillo", start: 109, end: 111 },
          { text: "es anaranjado", start: 111, end: 115 },
          { text: "ROJO AMARILLO Y AZUL", start: 115, end: 118 },
          { text: "HACEN VERDE VIOLETA Y NARANJA", start: 118, end: 122 },
          { text: "TODOS ESOS COLORES", start: 122, end: 125 },
          { text: "Y MUCHOS MÁS", start: 125, end: 127 },
          { text: "TÚ PODRÁS COMBINAR", start: 127, end: 130 },
        ],
      },
      {
        intro: { title: "RIFF COLORIDO", message: "¡¡Muy bien!!", emoji: "🎨", start: 130, end: 141 },
        lines: [
        ],
      },
      {
        intro: { title: "SOLO DE GUITARRA", message: "¡¡A tirar unos prohibidos!!", emoji: "🎸", start: 141, end: 171 },
        lines: [
          { text: "ROJO AMARILLO Y AZUL", start: 171, end: 174 },
          { text: "HACEN VERDE VIOLETA Y NARANJA", start: 174, end: 178 },
          { text: "TODOS ESOS COLORES Y MUCHOS MÁS", start: 178, end: 182 },
          { text: "ROJO AMARILLO Y AZUL", start: 182, end: 185 },
          { text: "HACEN VERDE VIOLETA Y NARANJA", start: 185, end: 188 },
          { text: "TODOS ESOS COLORES", start: 188, end: 191 },
          { text: "Y MUCHOS MÁS", start: 191, end: 193 },
          { text: "TÚ PODRÁS COMBINAR", start: 193, end: 196 },
          { text: "TÚ PODRÁS COMBINAR", start: 196, end: 200 },
          { text: "TÚ PODRÁS COMBINAR", start: 200, end: 203 },
          { text: "TÚ PODRÁS COMBINAR", start: 203, end: 206 },
          { text: "TÚ PODRÁS COMBINAR", start: 206, end: 211.6 },
        ],
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
