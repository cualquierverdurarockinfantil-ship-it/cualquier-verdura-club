import { motion } from "framer-motion";
import { VEG_IMAGES, KID_IMAGES } from "@/lib/clubData";
import { fiestasKidImage, FIESTAS_VEG } from "@/lib/fiestas";

// Real character images floating as decoration
const FloatingChar = ({ src, alt, x, y, size = 80, delay = 0, animationType = "float" }) => {
  const variants = {
    float: {
      y: [0, -18, 0],
      rotate: [-4, 4, -4],
      transition: { duration: 4 + delay, repeat: Infinity, ease: "easeInOut" }
    },
    rock: {
      rotate: [-10, 10, -10],
      y: [0, -8, 0],
      transition: { duration: 0.9 + delay * 0.2, repeat: Infinity, ease: "easeInOut" }
    },
    breathe: {
      scale: [1, 1.07, 1],
      rotate: [-2, 2, -2],
      transition: { duration: 3.5 + delay, repeat: Infinity, ease: "easeInOut" }
    }
  };

  return (
    <motion.img
      src={src}
      alt={alt}
      className="absolute select-none pointer-events-none object-contain"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        zIndex: 0,
        opacity: 0.25,
      }}
      animate={variants[animationType]}
    />
  );
};

export default function FloatingCharacters({ className = "", fiestas = false }) {
  const items = [
    { src: VEG_IMAGES.tomate, alt: "Tomate", x: 3, y: 5, size: 110, delay: 0, animationType: "rock" },
    { src: VEG_IMAGES.brocoli, alt: "Brócoli", x: 86, y: 4, size: 100, delay: 1, animationType: "float" },
    { src: VEG_IMAGES.zanahoria, alt: "Zanahoria", x: 1, y: 55, size: 90, delay: 0.5, animationType: "breathe" },
    { src: VEG_IMAGES.berenjena, alt: "Berenjena", x: 90, y: 50, size: 100, delay: 1.5, animationType: "float" },
    { src: VEG_IMAGES.choclo, alt: "Choclo", x: 12, y: 80, size: 85, delay: 0.8, animationType: "rock" },
    { src: VEG_IMAGES.cebolla, alt: "Cebolla", x: 78, y: 78, size: 90, delay: 2, animationType: "breathe" },
    { src: KID_IMAGES.nio3, alt: "Nena bailando", x: 70, y: 10, size: 95, delay: 1.2, animationType: "float" },
    { src: KID_IMAGES.nio4, alt: "Nene rockero", x: 30, y: 88, size: 85, delay: 0.3, animationType: "rock" },
  ];

  // Tema Fiestas: además de los personajes, algunas cosas de las fiestas (pocas, para no sobrecargar)
  if (fiestas) {
    const O = "/assets/fiestas/orn/";
    items.push(
      { src: O + "arbolito.svg", alt: "Arbolito", x: 92, y: 28, size: 84, delay: 0.6, animationType: "breathe" },
      { src: O + "trineo.svg", alt: "Trineo", x: 42, y: 2, size: 120, delay: 1.1, animationType: "float" },
      { src: O + "regalo.svg", alt: "Regalo", x: 7, y: 32, size: 62, delay: 0.9, animationType: "rock" },
      { src: O + "reno.svg", alt: "Reno", x: 56, y: 92, size: 84, delay: 1.7, animationType: "rock" }
    );
  }

  // Tema Fiestas: los mismos personajes, con gorro de Papá Noel / astas
  const festive = (src) => {
    if (!fiestas) return src;
    const id = Object.keys(VEG_IMAGES).find((k) => VEG_IMAGES[k] === src);
    return (id && FIESTAS_VEG[id]) || fiestasKidImage(src, true);
  };

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {items.map((item, i) => (
        <FloatingChar key={i} {...item} src={festive(item.src)} />
      ))}
    </div>
  );
}