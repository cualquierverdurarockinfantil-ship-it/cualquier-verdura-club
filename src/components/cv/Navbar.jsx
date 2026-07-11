import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { SHOWS, NEWS } from "@/lib/clubData";

const NAV_ITEMS = [
  { label: "Inicio", path: "/" },
  { label: "Escuchá Todo", path: "/canciones" },
  { label: "Cine Verdura", path: "/videos" },
  { label: "Karaoke", path: "/karaoke" },
  { label: "Galería", path: "/fotos" },
  { label: "Toca las Canciones", path: "/acordes" },
  ...(SHOWS.length > 0 ? [{ label: "Shows", path: "/shows" }] : []),
  ...(NEWS.length > 0 ? [{ label: "Novedades", path: "/novedades" }] : []),
  { label: "Juegos", path: "/juegos" },
  { label: "Dibujos", path: "/dibujos" },
  { label: "Verduras", path: "/verduras" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    setVisible(false);
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  const isHome = location.pathname === "/";
  const shouldShow = !isHome || visible;

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
        style={{
          // Verde claro pastel transparentado
          background: "rgba(187, 247, 208, 0.75)",
          borderBottom: "2px solid rgba(134, 239, 172, 0.5)",
        }}
        initial={false}
        animate={{
          y: shouldShow ? 0 : -80,
          opacity: shouldShow ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="max-w-[1700px] mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img
              src="/assets/letras-horizontal.svg"
              alt="Cualquier Verdura"
              className="h-8 w-auto"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <span className="hidden text-lg font-bangers text-cv-dark tracking-wider">CLUB VERDURA</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-2.5 py-1.5 rounded-full text-sm font-bold transition-all duration-200 font-bangers tracking-wider whitespace-nowrap ${
                  location.pathname === item.path
                    ? "bg-cv-green text-white"
                    : "text-cv-dark hover:bg-cv-yellow"
                }`}
                style={{ border: "2px solid transparent", fontFamily: "'Fredoka One', sans-serif" }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-xl"
            style={{ border: "3px solid #1a1a1a", background: "#facc15" }}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-72 z-50 overflow-y-auto"
              style={{
                background: "rgba(187, 247, 208, 0.97)",
                backdropFilter: "blur(12px)",
                borderLeft: "3px solid #1a1a1a",
              }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-bangers text-cv-dark tracking-wider">MENÚ</span>
                  <button onClick={() => setOpen(false)} className="p-1">
                    <X size={24} />
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {NAV_ITEMS.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setOpen(false)}
                      className={`px-4 py-3 rounded-2xl text-lg font-bangers tracking-wider transition-all ${
                        location.pathname === item.path
                          ? "bg-cv-green text-white"
                          : "text-cv-dark hover:bg-cv-yellow"
                      }`}
                      style={{ fontFamily: "'Bangers', cursive", border: "2px solid #1a1a1a" }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
