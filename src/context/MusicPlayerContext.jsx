import { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";

const MusicPlayerContext = createContext(null);

export function MusicPlayerProvider({ children }) {
  const audioRef = useRef(null);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(true);
  const [volume, setVolumeState] = useState(1);
  const [muted, setMuted] = useState(false);
  const [pendingTrack, setPendingTrack] = useState(null);

  // Refs para evitar closures obsoletos en los event listeners
  const shuffleRef = useRef(false);
  const repeatRef = useRef(true);
  const playlistLenRef = useRef(0);
  shuffleRef.current = shuffle;
  repeatRef.current = repeat;
  playlistLenRef.current = playlist.length;

  // Crear el elemento audio una sola vez (persiste durante toda la navegación)
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      if (shuffleRef.current && playlistLenRef.current > 1) {
        setCurrentIndex(prev => {
          let next;
          do { next = Math.floor(Math.random() * playlistLenRef.current); } while (next === prev);
          return next;
        });
      } else {
        setCurrentIndex(prev => {
          const isLast = prev >= playlistLenRef.current - 1;
          if (isLast) {
            if (repeatRef.current) return 0;
            audio.pause();
            return prev;
          }
          return prev + 1;
        });
      }
    };
    const onPlay = () => {
      setIsPlaying(true);
      window.dispatchEvent(new CustomEvent("cv-audio-play", { detail: { source: "music-player" } }));
    };
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  // Cargar y reproducir cuando cambia el índice (solo si la pista realmente cambió)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || currentIndex < 0 || !playlist[currentIndex]) return;
    const track = playlist[currentIndex];
    const url = track.audioOriginal || track.audioInstrumental;
    if (!url) return;
    let resolved;
    try { resolved = new URL(url, window.location.href).href; } catch { resolved = url; }
    if (audio.src === resolved) return; // misma pista (p.ej. reordenamos otras) — no reiniciar
    audio.src = url;
    audio.play().catch(() => {});
  }, [currentIndex, playlist]);

  // Aplicar volumen al audio
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);

  // Pausar cuando otro reproductor comienza (ej: karaoke)
  useEffect(() => {
    const handler = (e) => {
      if (e.detail.source !== "music-player") {
        const audio = audioRef.current;
        if (audio && !audio.paused) audio.pause();
      }
    };
    window.addEventListener("cv-audio-play", handler);
    return () => window.removeEventListener("cv-audio-play", handler);
  }, []);

  const currentTrack = currentIndex >= 0 ? playlist[currentIndex] : null;

  const playTrack = useCallback((track, list) => {
    const fullList = (list || [track]).filter(t => t.audioOriginal || t.audioInstrumental);
    if (fullList.length === 0) return;
    const index = fullList.findIndex(t => t.id === track.id);
    if (index >= 0 && currentTrack?.id === track.id) {
      const audio = audioRef.current;
      if (audio) {
        if (isPlaying) audio.pause();
        else audio.play().catch(() => {});
      }
      return;
    }
    setPlaylist(fullList);
    setCurrentIndex(index >= 0 ? index : 0);
  }, [currentTrack, isPlaying]);

  // Punto de entrada para tocar una cancion desde cualquier lista de la web.
  // Si no hay nada sonando todavia, arranca directo. Si ya hay una playlist
  // activa, pide confirmacion (reproducir ahora / agregar a la cola).
  const requestPlay = useCallback((track) => {
    if (!track || !(track.audioOriginal || track.audioInstrumental)) return;
    if (playlist.length === 0) {
      playTrack(track, [track]);
      return;
    }
    if (currentTrack?.id === track.id) {
      playTrack(track, playlist);
      return;
    }
    setPendingTrack(track);
  }, [playlist, currentTrack, playTrack]);

  const confirmPlayNow = useCallback(() => {
    if (pendingTrack) playTrack(pendingTrack, [pendingTrack]);
    setPendingTrack(null);
  }, [pendingTrack, playTrack]);

  const confirmAddToQueue = useCallback(() => {
    if (pendingTrack) {
      setPlaylist(prev => (prev.some(t => t.id === pendingTrack.id) ? prev : [...prev, pendingTrack]));
    }
    setPendingTrack(null);
  }, [pendingTrack]);

  const cancelPending = useCallback(() => setPendingTrack(null), []);

  const reorderQueue = useCallback((fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    setPlaylist(prev => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
    setCurrentIndex(prev => {
      if (fromIndex === prev) return toIndex;
      if (fromIndex < prev && toIndex >= prev) return prev - 1;
      if (fromIndex > prev && toIndex <= prev) return prev + 1;
      return prev;
    });
  }, []);

  const removeFromQueue = useCallback((index) => {
    setPlaylist(prev => prev.filter((_, i) => i !== index));
    setCurrentIndex(prev => {
      if (index < prev) return prev - 1;
      return prev;
    });
  }, []);

  const clearQueue = useCallback(() => {
    setPlaylist(prev => (currentIndex >= 0 && prev[currentIndex] ? [prev[currentIndex]] : []));
    setCurrentIndex(prev => (prev >= 0 ? 0 : -1));
  }, [currentIndex]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.pause();
    else audio.play().catch(() => {});
  }, [isPlaying]);

  const goNext = useCallback(() => {
    setCurrentIndex(prev => {
      if (shuffleRef.current && playlistLenRef.current > 1) {
        let next;
        do { next = Math.floor(Math.random() * playlistLenRef.current); } while (next === prev);
        return next;
      }
      const isLast = prev >= playlistLenRef.current - 1;
      if (isLast) return repeatRef.current ? 0 : prev;
      return prev + 1;
    });
  }, []);

  const goPrev = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : playlistLenRef.current - 1));
  }, []);

  const seek = useCallback((time) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const toggleShuffle = useCallback(() => setShuffle(s => !s), []);
  const toggleRepeat = useCallback(() => setRepeat(r => !r), []);

  const setVolume = useCallback((v) => {
    setVolumeState(v);
    if (v > 0) setMuted(false);
  }, []);

  const toggleMute = useCallback(() => {
    setMuted(m => !m);
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) { audio.pause(); audio.src = ""; }
    setPlaylist([]);
    setCurrentIndex(-1);
    setIsPlaying(false);
  }, []);

  return (
    <MusicPlayerContext.Provider value={{
      currentTrack, isPlaying, currentTime, duration, shuffle, repeat,
      playlist, currentIndex, pendingTrack,
      playTrack, requestPlay, confirmPlayNow, confirmAddToQueue, cancelPending,
      reorderQueue, removeFromQueue, clearQueue,
      togglePlay, goNext, goPrev, seek, toggleShuffle, toggleRepeat, stop,
      volume, muted, setVolume, toggleMute,
    }}>
      {children}
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  return useContext(MusicPlayerContext);
}