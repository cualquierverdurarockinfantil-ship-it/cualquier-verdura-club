import { useState } from "react";
import { motion } from "framer-motion";
import { VIDEOS, VIDEO_PLAYLISTS } from "@/lib/clubData";
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

function PlaylistCard({ playlist, index }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeVideo = playlist.videos[activeIdx];
  const ytId = getYouTubeId(activeVideo.youtubeUrl || "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="card-cv overflow-hidden md:col-span-2"
    >
      <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
        {ytId && (
          <div className="absolute inset-0">
            <YouTubeEmbed videoId={ytId} title={activeVideo.title} />
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-xs font-bangers tracking-wider px-2 py-0.5 rounded-full text-white"
            style={{ background: "#06b6d4" }}
          >
            PLAYLIST · {playlist.videos.length} VIDEOS
          </span>
        </div>
        <h3 className="font-bangers text-cv-dark text-2xl leading-tight tracking-wider">{playlist.title}</h3>
        <p className="mt-1 font-fredoka text-gray-500 text-sm">{playlist.description}</p>

        <div className="mt-4 flex flex-col gap-1.5">
          {playlist.videos.map((v, i) => (
            <button
              key={v.id}
              onClick={() => setActiveIdx(i)}
              className={`flex items-center gap-3 text-left px-3 py-2 rounded-xl transition-colors ${
                i === activeIdx ? "bg-cv-cyan/15" : "hover:bg-gray-100"
              }`}
            >
              <span
                className="w-7 h-7 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bangers"
                style={{
                  background: i === activeIdx ? "#06b6d4" : "#e5e7eb",
                  color: i === activeIdx ? "#fff" : "#555",
                }}
              >
                {i === activeIdx ? "▶" : i + 1}
              </span>
              <span
                className={`font-fredoka text-sm ${
                  i === activeIdx ? "text-cv-dark font-semibold" : "text-gray-600"
                }`}
              >
                {v.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Videos() {
  const hasContent = VIDEOS.length > 0 || VIDEO_PLAYLISTS.length > 0;

  return (
    <div className="min-h-screen bg-white">
      <section className="py-20 px-4 bg-cv-red/5 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            title="Cine Verdura"
            subtitle="Los videoclips oficiales de Cualquier Verdura"
            color="#ef4444"
          />

          {hasContent ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              {VIDEO_PLAYLISTS.map((playlist, i) => (
                <PlaylistCard key={playlist.id} playlist={playlist} index={i} />
              ))}
              {VIDEOS.map((video, i) => (
                <VideoEmbed key={video.id} video={video} index={VIDEO_PLAYLISTS.length + i} />
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
