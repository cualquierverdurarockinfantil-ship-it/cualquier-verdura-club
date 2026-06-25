import { useRef, useEffect } from "react";

// Estado global del API de YouTube (compartido entre instancias)
let apiReady = false;
let apiLoading = false;
const pendingPlayers = [];

function loadAPI() {
  if (apiReady || apiLoading) return;
  apiLoading = true;
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  document.body.appendChild(tag);
  window.onYouTubeIframeAPIReady = () => {
    apiReady = true;
    pendingPlayers.forEach(fn => fn());
    pendingPlayers.length = 0;
  };
}

function setMaxQuality(player) {
  try {
    if (typeof player.setPlaybackQualitySuggested === "function") {
      player.setPlaybackQualitySuggested("hd2160");
    } else if (typeof player.setPlaybackQuality === "function") {
      player.setPlaybackQuality("hd2160");
    }
  } catch {}
}

export default function YouTubeEmbed({ videoId, title }) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!videoId || !containerRef.current) return;

    // Crear un div hijo para que YT.Player lo reemplace (no toca el div de React)
    const playerDiv = document.createElement("div");
    containerRef.current.appendChild(playerDiv);

    let cancelled = false;

    const initPlayer = () => {
      if (cancelled || !window.YT?.Player) return;
      playerRef.current = new window.YT.Player(playerDiv, {
        videoId,
        width: "100%",
        height: "100%",
        playerVars: {
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onReady: (e) => setMaxQuality(e.target),
          onStateChange: (e) => {
            if (e.data === window.YT.PlayerState.PLAYING) {
              setMaxQuality(e.target);
            }
          },
        },
      });
    };

    if (apiReady) {
      initPlayer();
    } else {
      pendingPlayers.push(initPlayer);
      loadAPI();
    }

    return () => {
      cancelled = true;
      const idx = pendingPlayers.indexOf(initPlayer);
      if (idx >= 0) pendingPlayers.splice(idx, 1);
      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [videoId]);

  return <div ref={containerRef} className="w-full h-full" title={title} />;
}