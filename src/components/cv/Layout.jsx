import Navbar from "./Navbar";
import Footer from "./Footer";
import PlayerBar, { PlayerSpacer } from "./PlayerBar";
import PlayChoiceModal from "./PlayChoiceModal";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { MusicPlayerProvider } from "@/context/MusicPlayerContext";

export default function Layout() {
  return (
    <MusicPlayerProvider>
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="pt-16 flex-1">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
        <Footer />
        <PlayerSpacer />
        <PlayerBar />
        <PlayChoiceModal />
      </div>
    </MusicPlayerProvider>
  );
}