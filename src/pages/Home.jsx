import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ALBUM, VEGETABLES, SHOWS, NEWS, VEG_IMAGES, KID_IMAGES } from "@/lib/clubData";
import SectionHeader from "@/components/cv/SectionHeader";
import FloatingCharacters from "@/components/cv/FloatingCharacters";

function HeroSection() {
  return (
    // h-screen exacto + overflow hidden para que no se vea nada de abajo
    <section className="relative flex flex-col overflow-hidden bg-white h-screen px-4">

      <FloatingCharacters />

      {/* Contenido: ocupa toda la altura, distribuido de arriba a abajo */}
      <div
        className="relative z-10 flex flex-col items-center justify-between w-full max-w-lg mx-auto h-full py-4 md:py-8 gap-3"
      >

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full flex justify-center"
        >
          <img
            src="/assets/letras-horizontal.svg"
            alt="Cualquier Verdura"
            className="h-10 md:h-16 w-auto"
          />
        </motion.div>

        {/* Album Cover */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: -2 }}
          transition={{ duration: 0.7, delay: 0.2, type: "spring" }}
          whileHover={{ rotate: 2, scale: 1.05 }}
          className="relative flex-shrink-0"
        >
          <motion.div
            className="absolute -right-6 -bottom-4 w-36 h-36 md:w-52 md:h-52 rounded-full z-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{
              background: "radial-gradient(circle at 50% 50%, #555 0%, #111 40%, #333 60%, #111 100%)",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-5 h-5 rounded-full bg-white/20" />
            </div>
          </motion.div>
          <img
            src={ALBUM.cover}
            alt={ALBUM.title}
            className="relative z-10 w-36 h-36 md:w-52 md:h-52 rounded-2xl object-cover"
            style={{ border: "4px solid #1a1a1a", boxShadow: "6px 6px 0 #1a1a1a" }}
          />
        </motion.div>

        {/* Título disco */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl md:text-5xl font-bangers text-cv-dark leading-tight tracking-wide">
            La Niñez Es Una Vez
          </h1>
          <p className="mt-0.5 text-sm md:text-base font-fredoka text-gray-500">
            El nuevo disco de{" "}
            <span className="font-bangers text-cv-green text-sm md:text-lg" style={{ letterSpacing: "0.04em" }}>
              Cualquier Verdura
            </span>
          </p>
        </motion.div>

        {/* Botones CTA */}
        <motion.div
          className="flex flex-col sm:flex-row gap-2 w-full justify-center"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Link to="/canciones" className="btn-cv-primary text-base md:text-lg px-6 py-3 text-center">
            Escuchá Todo
          </Link>
          <Link to="/karaoke" className="btn-cv-secondary text-base md:text-lg px-6 py-3 text-center">
            Cantá Nuestras Canciones
          </Link>
        </motion.div>

        {/* Banner del show — siempre al fondo, visible completo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="w-full"
        >
          <div
            className="rounded-2xl px-4 py-3 md:px-6 md:py-4 text-center"
            style={{
              background: "linear-gradient(135deg, #E6302B 0%, #92338A 100%)",
              border: "3px solid #1a1a1a",
              boxShadow: "5px 5px 0 #1a1a1a",
            }}
          >
            <p className="font-bangers text-white text-xs tracking-widest uppercase mb-0.5">
              🎸 Próximo show en vivo
            </p>
            <p className="font-bangers text-white text-xl md:text-2xl tracking-wide leading-tight">
              Presentación del Disco
            </p>
            <p className="font-bangers text-yellow-300 text-base tracking-wide">
              16 de agosto · Día del Niño
            </p>
            <p className="font-fredoka text-white/90 text-sm">
              Teatro Cervantes · Coronel Suárez
            </p>
            <div
              className="inline-block mt-1.5 px-4 py-1 rounded-full font-bangers text-sm tracking-wider"
              style={{ background: "#FFED00", color: "#1a1a1a", border: "2px solid #1a1a1a" }}
            >
              🎟 Entrada Libre y Gratuita
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

function WelcomeSection() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(/assets/fondo-plaza.jpg)` }} />
      <div className="absolute inset-0 bg-white/80" />
      <motion.img src={KID_IMAGES.nio2} alt="" className="absolute left-0 bottom-0 w-28 md:w-40 object-contain pointer-events-none" style={{ zIndex: 2 }} animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} />
      <motion.img src={KID_IMAGES.nio1} alt="" className="absolute right-0 bottom-0 w-28 md:w-40 object-contain pointer-events-none" style={{ zIndex: 2 }} animate={{ y: [0, -8, 0] }} transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }} />
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <h2 className="text-5xl md:text-6xl font-bangers text-cv-dark mb-6 tracking-wide">Bienvenidos al<br /><span className="text-cv-fuchsia">Club Verdura</span></h2>
          <p className="text-lg md:text-xl font-fredoka text-gray-700 leading-relaxed">Somos el fan club digital de <strong>Cualquier Verdura</strong>. Un lugar donde la música, los personajes y la diversión se juntan.</p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            {[
              { label: "Escuchá Todo", path: "/canciones" },
              { label: "Verduras", path: "/verduras" },
              { label: "Cine Verdura", path: "/videos" },
              { label: "Karaoke", path: "/karaoke" },
              { label: "Galería", path: "/fotos" },
              { label: "Toca las Canciones", path: "/acordes" },
              { label: "Juegos", path: "/juegos" },
              { label: "Dibujos", path: "/dibujos" },
              ...(SHOWS.length > 0 ? [{ label: "Shows", path: "/shows" }] : []),
              ...(NEWS.length > 0 ? [{ label: "Novedades", path: "/novedades" }] : []),
            ].map((item) => (
              <Link key={item.path} to={item.path} className="px-4 py-2 rounded-full font-bangers text-base bg-white text-cv-dark tracking-wider hover:bg-cv-yellow transition-colors" style={{ border: "2px solid #1a1a1a" }}>{item.label}</Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CharactersPreview() {
  return (
    <section className="py-20 px-4 bg-cv-green/5">
      <div className="max-w-6xl mx-auto">
        <SectionHeader title="La Banda" subtitle="Las verduras rockeras más famosas del jardín" color="#22c55e" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {VEGETABLES.map((veg, i) => (
            <motion.div key={veg.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
              <Link to="/verduras">
                <motion.div className="card-cv p-4 text-center" whileHover={{ scale: 1.05 }} style={{ background: veg.color + "15" }}>
                  <motion.div className="flex justify-center mb-3" animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 2 + i * 0.4, repeat: Infinity }}>
                    <img src={veg.image} alt={veg.name} className="w-24 h-24 object-contain" />
                  </motion.div>
                  <h3 className="font-bangers text-cv-dark text-xl tracking-wider">{veg.name}</h3>
                  <p className="text-sm font-fredoka text-gray-500 mt-1">{veg.role}</p>
                  <span className="mt-2 inline-block text-xs font-fredoka text-gray-400">{veg.instrument}</span>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="text-center"><Link to="/verduras" className="btn-cv-primary">Entrá a Conocer los Fans</Link></div>
      </div>
    </section>
  );
}

function AlbumPreview() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <SectionHeader title="El Disco" subtitle="La Niñez Es Una Vez" color="#ef4444" />
        <div className="flex flex-col items-center gap-8">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <motion.img src={ALBUM.cover} alt={ALBUM.title} className="w-56 h-56 md:w-72 md:h-72 rounded-2xl object-cover" style={{ border: "4px solid #1a1a1a", boxShadow: "8px 8px 0 #1a1a1a" }} animate={{ rotate: [-1, 1, -1] }} transition={{ duration: 4, repeat: Infinity }} />
          </motion.div>
          <Link to="/canciones" className="btn-cv-primary text-xl px-12 py-5">Escuchalo Ahora</Link>
        </div>
      </div>
    </section>
  );
}

function KidsBanner() {
  return (
    <section className="py-16 px-4 overflow-hidden" style={{ background: "#facc1510" }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-end justify-center gap-4 md:gap-8">
          {[KID_IMAGES.nio1, KID_IMAGES.nio2, KID_IMAGES.nio3, KID_IMAGES.nio4, KID_IMAGES.nio5].map((src, i) => (
            <motion.img key={i} src={src} alt={`Fan ${i + 1}`} className="object-contain" style={{ width: i === 2 ? 140 : 100, height: i === 2 ? 140 : 100 }} animate={{ y: [0, -(6 + i * 3), 0], rotate: [-3 + i, 3 - i, -3 + i] }} transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: "easeInOut" }} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} />
          ))}
        </div>
        <motion.p className="text-center font-bangers text-3xl md:text-4xl text-cv-dark mt-6 tracking-wider" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>¡El club ya está abierto!</motion.p>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div>
      <HeroSection />
      <WelcomeSection />
      <AlbumPreview />
      <CharactersPreview />
      <KidsBanner />
    </div>
  );
}
