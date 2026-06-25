import { motion } from "framer-motion";

export default function SectionHeader({ title, subtitle, color = "#22c55e", centered = true, image = null }) {
  return (
    <motion.div
      className={`mb-10 ${centered ? "text-center" : ""}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {image && (
        <motion.img
          src={image}
          alt=""
          className="w-16 h-16 object-contain mx-auto mb-3"
          animate={{ rotate: [-5, 5, -5], scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <h2
        className="text-4xl md:text-5xl font-bangers leading-tight tracking-wider"
        style={{ color: "#1a1a1a" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-lg md:text-xl font-fredoka text-gray-600 max-w-xl mx-auto">
          {subtitle}
        </p>
      )}
      <motion.div
        className="mt-3 h-1.5 rounded-full mx-auto"
        style={{ background: color, width: centered ? "80px" : "60px" }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      />
    </motion.div>
  );
}