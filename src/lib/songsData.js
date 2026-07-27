import { KARAOKE_SONGS } from "./karaokeData";
import { ALBUM } from "./clubData";

// Singles anteriores al disco (con audio + karaoke)
// Los singles son composiciones de Cualquier Verdura
const preAlbumSongs = KARAOKE_SONGS.map(s => ({
  ...s,
  source: "pre-album",
  hasKaraoke: true,
  composer: s.composer || "Cualquier Verdura",
}));

// Tracks del disco — propagar composer desde clubData
const albumSongs = ALBUM.tracks.map((track, i) => ({
  id: `album-${track.id}`,
  title: track.title,
  artist: ALBUM.artist,
  composer: track.composer || "Cualquier Verdura",
  cover: ALBUM.cover,
  audioOriginal: track.audioOriginal || null,
  audioInstrumental: track.audioInstrumental || null,
  videoUrl: null,
  character: track.character,
  source: "album",
  albumTrack: i + 1,
  hasKaraoke: !!track.audioInstrumental,
  duration: track.duration || "",
  durationSecs: null,
}));

export const ALL_SONGS = [...albumSongs, ...preAlbumSongs];
