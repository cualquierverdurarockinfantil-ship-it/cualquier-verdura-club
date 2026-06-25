import { KARAOKE_SONGS } from "./karaokeData";
import { ALBUM } from "./clubData";

// Singles anteriores al disco (con audio + karaoke)
const preAlbumSongs = KARAOKE_SONGS.map(s => ({
  ...s,
  source: "pre-album",
  hasKaraoke: true,
}));

// Tracks del disco (audio aún no disponible)
const albumSongs = ALBUM.tracks.map((track, i) => ({
  id: `album-${track.id}`,
  title: track.title,
  artist: ALBUM.artist,
  cover: ALBUM.cover,
  audioOriginal: null,
  audioInstrumental: null,
  videoUrl: null,
  character: track.character,
  source: "album",
  albumTrack: i + 1,
  hasKaraoke: false,
  duration: track.duration || "",
  durationSecs: null,
}));

export const ALL_SONGS = [...preAlbumSongs, ...albumSongs];