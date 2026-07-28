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
    finishMessage: "¡A tomar carrera!",
    sections: [
      {
        intro: { title: "INTRO", message: "¡A tomar carrera!", emoji: "🎸", start: 0.0, end: 4.3 },
        lines: [
          { text: "Un verano fui de vacaciones, a conocer la playa", start: 4.3, end: 13.5 },
          { text: "El mar, la arena y los caracoles, no me interesaban", start: 13.5, end: 23.5 },
          { text: "yo fui hasta la playa, para ver cómo bailaban", start: 23.5, end: 32.3 },
          { text: "ASÍ ASÍ, TODOS BAILAN ASÍ", start: 32.3, end: 37.1 },
          { text: "ASA ASA, TODOS BAILAN ALLÁ", start: 37.1, end: 42.2 },
          { text: "En el otoño me fui de viaje, a conocer montañas", start: 42.2, end: 51.4 },
          { text: "Los ríos, el bosque y acampar, no me interesaba", start: 51.4, end: 60.6 },
          { text: "Yo me fui a la montaña, para ver cómo saltaban", start: 60.6, end: 69.6 },
          { text: "ASÍ ASÍ, TODOS SALTAN ASÍ", start: 69.6, end: 74.5 },
          { text: "ASA ASA, TODOS SALTAN ALLÁ", start: 74.5, end: 79.6 },
          { text: "Llegó el invierno y como hace frío, me volví a mi casa", start: 79.6, end: 90.1 },
          { text: "La estufa, el sofá y las pantuflas, no me interesaban", start: 90.1, end: 100.5 },
          { text: "Yo me quedé en mi casa, para ver cómo giraban", start: 100.5, end: 109.3 },
          { text: "ASÍ ASÍ, TODOS GIRAN ASÍ", start: 109.3, end: 114.0 },
          { text: "ASA ASA, TODOS GIRAN ALLÁ", start: 114.0, end: 118.9 },
          { text: "Vuelve la primavera, el sol calienta en el cielo", start: 118.9, end: 128.3 },
          { text: "Los pajaritos cantan, las flores aparecieron", start: 128.3, end: 136.9 },
          { text: "Y a mí ya me están dando, ganas de viajar de nuevo", start: 136.9, end: 146.6 },
          { text: "VIAJAR VIAJAR, CÓMO ME GUSTA VIAJAR", start: 146.6, end: 153.5 },
          { text: "VIAJAR VIAJAR, CÓMO ME GUSTA VIAJAR", start: 153.5, end: 160.3 },
          { text: "VIAJAR VIAJAR, CÓMO ME GUSTA VIAJAR", start: 160.3, end: 167.2 },
          { text: "VIAJAR VIAJAR, CÓMO ME GUSTA VIAJAR", start: 167.2, end: 174.0 },
          { text: "VIAJAR VIAJAR, VIAJAR VIAJAR VIAJAR", start: 174.0, end: 180.9 },
          { text: "VIAJAR VIAJAR, CÓMO ME GUSTA VIAJAR", start: 180.9, end: 187.7 },
        ],
      },
    ],
  },
  {
    id: "caballo-regalado",
    title: "Caballo Regalado",
    artist: "Cualquier Verdura",
    duration: "2:35",
    durationSecs: 155.5,
    cover: "/assets/album-cover.jpg",
    audioOriginal: "/assets/audio/album/caballo-regalado-voz.mp3",
    audioInstrumental: "/assets/audio/album/caballo-regalado-instrumental.mp3",
    videoUrl: null,
    difficulty: "fácil",
    finishMessage: "¡Muy bien, la rompiste!",
    sections: [
      {
        lines: [
          { text: "Cuántos dichos hemos dicho", start: 0.0, end: 5.1 },
          { text: "Sin medir las consecuencias", start: 5.1, end: 10.4 },
          { text: "Como la historia de mi amigo,", start: 10.4, end: 16.2 },
          { text: "Dueño de un caballo que le regaló el patrón.", start: 16.2, end: 24.8 },
          { text: "Hoy al caballo se le aflojó un diente,", start: 24.8, end: 32.3 },
          { text: "Ningún veterinario lo quiere mirar.", start: 32.3, end: 39.2 },
          { text: "Porque a caballo regalado no se le miran los dientes.", start: 39.2, end: 49.7 },
          { text: "Que aparezca un veterinario, que lo pueda ayudar.", start: 49.7, end: 59.3 },
          { text: "Otra opción es venderlo al pingo,", start: 59.3, end: 65.8 },
          { text: "Que de caballo vendido no hay refrán.", start: 65.8, end: 73.1 },
          { text: "Pero a un caballo con dolor de dientes,", start: 73.1, end: 80.8 },
          { text: "Nadie lo quiere comprar.", start: 80.8, end: 85.5 },
          { text: "Voy a tener que regalarlo.", start: 85.5, end: 90.7 },
          { text: "Creo que ya entiendo, de dónde es el refrán", start: 90.7, end: 99.1 },
          { text: "Porque a caballo regalado no se le miran los dientes.", start: 99.1, end: 109.6 },
          { text: "Que aparezca un veterinario, que lo pueda ayudar.", start: 109.6, end: 119.2 },
          { text: "Que aparezca un veterinario", start: 119.2, end: 124.6 },
          { text: "Que pueda ayudar a mi caballo", start: 124.6, end: 130.3 },
          { text: "Porque a un caballo con dolor de dientes", start: 130.3, end: 138.2 },
          { text: "Nadie lo quiere mirar", start: 138.2, end: 142.3 },
          { text: "Voy a tener que regalarlo", start: 142.3, end: 147.2 },
          { text: "Creo que ya entiendo de dónde es el refrán", start: 147.2, end: 155.5 },
        ],
      },
    ],
  },
  {
    id: "dulces",
    title: "Dulces",
    artist: "Cualquier Verdura",
    duration: "3:12",
    durationSecs: 192.8,
    cover: "/assets/album-cover.jpg",
    audioOriginal: "/assets/audio/album/dulces-voz.mp3",
    audioInstrumental: "/assets/audio/album/dulces-instrumental.mp3",
    videoUrl: null,
    difficulty: "fácil",
    finishMessage: "¡Muy bien, la rompiste!",
    sections: [
      {
        lines: [
          { text: "¡Dulces!", start: 0.0, end: 1.5 },
          { text: "Cómo me gustan a mí los dulces", start: 1.5, end: 7.3 },
          { text: "No me importa romperme las muelas", start: 7.3, end: 13.6 },
          { text: "¡Siempre y cuando yo tenga mis go-lo-si-nas!", start: 13.6, end: 22.0 },
          { text: "¡Dulces!", start: 22.0, end: 23.6 },
          { text: "¡Cómo me gusta a mí comer dulces!", start: 23.6, end: 29.9 },
          { text: "No hay un solo momento del día", start: 29.9, end: 35.6 },
          { text: "Que no piense yo en esas go-lo-si-nas", start: 35.6, end: 42.7 },
          { text: "¡Después de todo solo se vive una vez!", start: 42.7, end: 50.0 },
          { text: "Los dientes me van a volver a crecer", start: 50.0, end: 56.9 },
          { text: "Y ese sabor especial", start: 56.9, end: 60.8 },
          { text: "Que invade mi paladar", start: 60.8, end: 64.8 },
          { text: "Cualquier verdura no me lo daaaa.", start: 64.8, end: 71.1 },
          { text: "¡Dulces!", start: 71.1, end: 72.6 },
          { text: "Cómo me gustan a mí los dulces", start: 72.6, end: 78.4 },
          { text: "No me importa romperme las muelas", start: 78.4, end: 84.7 },
          { text: "¡Siempre y cuando yo tenga mis go-lo-si-nas!", start: 84.7, end: 93.1 },
          { text: "¡Dulces!", start: 93.1, end: 94.7 },
          { text: "¡Cómo me gusta a mí comer dulces!", start: 94.7, end: 101.0 },
          { text: "No hay un solo momento del día", start: 101.0, end: 106.7 },
          { text: "Que no piense yo en esas go-lo-si-nas", start: 106.7, end: 113.8 },
          { text: "¡Después de todo solo se vive una vez!", start: 113.8, end: 121.1 },
          { text: "Los dientes me van a volver a crecer", start: 121.1, end: 128.0 },
          { text: "Y ese sabor especial", start: 128.0, end: 131.9 },
          { text: "Que invade mi paladar", start: 131.9, end: 135.9 },
          { text: "Cualquier verdura no me lo daaaa.", start: 135.9, end: 142.2 },
          { text: "¡Mejor comete vos las verduras!", start: 142.2, end: 148.1 },
          { text: "No pienso cuidar yo mi dentadura", start: 148.1, end: 154.3 },
          { text: "Y cuando empiece a crecer", start: 154.3, end: 159.1 },
          { text: "Veré mis dientes caer", start: 159.1, end: 163.1 },
          { text: "Y solo ahí recordaré", start: 163.1, end: 166.9 },
          { text: "Que me decías", start: 166.9, end: 169.4 },
          { text: "Que me cepille todos los días", start: 169.4, end: 175.0 },
          { text: "Qué tanto dulce hace mal", start: 175.0, end: 179.6 },
          { text: "Que eso me puede afectar", start: 179.6, end: 184.2 },
          { text: "Si sigo así no podré disfrutar de los", start: 184.2, end: 191.3 },
          { text: "¡Dulces!", start: 191.3, end: 192.8 },
        ],
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
    difficulty: "medio",
    finishMessage: "¡Muy bien, la rompiste!",
    sections: [
      {
        lines: [
          { text: "Me voy a ir a buscar", start: 0.0, end: 7.0 },
          { text: "lo que me pidió mamá", start: 7.0, end: 14.0 },
          { text: "me dijo que está ahí", start: 14.0, end: 21.0 },
          { text: "y no lo puedo encontrar", start: 21.0, end: 29.1 },
          { text: "porque no buscas mejor", start: 29.1, end: 36.8 },
          { text: "ella me dijo, me insistió", start: 36.8, end: 45.5 },
          { text: "seguro que si voy", start: 45.5, end: 51.5 },
          { text: "lo encuentro yo", start: 51.5, end: 56.8 },
          { text: "y acá no está", start: 56.8, end: 61.3 },
          { text: "ya no sé dónde más buscar", start: 61.3, end: 70.1 },
          { text: "voy a pedirle ayuda", start: 70.1, end: 76.7 },
          { text: "a mi papá", start: 76.7, end: 79.9 },
          { text: "yo no sé", start: 79.9, end: 82.7 },
          { text: "alguna vez lo intenté", start: 82.7, end: 90.0 },
          { text: "por más que quise", start: 90.0, end: 96.0 },
          { text: "nunca encontré", start: 96.0, end: 100.9 },
          { text: "tu mamá", start: 100.9, end: 103.7 },
          { text: "debe tener un súper poder", start: 103.7, end: 112.5 },
          { text: "hace las cosas", start: 112.5, end: 117.4 },
          { text: "aparecer", start: 117.4, end: 120.2 },
          { text: "y acá no está", start: 120.2, end: 124.7 },
          { text: "ya me cansé de buscar", start: 124.7, end: 132.1 },
          { text: "solo ella sabe", start: 132.1, end: 137.0 },
          { text: "dónde encontrar", start: 137.0, end: 142.2 },
          { text: "me dijo que está ahí", start: 142.2, end: 149.2 },
          { text: "me volvió a repetir", start: 149.2, end: 155.9 },
          { text: "seguro que si voy", start: 155.9, end: 161.8 },
          { text: "lo encuentro yo", start: 161.8, end: 167.1 },
        ],
      },
    ],
  },
  {
    id: "el-baile-de-los-piojos",
    title: "El Baile de los Piojos",
    artist: "Cualquier Verdura",
    duration: "2:35",
    durationSecs: 155.5,
    cover: "/assets/album-cover.jpg",
    audioOriginal: "/assets/audio/album/el-baile-de-los-piojos-voz.mp3",
    audioInstrumental: "/assets/audio/album/el-baile-de-los-piojos-instrumental.mp3",
    videoUrl: null,
    difficulty: "difícil",
    finishMessage: "¡Muy bien, la rompiste!",
    sections: [
      {
        lines: [
          { text: "Todos a bailar el baile de los piojos,", start: 0.0, end: 4.5 },
          { text: "Si me pica la cabeza tengo piojos.", start: 4.5, end: 8.4 },
          { text: "Todos a bailar el baile de los piojos...", start: 8.4, end: 13.1 },
          { text: "¡El baile de los piojos!", start: 13.1, end: 15.9 },
          { text: "Si tenés piojos no pasa nada,", start: 15.9, end: 19.3 },
          { text: "Todos tuvimos en la primaria,", start: 19.3, end: 22.8 },
          { text: "Inclusive tu mamá, preguntale a tu papá", start: 22.8, end: 27.3 },
          { text: "que te suben hasta arriba que te saltan por detrás", start: 27.3, end: 33.2 },
          { text: "si me pican yo me rasco pero ahora", start: 33.2, end: 37.2 },
          { text: "me vuelven a picaaar", start: 37.2, end: 39.5 },
          { text: "Un piojo se le puede contagiar,", start: 39.5, end: 43.2 },
          { text: "a un caballero como a una mujer,", start: 43.2, end: 46.9 },
          { text: "Con vinagre los podés sacar", start: 46.9, end: 50.1 },
          { text: "O con un poco de kerosene", start: 50.1, end: 53.0 },
          { text: "Yo me los quiero sacar pero no puedo", start: 53.0, end: 57.2 },
          { text: "Todos a bailar el baile de los piojos,", start: 57.2, end: 61.7 },
          { text: "Si me pica la cabeza tengo piojos.", start: 61.7, end: 65.7 },
          { text: "Todos a bailar el baile de los piojos...", start: 65.7, end: 70.4 },
          { text: "¡El baile de los piojos!", start: 70.4, end: 73.2 },
          { text: "Yo no voy", start: 73.2, end: 74.2 },
          { text: "a salir", start: 74.2, end: 75.2 },
          { text: "de tu cabeza", start: 75.2, end: 76.6 },
          { text: "yo soy el piojo", start: 76.6, end: 78.3 },
          { text: "mal bicho, dicen que soy", start: 78.3, end: 81.2 },
          { text: "mal bicho, así es como me ven", start: 81.2, end: 84.6 },
          { text: "mal bicho, sequesensen", start: 84.6, end: 87.1 },
          { text: "mal bicho querrequeten", start: 87.1, end: 89.7 },
          { text: "Todos a bailar el baile de los piojos,", start: 89.7, end: 94.2 },
          { text: "Si me pica la cabeza tengo piojos.", start: 94.2, end: 98.2 },
          { text: "Todos a bailar el baile de los piojos...", start: 98.2, end: 102.8 },
          { text: "¡El baile de los piojos!", start: 102.8, end: 105.7 },
          { text: "Un piojo se le puede contagiar,", start: 105.7, end: 109.3 },
          { text: "a un caballero como a una mujer,", start: 109.3, end: 113.0 },
          { text: "Con vinagre los podés sacar", start: 113.0, end: 116.2 },
          { text: "O con un poco de kerosene", start: 116.2, end: 119.1 },
          { text: "Yo me los quiero sacar pero no puedo", start: 119.1, end: 123.4 },
          { text: "Todos a bailar el baile de los piojos,", start: 123.4, end: 127.8 },
          { text: "Si me pica la cabeza tengo piojos.", start: 127.8, end: 131.8 },
          { text: "Todos a bailar el baile de los piojos...", start: 131.8, end: 136.5 },
          { text: "El baile de los piojos...", start: 136.5, end: 139.4 },
          { text: "Todos a bailar el baile de los piojos,", start: 139.4, end: 143.9 },
          { text: "Si me pica la cabeza tengo piojos.", start: 143.9, end: 147.9 },
          { text: "Todos a bailar el baile de los piojos...", start: 147.9, end: 152.6 },
          { text: "El baile de los piojos...", start: 152.6, end: 155.5 },
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
    finishMessage: "Solo de guitarra",
    sections: [
      {
        lines: [
          { text: "Me dijeron que en el Reino del Revés", start: 0.0, end: 7.9 },
          { text: "Nada el pájaro y vuela el pez", start: 7.9, end: 14.2 },
          { text: "Que los gatos no hacen miau y dicen yes", start: 14.2, end: 22.7 },
          { text: "Porque estudian mucho inglés", start: 22.7, end: 28.8 },
          { text: "Vamos a ver cómo es", start: 28.8, end: 33.0 },
          { text: "El Reino del Revés", start: 33.0, end: 36.9 },
          { text: "Vamos a ver cómo es", start: 36.9, end: 41.1 },
          { text: "El Reino del Revés", start: 41.1, end: 45.0 },
          { text: "Me dijeron que en el Reino del Revés", start: 45.0, end: 52.9 },
          { text: "Nadie baila con los pies", start: 52.9, end: 58.1 },
          { text: "Que un ladrón es vigilante y otro es juez", start: 58.1, end: 67.1 },
          { text: "Y que dos y dos son tres", start: 67.1, end: 72.3 },
          { text: "Vamos a ver cómo es", start: 72.3, end: 76.4 },
          { text: "El Reino del Revés", start: 76.4, end: 80.4 },
          { text: "Vamos a ver cómo es", start: 80.4, end: 84.5 },
          { text: "El Reino del Revés", start: 84.5, end: 88.5 },
          { text: "Me dijeron que en el Reino del Revés", start: 88.5, end: 96.3 },
          { text: "Cabe un oso en una nuez", start: 96.3, end: 101.3 },
          { text: "Que usan barbas y bigotes los bebés", start: 101.3, end: 109.0 },
          { text: "Y que un año dura un mes", start: 109.0, end: 114.2 },
          { text: "Vamos a ver cómo es", start: 114.2, end: 118.4 },
          { text: "El Reino del Revés", start: 118.4, end: 122.3 },
          { text: "Vamos a ver cómo es", start: 122.3, end: 126.5 },
          { text: "El Reino del Revés", start: 126.5, end: 130.4 },
        ],
      },
    ],
  },
  {
    id: "se-hace-tarde",
    title: "Se Hace Tarde",
    artist: "Cualquier Verdura",
    duration: "3:36",
    durationSecs: 216.7,
    cover: "/assets/album-cover.jpg",
    audioOriginal: "/assets/audio/album/se-hace-tarde-voz.mp3",
    audioInstrumental: "/assets/audio/album/se-hace-tarde-instrumental.mp3",
    videoUrl: null,
    difficulty: "medio",
    finishMessage: "¡Muy bien, la rompiste!",
    sections: [
      {
        lines: [
          { text: "Todas las veces que decía", start: 0.0, end: 8.1 },
          { text: "que comas toda la comida", start: 8.1, end: 15.8 },
          { text: "todas las veces que un dulce te negué", start: 15.8, end: 27.7 },
          { text: "era por tu propio bien", start: 27.7, end: 34.8 },
          { text: "Cada vez que te mandaba", start: 34.8, end: 42.2 },
          { text: "a ponerte más abrigo", start: 42.2, end: 48.7 },
          { text: "por más que vos no sientas", start: 48.7, end: 57.1 },
          { text: "que hace frío abrigate igual", start: 57.1, end: 66.1 },
          { text: "o te podés enfermar", start: 66.1, end: 72.2 },
          { text: "vestite, bañate, abrigate", start: 72.2, end: 80.3 },
          { text: "lavate los dientes, andá a peinarte", start: 80.3, end: 91.6 },
          { text: "ordená tu cuarto, acostate", start: 91.6, end: 100.0 },
          { text: "levantate, se hace tarde", start: 100.0, end: 107.7 },
          { text: "ooh, se hace tarde", start: 107.7, end: 113.5 },
          { text: "mamá no quiero abrigarme", start: 113.5, end: 121.2 },
          { text: "papá no cocines más verduras", start: 121.2, end: 130.3 },
          { text: "yo quiero comer golosinas todo el día", start: 130.3, end: 142.2 },
          { text: "y no me pienso ir a peinar", start: 142.2, end: 150.6 },
          { text: "lalala no me quiero peinar", start: 150.6, end: 159.0 },
          { text: "lalala ni bañar", start: 159.0, end: 163.8 },
          { text: "mamá eso era mentira", start: 163.8, end: 170.3 },
          { text: "te prometo que me voy a portar muy bien", start: 170.3, end: 182.8 },
          { text: "pero acordate que la niñez es una vez", start: 182.8, end: 194.8 },
          { text: "y yo la quiero disfrutar", start: 194.8, end: 202.5 },
          { text: "lalala yo quiero disfrutar", start: 202.5, end: 210.9 },
          { text: "lalala disfrutarla", start: 210.9, end: 216.7 },
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
    finishMessage: "¡Muy bien, la rompiste!",
    sections: [
      {
        lines: [
          { text: "Yo solo soy", start: 0.0, end: 4.1 },
          { text: "Un pequeño pajarito", start: 4.1, end: 11.1 },
          { text: "Alejado del montón.", start: 11.1, end: 18.1 },
          { text: "Todos volando menos yo.", start: 18.1, end: 26.6 },
          { text: "Acá estoy", start: 26.6, end: 30.0 },
          { text: "Entre los dedos de un chabón.", start: 30.0, end: 40.7 },
          { text: "No me quiere soltar,", start: 40.7, end: 48.1 },
          { text: "Se la quiere asegurar.", start: 48.1, end: 56.2 },
          { text: "Y yo extraño a mi bandada.", start: 56.2, end: 65.9 },
          { text: "Volar el cielo en libertad.", start: 65.9, end: 75.9 },
          { text: "Recorrer el mundo.", start: 75.9, end: 82.5 },
          { text: "Volando siempre en libertad.", start: 82.5, end: 92.9 },
          { text: "Es mejor pájaro en mano", start: 92.9, end: 101.4 },
          { text: "Que cien pájaros volando.", start: 101.4, end: 110.6 },
          { text: "Nadie pensó en mí.", start: 110.6, end: 117.3 },
          { text: "Cuando hicieron el refrán.", start: 117.3, end: 126.9 },
          { text: "Y yo extraño a mi bandada.", start: 126.9, end: 136.6 },
          { text: "Volar el cielo en libertad.", start: 136.6, end: 146.5 },
          { text: "Recorrer el mundo.", start: 146.5, end: 153.2 },
          { text: "Volando siempre en libertad.", start: 153.2, end: 163.6 },
          { text: "Oh oh oh oh oh", start: 163.6, end: 168.7 },
          { text: "ooooohh en libertad", start: 168.7, end: 175.8 },
          { text: "Oh oh oh oh oh", start: 175.8, end: 181.0 },
          { text: "ooooohh en libertad", start: 181.0, end: 188.0 },
          { text: "Oh oh oh oh oh", start: 188.0, end: 193.2 },
          { text: "ooooohh en libertad", start: 193.2, end: 200.2 },
        ],
      },
    ],
  },
  {
    id: "rock-and-colors",
    title: "Rock & Colors",
    artist: "Cualquier Verdura",
    duration: "3:31",
    durationSecs: 211.6,
    cover: "/assets/album-cover.jpg",
    audioOriginal: "/assets/audio/album/rock-and-colors-voz.mp3",
    audioInstrumental: "/assets/audio/album/rock-and-colors-instrumental.mp3",
    videoUrl: null,
    difficulty: "medio",
    finishMessage: "¡Muy bien, la rompiste!",
    sections: [
      {
        lines: [
          { text: "Está muy bien, si esta vez, decidís mezclar los colores", start: 0.0, end: 24.2 },
          { text: "Rojo amarillo y azul también, puedes hacer muchas combinaciones", start: 24.2, end: 51.9 },
          { text: "Son los colores primarios", start: 51.9, end: 62.9 },
          { text: "ROJO AMARILLO Y AZUL, HACEN VERDE VIOLETA Y NARANJA", start: 62.9, end: 85.3 },
          { text: "TODOS ESOS COLORES Y MUCHOS MÁS, TÚ PODRÁS COMBINAR", start: 85.3, end: 107.8 },
          { text: "Azul y amarillo da verde, como el color de un melón", start: 107.8, end: 130.2 },
          { text: "Azul con rojo es morado, como un tomate en mal estado", start: 130.2, end: 153.5 },
          { text: "Rojo y amarillo, es anaranjado", start: 153.5, end: 166.7 },
          { text: "ROJO AMARILLO Y AZUL, HACEN VERDE VIOLETA Y NARANJA", start: 166.7, end: 189.2 },
          { text: "TODOS ESOS COLORES Y MUCHOS MÁS, TÚ PODRÁS COMBINAR", start: 189.2, end: 211.6 },
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
