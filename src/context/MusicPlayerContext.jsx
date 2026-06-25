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
  const [volume, setVolumeState] = useState(1);
  const [muted, setMuted] = useState(false);

  // Refs para evitar closures obsoletos en los event listeners
  const shuffleRef = useRef(false);
  const playlistLenRef = useRef(0);
  shuffleRef.current = shuffle;
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
        setCurrentIndex(prev => (prev < playlistLenRef.current - 1 ? prev + 1 : 0));
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

  // Cargar y reproducir cuando cambia el índice
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || currentIndex < 0 || !playlist[currentIndex]) return;
    const track = playlist[currentIndex];
    const url = track.audioOriginal || track.audioInstrumental;
    if (!url) return;
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
      return prev < playlistLenRef.current - 1 ? prev + 1 : 0;
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
      currentTrack, isPlaying, currentTime, duration, shuffle,
      playlist, currentIndex,
      playTrack, togglePlay, goNext, goPrev, seek, toggleShuffle, stop,
      volume, muted, setVolume, toggleMute,
    }}>
      {children}
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  return useContext(MusicPlayerContext);
}