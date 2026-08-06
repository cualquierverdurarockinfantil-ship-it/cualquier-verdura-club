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
  const canDismiss = banner.dismissible !== false;

  function handleDismiss() {
    localStorage.setItem(`cv-banner-dismissed-${banner.id}`, "1");
    setDismissed(true);
  }

  if (banner.style === "card") {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="px-4 pt-4"
        >
          <div className="max-w-2xl mx-auto relative">
            <div
              className="rounded-2xl px-4 py-4 text-center relative overflow-hidden"
              style={{
                background: banner.imageUrl
                  ? undefined
                  : "linear-gradient(135deg, #E6302B 0%, #92338A 100%)",
                border: "3px solid #1a1a1a",
                boxShadow: "5px 5px 0 #1a1a1a",
              }}
            >
              {banner.imageUrl && (
                <>
                  <img src={banner.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40" />
                </>
              )}
              <div className="relative">
                <p className="font-bangers text-white text-xl md:text-2xl tracking-wide leading-tight">
                  {banner.title}
                </p>
                {banner.description && (
                  <p className="font-fredoka text-white/90 text-sm mt-1">{banner.description}</p>
                )}
                {banner.buttonLabel && banner.buttonLink && (
                  <a
                    href={banner.buttonLink}
                    className="inline-block mt-2 px-4 py-1.5 rounded-full font-bangers text-xs tracking-wider"
                    style={{ background: "#FFED00", color: "#1a1a1a", border: "2px solid #1a1a1a" }}
                  >
                    {banner.buttonLabel}
                  </a>
                )}
              </div>
              {canDismiss && (
                <button
                  onClick={handleDismiss}
                  className="absolute right-2 top-2 p-1 rounded-full bg-black/20 hover:bg-black/40 z-10"
                  aria-label="Cerrar"
                >
                  <X size={16} color="#fff" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
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
          {canDismiss && (
            <button
              onClick={handleDismiss}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10"
              aria-label="Cerrar"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
