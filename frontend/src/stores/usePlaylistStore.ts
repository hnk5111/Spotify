import { create } from "zustand";
import { Song } from "@/types";
import { Key, ReactNode } from "react";

interface Playlist {
  title: ReactNode;
  _id: Key | null | undefined;
  id: string;
  name: string;
  songs: Song[];
  createdAt: Date;
  userId: string;
}

interface PlaylistStore {
  playlists: Playlist[];
  createPlaylist: (name: string, userId: string) => void;
  addSongToPlaylist: (playlistId: string, song: Song) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
  deletePlaylist: (playlistId: string) => void;
}

export const usePlaylistStore = create<PlaylistStore>((set) => ({
  playlists: [],
  createPlaylist: (name: string, userId: string) => {
    set((state) => ({
      playlists: [
        ...state.playlists,
        {
          id: crypto.randomUUID(),
          _id: crypto.randomUUID(),
          title: name,
          name,
          songs: [],
          createdAt: new Date(),
          userId,
        },
      ],
    }));
  },

  addSongToPlaylist: (playlistId: string, song: Song) => {
    set((state) => ({
      playlists: state.playlists.map((playlist) =>
        playlist.id === playlistId
          ? {
              ...playlist,
              songs: [...playlist.songs, song],
            }
          : playlist
      ),
    }));
  },

  removeSongFromPlaylist: (playlistId: string, songId: string) => {
    set((state) => ({
      playlists: state.playlists.map((playlist) =>
        playlist.id === playlistId
          ? {
              ...playlist,
              songs: playlist.songs.filter((song) => song._id !== songId),
            }
          : playlist
      ),
    }));
  },

  deletePlaylist: (playlistId: string) => {
    set((state) => ({
      playlists: state.playlists.filter((playlist) => playlist.id !== playlistId),
    }));
  },
})); 