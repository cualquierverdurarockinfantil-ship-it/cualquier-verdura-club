import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import banners from "@/lib/banners.json";

function pickActiveBanner() {
  const today = new Date().toISOString().slice(0, 10);
  const active = banners.filter(
    (b) => b.active !== false && b.startDate <= today && b.endDate >= today
  );
  if (active.length === 0) return null;
  active.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  return active[0];
}

export default function CampaignBanner() {
  const [banner] = useState(pickActiveBanner);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (banner && localStorage.getItem(`cv-banner-dismissed-${banner.id}`)) {
      setDismissed(true);
    }
  }, [banner]);

  if (!banner || dismissed) return null;

  function handleDismiss() {
    localStorage.setItem(`cv-banner-dismissed-${banner.id}`, "1");
    setDismissed(true);
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        style={{ overflow: "hidden" }}
      >
        <div
          className="flex items-center justify-center gap-3 px-4 py-2.5 text-center relative"
          style={{ background: "linear-gradient(135deg, #1a0a2e 0%, #3b0764 60%, #92338A 100%)", color: "#fff" }}
        >
          {banner.imageUrl && (
            <img src={banner.imageUrl} alt="" className="w-8 h-8 rounded-full object-cover hidden sm:block" />
          )}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="font-bangers tracking-wide text-sm md:text-base">{banner.title}</span>
            {banner.description && (
              <span className="font-fredoka text-xs md:text-sm text-white/80">{banner.description}</span>
            )}
            {banner.buttonLabel && banner.buttonLink && (
              <a
                href={banner.buttonLink}
                className="ml-1 px-3 py-1 rounded-full text-xs font-bangers tracking-wide"
                style={{ background: "#facc15", color: "#1a0a2e" }}
              >
                {banner.buttonLabel}
              </a>
            )}
          </div>
          <button
            onClick={handleDismiss}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10"
            aria-label="Cerrar"
          >
            <X size={16} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
