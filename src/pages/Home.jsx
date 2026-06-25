import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ALBUM, VEGETABLES, SHOWS, NEWS, VEG_IMAGES, KID_IMAGES } from "@/lib/clubData";
import SectionHeader from "@/components/cv/SectionHeader";
import FloatingCharacters from "@/components/cv/FloatingCharacters";

// ---- Hero Section ----
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white py-20 px-4">
      <FloatingCharacters />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Logo SVG */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <img
            src="/assets/letras-horizontal.svg"
            alt="Cualquier Verdura"
            className="h-20 md:h-32 mx-auto"
          />
        </motion.div>

        {/* Album Cover - THE PROTAGONIST flanked by real characters */}
        <div className="flex items-center justify-center gap-6 md:gap-12">
          {/* Left: Tomate rockero */}
          <motion.div
            className="hidden md:block flex-shrink-0"
            animate={{ rotate: [-8, 8, -8], y: [0, -12, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
          >
            <img
              src={VEG_IMAGES.tomate}
              alt="Tomate rockero"
              className="w-40 h-40 object-contain"
            />
          </motion.div>

          {/* Album cover center */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: -2 }}
            transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
            whileHover={{ rotate: 2, scale: 1.05 }}
            className="relative flex-shrink-0"
          >
            {/* Vinyl record behind */}
            <motion.div
              className="absolute -right-8 -bottom-6 w-52 h-52 md:w-64 md:h-64 rounded-full z-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{
                background: "radial-gradient(circle at 50% 50%, #555 0%, #111 40%, #333 60%, #111 100%)",
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-white/20" />
              </div>
            </motion.div>

            {/* Album cover */}
            <img
              src={ALBUM.cover}
              alt={ALBUM.title}
              className="relative z-10 w-52 h-52 md:w-64 md:h-64 rounded-2xl object-cover"
              style={{ border: "4px solid #1a1a1a", boxShadow: "8px 8px 0 #1a1a1a" }}
            />
          </motion.div>

          {/* Right: Zanahoria */}
          <motion.div
            className="hidden md:block flex-shrink-0"
            animate={{ rotate: [8, -8, 8], y: [0, -8, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          >
            <img
              src={VEG_IMAGES.zanahoria}
              alt="Zanahoria rockera"
              className="w-36 h-36 object-contain"
            />
          </motion.div>
        </div>

        {/* Album title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bangers text-cv-dark leading-tight tracking-wide">
            La Niñez Es Una Vez
          </h1>
          <p className="mt-3 text-xl md:text-2xl font-fredoka text-gray-500">
            El nuevo disco de{" "}
            <span
              className="font-bangers text-cv-green text-2xl md:text-3xl"
              style={{ letterSpacing: "0.04em" }}
            >
              Cualquier Verdura
            </span>
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <Link to="/canciones" className="btn-cv-primary text-xl px-10 py-5">
            Escuchá Todo
          </Link>
          <Link to="/karaoke" className="btn-cv-secondary text-xl px-10 py-5">
            Cantá Nuestras Canciones
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="mt-16 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <span className="text-sm font-fredoka text-gray-400">Scrolleá para explorar</span>
          <div className="w-6 h-10 rounded-full border-2 border-gray-300 flex items-start justify-center p-1">
            <motion.div
              className="w-1.5 h-3 rounded-full bg-cv-green"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ---- Welcome Section ---- (park image as background)
function WelcomeSection() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Park as background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(/assets/fondo-plaza.jpg)`,
        }}
      />
      <div className="absolute inset-0 bg-white/80" />

      {/* Peeping characters on the sides */}
      <motion.img
        src={KID_IMAGES.nio2}
        alt="Nene punk"
        className="absolute left-0 bottom-0 w-28 md:w-40 object-contain pointer-events-none"
        style={{ zIndex: 2 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.img
        src={KID_IMAGES.nio1}
        alt="Nena con gafas"
        className="absolute right-0 bottom-0 w-28 md:w-40 object-contain pointer-events-none"
        style={{ zIndex: 2 }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
      />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-5xl md:text-6xl font-bangers text-cv-dark mb-6 tracking-wide">
            Bienvenidos al<br />
            <span className="text-cv-fuchsia">Club Verdura</span>
          </h2>
          <p className="text-lg md:text-xl font-fredoka text-gray-700 leading-relaxed">
            Somos el fan club digital de <strong>Cualquier Verdura</strong>. Un lugar donde la música, los personajes y la diversión se juntan.
            Escuchá el disco, conocé a las verduras, cantá karaoke y mucho más.
          </p>
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
              <Link
                key={item.path}
                to={item.path}
                className="px-4 py-2 rounded-full font-bangers text-base bg-white text-cv-dark tracking-wider hover:bg-cv-yellow transition-colors"
                style={{ border: "2px solid #1a1a1a" }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ---- Characters Preview ----
function CharactersPreview() {
  const featured = VEGETABLES.slice(0, 4);

  return (
    <section className="py-20 px-4 bg-cv-green/5">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          title="La Banda"
          subtitle="Las verduras rockeras más famosas del jardín"
          color="#22c55e"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {featured.map((veg, i) => (
            <motion.div
              key={veg.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to="/verduras">
                <motion.div
                  className="card-cv p-4 text-center"
                  whileHover={{ scale: 1.05 }}
                  style={{ background: veg.color + "15" }}
                >
                  <motion.div
                    className="flex justify-center mb-3"
                    animate={{ rotate: [-5, 5, -5] }}
                    transition={{ duration: 2 + i * 0.4, repeat: Infinity }}
                  >
                    <img
                      src={veg.image}
                      alt={veg.name}
                      className="w-24 h-24 object-contain"
                    />
                  </motion.div>
                  <h3 className="font-bangers text-cv-dark text-xl tracking-wider">{veg.name}</h3>
                  <p className="text-sm font-fredoka text-gray-500 mt-1">{veg.role}</p>
                  <span className="mt-2 inline-block text-xs font-fredoka text-gray-400">
                    {veg.instrument}
                  </span>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/verduras" className="btn-cv-primary">
            Ver todos los personajes
          </Link>
        </div>
      </div>
    </section>
  );
}

// ---- Album Preview ----
function AlbumPreview() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          title="El Disco"
          subtitle="La Niñez Es Una Vez — escuchalo ahora"
          color="#ef4444"
        />

        <div className="flex flex-col lg:flex-row gap-10 items-center">
          {/* Cover */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-shrink-0"
          >
            <motion.img
              src={ALBUM.cover}
              alt={ALBUM.title}
              className="w-56 h-56 md:w-72 md:h-72 rounded-2xl object-cover"
              style={{ border: "4px solid #1a1a1a", boxShadow: "8px 8px 0 #1a1a1a" }}
              animate={{ rotate: [-1, 1, -1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </motion.div>

          {/* Tracklist */}
          <div className="flex-1 w-full">
            <div className="space-y-2">
              {ALBUM.tracks.map((track, i) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link to="/canciones">
                    <motion.div
                      className="flex items-center gap-4 p-4 rounded-2xl bg-white cursor-pointer transition-all"
                      style={{ border: "2px solid #e5e7eb" }}
                      whileHover={{
                        borderColor: "#22c55e",
                        x: 6,
                        boxShadow: "4px 4px 0 #22c55e"
                      }}
                    >
                      <span className="text-2xl font-bangers text-gray-300 w-8 flex-shrink-0 tracking-wider">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bangers text-cv-dark text-lg truncate tracking-wider">{track.title}</p>
                      </div>
                      <span className="text-sm font-fredoka text-gray-400 flex-shrink-0">{track.duration}</span>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-6">
              <Link to="/canciones" className="btn-cv-primary w-full text-center justify-center">
                Escuchá Todo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---- Kids Band Banner ----
function KidsBanner() {
  return (
    <section className="py-16 px-4 overflow-hidden" style={{ background: "#facc1510" }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-end justify-center gap-4 md:gap-8">
          {[KID_IMAGES.nio1, KID_IMAGES.nio2, KID_IMAGES.nio3, KID_IMAGES.nio4, KID_IMAGES.nio5].map((src, i) => (
            <motion.img
              key={i}
              src={src}
              alt={`Fan ${i + 1}`}
              className="object-contain"
              style={{ width: i === 2 ? 140 : 100, height: i === 2 ? 140 : 100 }}
              animate={{ y: [0, -(6 + i * 3), 0], rotate: [-3 + i, 3 - i, -3 + i] }}
              transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            />
          ))}
        </div>
        <motion.p
          className="text-center font-bangers text-3xl md:text-4xl text-cv-dark mt-6 tracking-wider"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          ¡El club ya está abierto!
        </motion.p>
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