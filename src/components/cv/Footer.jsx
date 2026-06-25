import { Link } from "react-router-dom";
import { SOCIAL } from "@/lib/clubData";
import { motion } from "framer-motion";
import { VEG_IMAGES } from "@/lib/clubData";

export default function Footer() {
  return (
    <footer className="bg-cv-dark text-white relative overflow-hidden">
      {/* Top border decoration */}
      <div className="h-2 w-full" style={{ background: "linear-gradient(90deg, #22c55e, #ef4444, #ec4899, #06b6d4, #facc15, #a855f7, #22c55e)" }} />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <img
              src="/assets/letras-horizontal.svg"
              alt="Cualquier Verdura"
              className="h-10 mb-4 brightness-0 invert"
            />
            <p className="text-white/70 font-fredoka text-lg leading-relaxed">
              El club digital de rock infantil más verde del mundo 🥦🎸
            </p>
            <div className="mt-4 flex items-center gap-2">
              {[
                VEG_IMAGES.berenjena,
                VEG_IMAGES.brocoli,
                VEG_IMAGES.zanahoria,
                VEG_IMAGES.tomate,
                VEG_IMAGES.cebolla,
                VEG_IMAGES.rabanito,
                VEG_IMAGES.calabaza,
              ].map((src, i) => (
                <motion.img
                  key={i}
                  src={src}
                  alt=""
                  className="w-10 h-10 object-contain opacity-70"
                  animate={{ y: [0, -6, 0], rotate: [-5, 5, -5] }}
                  transition={{ duration: 2 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
                />
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bangers text-cv-yellow text-xl mb-4 tracking-wider">SECCIONES</h3>
            <div className="grid grid-cols-2 gap-1">
              {[
                ["Escuchá Todo", "/canciones"],
                ["Cine Verdura", "/videos"],
                ["Karaoke", "/karaoke"],
                ["Galería", "/fotos"],
                ["Toca las Canciones", "/acordes"],
                ["Juegos", "/juegos"],
                ["Dibujos", "/dibujos"],
                ["Verduras", "/verduras"],
              ].map(([label, path]) => (
                <Link
                  key={path}
                  to={path}
                  className="text-white/70 hover:text-cv-yellow transition-colors font-fredoka text-base py-1"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-bangers text-cv-yellow text-xl mb-4 tracking-wider">SEGUINOS</h3>
            <div className="flex flex-col gap-3">
              <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/70 hover:text-cv-fuchsia transition-colors font-fredoka text-base">
                <span className="text-2xl">📸</span> Instagram
              </a>
              <a href={SOCIAL.youtube} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/70 hover:text-cv-red transition-colors font-fredoka text-base">
                <span className="text-2xl">▶️</span> YouTube
              </a>
              <a href={SOCIAL.spotify} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/70 hover:text-cv-green transition-colors font-fredoka text-base">
                <span className="text-2xl">🎧</span> Spotify
              </a>
              <a href={SOCIAL.tiktok} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/70 hover:text-cv-cyan transition-colors font-fredoka text-base">
                <span className="text-2xl">🎵</span> TikTok
              </a>
              <a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/70 hover:text-cv-cyan transition-colors font-fredoka text-base">
                <span className="text-2xl">👥</span> Facebook
              </a>
              <a href="https://cualquierverdurarock.com" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/70 hover:text-cv-green transition-colors font-fredoka text-base">
                <span className="text-2xl">🌐</span> cualquierverdurarock.com
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center text-white/40 font-fredoka text-sm">
          <p>© 2024 Cualquier Verdura. Todos los derechos reservados. Hecho con mucho rock y verdura.</p>
        </div>
      </div>
    </footer>
  );
}