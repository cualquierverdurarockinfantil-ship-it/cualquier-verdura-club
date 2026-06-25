// ============================================
// CLUB VERDURA - CENTRAL DATA STORE
// Edit this file to update all content
// ============================================

export const ALBUM = {
  title: "La Niñez Es Una Vez",
  artist: "Cualquier Verdura",
  year: 2024,
  cover: "/assets/album-cover.jpg",
  coverAlt: "Portada del disco La Niñez Es Una Vez",
  streamingLinks: {
    spotify: "https://open.spotify.com/",
    youtube: "https://youtube.com/",
    appleMusic: "https://music.apple.com/",
  },
  tracks: [
    {
      id: 1,
      title: "Super poder",
      duration: "",
      character: "tomate",
      lyrics: "",
      description: "",
    },
    {
      id: 2,
      title: "Rock n colors",
      duration: "",
      character: "zanahoria",
      lyrics: "",
      description: "",
    },
    {
      id: 3,
      title: "Dulces",
      duration: "",
      character: "berenjena",
      lyrics: "",
      description: "",
    },
    {
      id: 4,
      title: "Así Asá",
      duration: "",
      character: "choclo",
      lyrics: "",
      description: "",
    },
    {
      id: 5,
      title: "El baile de los piojos",
      duration: "",
      character: "cebolla",
      lyrics: "",
      description: "",
    },
    {
      id: 6,
      title: "Es muy tarde",
      duration: "",
      character: "brocoli",
      lyrics: "",
      description: "",
    },
    {
      id: 7,
      title: "Caballo Regalao",
      duration: "",
      character: "calabaza",
      lyrics: "",
      description: "",
    },
    {
      id: 8,
      title: "Pájaros volando",
      duration: "",
      character: "rabanito",
      lyrics: "",
      description: "",
    },
    {
      id: 9,
      title: "El reino del revés",
      duration: "",
      character: "tomate",
      lyrics: "",
      description: "",
    },
  ],
};

// Character image URLs (comic-style illustrations provided by the brand)
export const VEG_IMAGES = {
  tomate: "/assets/veg/tomate.svg",
  berenjena: "/assets/veg/berenjena.png",
  zanahoria: "/assets/veg/zanahoria.png",
  brocoli: "/assets/veg/brocoli.png",
  cebolla: "/assets/veg/cebolla.png",
  choclo: "/assets/veg/choclo.png",
  calabaza: "/assets/veg/calabaza.png",
  rabanito: "/assets/veg/rabanito.png",
};

export const KID_IMAGES = {
  nio1: "/assets/nios/nio1.png",
  nio2: "/assets/nios/nio2.png",
  nio3: "/assets/nios/nio3.png",
  nio4: "/assets/nios/nio4.png",
  nio5: "/assets/nios/nio5.png",
};

