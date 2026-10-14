import Navbar from "./Navbar";
import Footer from "./Footer";
import PlayerBar, { PlayerSpacer } from "./PlayerBar";
import PlayChoiceModal from "./PlayChoiceModal";
import CampaignBanner from "./CampaignBanner";
import ShowBanner from "./ShowBanner";
import HalloweenLayer from "./halloween/HalloweenLayer";
import { Cat } from "./halloween/HalloweenArt";
import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { MusicPlayerProvider } from "@/context/MusicPlayerContext";
import { useHalloween } from "@/lib/halloween";

export default function Layout() {
  // true solo del 19/10 al 31/10 (ver src/lib/halloween.js)
  const halloween = useHalloween();
  // en la Home el hero va pegado a la navbar; en el resto damos aire para la guirnalda
  const isHome = useLocation().pathname === "/";

  return (
    <MusicPlayerProvider>
      <div className={`min-h-screen flex flex-col ${halloween ? "hw-bg" : "bg-white"}`}>
        <CampaignBanner />
        {/* display:contents => no cambia el layout; solo sirve para vestir la navbar en Halloween */}
        <div className="hw-nav contents">
          <Navbar />
        </div>
        <main className={`flex-1 ${halloween && !isHome ? "pt-[6.5rem]" : "pt-16"}`}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* aviso del próximo show: va dentro del contenido para que no lo tape la navbar fija */}
            <ShowBanner />
            <Outlet />
          </motion.div>
        </main>

        {/* gato negro sentado sobre el footer */}
        {halloween && (
          <div className="relative h-0 z-10 pointer-events-none" aria-hidden="true">
            <Cat className="absolute right-4 md:right-10 bottom-0 w-16 md:w-20 h-auto" />
          </div>
        )}

        <Footer />
        <PlayerSpacer />
        <PlayerBar />
        <PlayChoiceModal />
        {halloween && <HalloweenLayer />}
      </div>
    </MusicPlayerProvider>
  );
}
