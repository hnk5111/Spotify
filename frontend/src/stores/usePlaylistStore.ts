import { create } from "zustand";
import { Song } from "@/types";
import { Key, ReactNode } from "react";
import { axiosInstance } from "@/lib/axios";
import { toast } from "react-hot-toast";

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
  isLoading: boolean;
  error: string | null;
  fetchPlaylists: () => Promise<void>;
  createPlaylist: (name: string, userId: string) => Promise<void>;
  addSongToPlaylist: (playlistId: string, song: Song) => Promise<void>;
  removeSongFromPlaylist: (playlistId: string, songId: string) => Promise<void>;
  deletePlaylist: (playlistId: string) => Promise<void>;
}

export const usePlaylistStore = create<PlaylistStore>((set) => ({
  playlists: [],
  isLoading: false,
  error: null,

  fetchPlaylists: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/api/playlists');
      set({ playlists: response.data });
    } catch (error: any) {
      console.error('Error fetching playlists:', error);
      set({ error: error.message });
      toast.error('Failed to fetch playlists');
    } finally {
      set({ isLoading: false });
    }
  },

  createPlaylist: async (name, userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post('/api/playlists', { name, userId });
      set((state) => ({
        playlists: [...state.playlists, response.data],
      }));
      toast.success('Playlist created successfully');
    } catch (error: any) {
      console.error('Error creating playlist:', error);
      set({ error: error.message });
      toast.error('Failed to create playlist');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  addSongToPlaylist: async (playlistId: string, song: Song) => {
    try {
      const response = await axiosInstance.post(`/api/playlists/${playlistId}/songs`, {
        songId: song._id
      });
      
      set((state) => ({
        playlists: state.playlists.map((playlist) =>
          playlist.id === playlistId ? response.data : playlist
        ),
      }));
      
      toast.success('Song added to playlist');
    } catch (error: any) {
      console.error('Error adding song to playlist:', error);
      toast.error('Failed to add song to playlist');
      throw error;
    }
  },

  removeSongFromPlaylist: async (playlistId: string, songId: string) => {
    try {
      const response = await axiosInstance.delete(`/api/playlists/${playlistId}/songs/${songId}`);
      
      set((state) => ({
        playlists: state.playlists.map((playlist) =>
          playlist.id === playlistId ? response.data : playlist
        ),
      }));
      
      toast.success('Song removed from playlist');
    } catch (error: any) {
      console.error('Error removing song from playlist:', error);
      toast.error('Failed to remove song from playlist');
      throw error;
    }
  },

  deletePlaylist: async (playlistId: string) => {
    try {
      await axiosInstance.delete(`/api/playlists/${playlistId}`);
      
      set((state) => ({
        playlists: state.playlists.filter((playlist) => playlist.id !== playlistId),
      }));
      
      toast.success('Playlist deleted successfully');
    } catch (error: any) {
      console.error('Error deleting playlist:', error);
      toast.error('Failed to delete playlist');
      throw error;
    }
  },
})); 