export const VEGETABLES = [
  {
    id: "tomate",
    name: "Tomate",
    color: "#ef4444",
    role: "El líder enérgico",
    instrument: "Guitarra eléctrica",
    personality: "Apasionado, explosivo y siempre el primero en saltar al escenario. Es el corazón del grupo.",
    curiosity: "Dicen que su gorro de hojas verdes le da superpoderes musicales.",
    image: VEG_IMAGES.tomate,
    animationClass: "animate-rock",
  },
  {
    id: "berenjena",
    name: "Berenjena",
    color: "#a855f7",
    role: "Actitud rebelde",
    instrument: "Bajo eléctrico",
    personality: "Misteriosa, cool y siempre con su propia onda. Nunca sigue las reglas... musicales.",
    curiosity: "Sus pulseras de colores son talismanes de buena suerte en los shows.",
    image: VEG_IMAGES.berenjena,
    animationClass: "animate-breathe",
  },
  {
    id: "zanahoria",
    name: "Zanahoria",
    color: "#f97316",
    role: "Explosividad rockera",
    instrument: "Voz / Cantante",
    personality: "La energía del grupo. Siempre gritando, siempre en movimiento. Hace los mejores solos vocales.",
    curiosity: "Come zanahoria antes de cada show para tener más energía. ¡Funciona!",
    image: VEG_IMAGES.zanahoria,
    animationClass: "animate-wiggle",
  },
  {
    id: "brocoli",
    name: "Brócoli",
    color: "#22c55e",
    role: "La calma del grupo",
    instrument: "Batería",
    personality: "El más tranquilo pero cuando llega a la batería todo cambia. Ritmo perfecto, siempre.",
    curiosity: "Sus ramas son perfectas para hacer redobles increíbles.",
    image: VEG_IMAGES.brocoli,
    animationClass: "animate-breathe-slow",
  },
  {
    id: "cebolla",
    name: "Cebolla",
    color: "#facc15",
    role: "La dulce del grupo",
    instrument: "Teclados",
    personality: "Aunque llores al verla, te saca una sonrisa siempre. Sus melodías son pura magia.",
    curiosity: "Tiene las pulseras de color rosa más brillantes del grupo.",
    image: VEG_IMAGES.cebolla,
    animationClass: "animate-float",
  },
  {
    id: "choclo",
    name: "Choclo",
    color: "#d97706",
    role: "El más punk",
    instrument: "Guitarra rítmica",
    personality: "Con su cresta punk y su actitud de guerrero, el Choclo siempre está listo para el mosh.",
    curiosity: "Cada pelito de su cabeza es una cuerda de guitarra en potencia.",
    image: VEG_IMAGES.choclo,
    animationClass: "animate-rock",
  },
  {
    id: "calabaza",
    name: "Calabaza",
    color: "#f97316",
    role: "El showman total",
    instrument: "Productor / DJ",
    personality: "Siempre con los brazos arriba, es el que genera más energía en el público.",
    curiosity: "Dice que sus manos en alto son para llamar a los espíritus del rock.",
    image: VEG_IMAGES.calabaza,
    animationClass: "animate-float-slow",
  },
  {
    id: "rabanito",
    name: "Rabanito",
    color: "#ec4899",
    role: "La sorpresa del grupo",
    instrument: "Percusión / Pandero",
    personality: "Pequeño pero lleno de actitud. Lo que le falta de tamaño lo compensa con actitud.",
    curiosity: "Es el favorito de los más pequeños del Club Verdura.",
    image: VEG_IMAGES.rabanito,
    animationClass: "animate-breathe",
  },
];

export const KIDS_CHARACTERS = [
  {
    id: "nina1",
    name: "Valentina",
    image: KID_IMAGES.nio1,
    description: "Fan número uno de Cualquier Verdura. Siempre con sus gafas amarillas y su actitud de estrella.",
    color: "#ec4899",
  },
  {
    id: "nino2",
    name: "Ramiro",
    image: KID_IMAGES.nio2,
    description: "Punk hasta los huesos. Su cresta bicolor lo hace inconfundible en todos los shows.",
    color: "#a855f7",
  },
  {
    id: "nina3",
    name: "Sol",
    image: KID_IMAGES.nio3,
    description: "Siempre bailando, siempre sonriendo. Es el alma de la fiesta del Club Verdura.",
    color: "#f97316",
  },
  {
    id: "nino4",
    name: "Tomás",
    image: KID_IMAGES.nio4,
    description: "Los cuernos de rock son su marca registrada. Siempre en la primera fila.",
    color: "#22c55e",
  },
  {
    id: "nino5",
    name: "Mateo",
    image: KID_IMAGES.nio5,
    description: "El más relajado pero también el que más sabe de música. Sus gafas violetas son legendarias.",
    color: "#06b6d4",
  },
];

export const VIDEOS = [
  {
    id: 1,
    title: "Un Buen Plan - Videoclip Oficial",
    type: "videoclip",
    thumbnail: "/assets/fondo-plaza.jpg",
    youtubeId: "",
    youtubeUrl: "https://youtu.be/_CIjJpfptaA",
    description: "El videoclip oficial de Un Buen Plan, el primer single del disco.",
  },
  {
    id: 2,
    title: "La Gran Manada - Videoclip Oficial",
    type: "videoclip",
    thumbnail: "/assets/karaoke/cover-gran-manada.png",
    youtubeId: "",
    youtubeUrl: "https://youtu.be/ijV2LFd25qw",
    description: "El videoclip oficial de La Gran Manada.",
  },
];

