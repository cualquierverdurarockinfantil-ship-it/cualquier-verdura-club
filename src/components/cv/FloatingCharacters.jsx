import { motion } from "framer-motion";
import { VEG_IMAGES, KID_IMAGES } from "@/lib/clubData";

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

export default function FloatingCharacters({ className = "" }) {
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

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {items.map((item, i) => (
        <FloatingChar key={i} {...item} />
      ))}
    </div>
  );
}