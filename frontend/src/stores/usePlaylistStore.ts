import { create } from "zustand";

interface Song {
  _id: string;
  title: string;
  artist: string;
  imageUrl: string;
  audioUrl: string;
}

interface Playlist {
  _id: string;
  title: string;
  imageUrl: string;
  songs: Song[];
}

interface PlaylistStore {
  playlists: Playlist[];
  currentPlaylist: Playlist | null;
  setPlaylists: (playlists: Playlist[]) => void;
  setCurrentPlaylist: (playlist: Playlist | null) => void;
  addPlaylist: (playlist: Playlist) => void;
  removePlaylist: (playlistId: string) => void;
}

export const usePlaylistStore = create<PlaylistStore>((set) => ({
  playlists: [],
  currentPlaylist: null,
  setPlaylists: (playlists) => set({ playlists }),
  setCurrentPlaylist: (playlist) => set({ currentPlaylist: playlist }),
  addPlaylist: (playlist) => 
    set((state) => ({ playlists: [...state.playlists, playlist] })),
  removePlaylist: (playlistId) =>
    set((state) => ({
      playlists: state.playlists.filter((p) => p._id !== playlistId),
    })),
})); 