export const KARAOKE_SONGS = [
  {
    id: 1,
    title: "Super poder",
    character: "tomate",
    difficulty: "fácil",
    youtubeUrl: "https://youtube.com/",
    lyrics: "",
  },
  {
    id: 2,
    title: "Rock n colors",
    character: "zanahoria",
    difficulty: "medio",
    youtubeUrl: "https://youtube.com/",
    lyrics: "",
  },
];

export const PHOTOS = [
  {
    id: 1,
    src: "/assets/fotos/foto-01.jpg",
    alt: "Tapa del disco",
    category: "backstage",
    title: "La Niñez Es Una Vez",
    type: "image",
  },
  {
    id: 2,
    src: "/assets/fondo-plaza.jpg",
    alt: "El parque de Cualquier Verdura",
    category: "tacuarock",
    title: "El Parque",
    type: "image",
  },
  {
    id: 3,
    src: "/assets/fotos/foto-03.png",
    alt: "Portada plaza",
    category: "tacuarock",
    title: "Plaza Verdura",
    type: "image",
  },
  // Ejemplo de video — agregá los videos con type: "video":
  // {
  //   id: 4,
  //   src: "URL_DEL_VIDEO.mp4",
  //   alt: "Video en vivo",
  //   category: "vivos",
  //   title: "En vivo",
  //   type: "video",
  // },
];

export const SHOWS = [
  // Agregar shows aquí. Si está vacío, la sección se oculta automáticamente.
  // Ejemplo:
  // {
  //   id: 1,
  //   date: "2024-08-15",
  //   venue: "Teatro Gran Rex",
  //   city: "Buenos Aires",
  //   country: "Argentina",
  //   ticketsUrl: "https://",
  //   isSoldOut: false,
  // },
];

export const NEWS = [
  // Agregar novedades aquí. Si está vacío, la sección se oculta.
  // Ejemplo:
  // {
  //   id: 1,
  //   title: "¡Nuevo video disponible!",
  //   content: "Ya podés ver el video de El Ritmo del Jardín en YouTube.",
  //   date: "2024-06-01",
  //   type: "video",
  //   image: "https://...",
  //   link: "https://youtube.com/",
  // },
];

export const TACUAROCK = {
  name: "Tacuarock",
  edition: "2024",
  description: "El festival de rock para toda la familia. Un espacio donde la música, el arte y la diversión se juntan.",
  longDescription: "Tacuarock es el festival de Cualquier Verdura donde todo es posible. Escenarios, talleres, shows sorpresa y la mejor vibra para grandes y chicos.",
  image: "/assets/fondo-plaza.jpg",
  highlights: [
    "Shows en vivo",
    "Talleres de música",
    "Área de arte y dibujo",
    "Zona de juegos",
    "Merch exclusivo",
  ],
  upcomingDate: null, // Set to "2024-09-21" when confirmed
  socialLinks: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
  },
};

export const GAMES = [
  {
    id: "memoria",
    title: "Memoria Verdura",
    description: "Encontrá los pares de verduras. ¡Cuanto más rápido, mejor!",
    icon: "🧠",
    color: "#22c55e",
    available: true,
  },
  {
    id: "adivina-cancion",
    title: "Adiviná la Canción",
    description: "Escuchá un fragmento y adiviná qué canción es. ¡Sumá puntos y ganá!",
    icon: "🎵",
    color: "#ec4899",
    available: true,
  },
  {
    id: "desafios",
    title: "Desafíos Verdura",
    description: "Sacá una tarjeta y cumplí el desafío. ¡Rápido y divertido!",
    icon: "🎲",
    color: "#a855f7",
    available: true,
  },
  {
    id: "verdura-misteriosa",
    title: "Verdura Misteriosa",
    description: "Adiviná la verdura usando pistas progresivas. ¡Solo o en familia!",
    icon: "🥦",
    color: "#22c55e",
    available: true,
  },
];

