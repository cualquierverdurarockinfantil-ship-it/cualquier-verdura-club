import { motion } from "framer-motion";
import { VIDEOS } from "@/lib/clubData";
import SectionHeader from "@/components/cv/SectionHeader";
import YouTubeEmbed from "@/components/cv/YouTubeEmbed";

// Extrae el ID de YouTube de una URL
function getYouTubeId(url) {
  const match = url.match(/(?:youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}

function VideoEmbed({ video, index }) {
  const ytId = getYouTubeId(video.youtubeUrl || "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="card-cv overflow-hidden"
    >
      {/* Embed o placeholder */}
      <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
        {ytId ? (
          <div className="absolute inset-0">
            <YouTubeEmbed videoId={ytId} title={video.title} />
          </div>
        ) : (
          // Sin ID todavía: mostrar thumbnail + play decorativo (no enlaza a ningún lado)
          <div className="absolute inset-0">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div
                className="w-16 h-16 rounded-full bg-cv-red flex items-center justify-center text-white text-2xl"
                style={{ border: "3px solid white", boxShadow: "4px 4px 0 #1a1a1a" }}
              >
                ▶
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-bangers text-cv-dark text-xl leading-tight tracking-wider">{video.title}</h3>
        <p className="mt-2 font-fredoka text-gray-500 text-sm">{video.description}</p>
      </div>
    </motion.div>
  );
}

export default function Videos() {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-20 px-4 bg-cv-red/5 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            title="Cine Verdura"
            subtitle="Los videoclips oficiales de Cualquier Verdura"
            color="#ef4444"
          />

          {VIDEOS.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              {VIDEOS.map((video, i) => (
                <VideoEmbed key={video.id} video={video} index={i} />
              ))}
            </div>
          ) : (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="text-8xl mb-6"
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎬
              </motion.div>
              <h3 className="text-3xl font-bangers text-cv-dark mb-3 tracking-wider">¡Próximamente!</h3>
              <p className="font-fredoka text-gray-500 text-lg">
                Los videoclips están en camino. ¡Volvé pronto! 🎥
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}