export const DRAWINGS = [
  {
    id: 1,
    title: "Tomate Rockero",
    description: "Dibujo del Tomate para colorear",
    pdfUrl: "/assets/dibujos/tomate.pdf",
    thumbnail: VEG_IMAGES.tomate,
  },
  {
    id: 2,
    title: "Berenjena Cool",
    description: "Dibujo de la Berenjena para colorear",
    pdfUrl: "/assets/dibujos/berenjena.pdf",
    thumbnail: VEG_IMAGES.berenjena,
  },
  {
    id: 3,
    title: "Zanahoria Rockera",
    description: "Dibujo de la Zanahoria para colorear",
    pdfUrl: "/assets/dibujos/zanahoria.pdf",
    thumbnail: VEG_IMAGES.zanahoria,
  },
  {
    id: 4,
    title: "Brócoli Baterista",
    description: "Dibujo del Brócoli para colorear",
    pdfUrl: "/assets/dibujos/brocoli.pdf",
    thumbnail: VEG_IMAGES.brocoli,
  },
  {
    id: 5,
    title: "Cebolla Tecladista",
    description: "Dibujo de la Cebolla para colorear",
    pdfUrl: "/assets/dibujos/cebolla.pdf",
    thumbnail: VEG_IMAGES.cebolla,
  },
  {
    id: 6,
    title: "Choclo Punk",
    description: "Dibujo del Choclo para colorear",
    pdfUrl: "/assets/dibujos/choclo.pdf",
    thumbnail: VEG_IMAGES.choclo,
  },
  {
    id: 7,
    title: "Calabaza Showman",
    description: "Dibujo de la Calabaza para colorear",
    pdfUrl: "/assets/dibujos/calabaza.pdf",
    thumbnail: VEG_IMAGES.calabaza,
  },
  {
    id: 8,
    title: "Rabanito Sorpresa",
    description: "Dibujo del Rabanito para colorear",
    pdfUrl: "/assets/dibujos/rabanito.pdf",
    thumbnail: VEG_IMAGES.rabanito,
  },
];

// Social media links
export const SOCIAL = {
  instagram: "https://www.instagram.com/cualquierverdurarock?igsh=MWhvMmNmbGF0N3hrYQ==",
  youtube: "https://www.youtube.com/@cualquierverdurarockinfantil?si=SVuNx0tfZsoUOzFl",
  spotify: "https://open.spotify.com/artist/14XkiZnZG923Qir9WCzL2p?si=HZwbd2v6T86kL-JQQEV0Sg",
  tiktok: "https://www.tiktok.com/@cualquierverdurarock",
  facebook: "https://www.facebook.com/share/1CUWfas35D/",
};

// Navigation sections config
export const SECTIONS = [
  { id: "canciones", label: "Escuchá Todo", emoji: "🎶", color: "#22c55e", path: "/canciones" },
  { id: "videos", label: "Cine Verdura", emoji: "🎬", color: "#06b6d4", path: "/videos" },
  { id: "karaoke", label: "Karaoke", emoji: "🎤", color: "#ec4899", path: "/karaoke" },
  { id: "fotos", label: "Galería", emoji: "📸", color: "#facc15", path: "/fotos" },
  { id: "acordes", label: "Toca las Canciones", emoji: "🎸", color: "#a855f7", path: "/acordes" },
  { id: "shows", label: "Shows", emoji: "🎪", color: "#f97316", path: "/shows", hideWhenEmpty: true },
  { id: "novedades", label: "Novedades", emoji: "📢", color: "#ec4899", path: "/novedades", hideWhenEmpty: true },
  { id: "juegos", label: "Juegos", emoji: "🎮", color: "#06b6d4", path: "/juegos" },
  { id: "dibujos", label: "Dibujos", emoji: "✏️", color: "#facc15", path: "/dibujos" },
  { id: "verduras", label: "Verduras", emoji: "🥦", color: "#22c55e", path: "/verduras" },
];