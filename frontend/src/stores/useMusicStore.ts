import { axiosInstance } from "@/lib/axios";
import { Album, Song, Stats } from "@/types";
import toast from "react-hot-toast";
import { create } from "zustand";

interface MusicStore {
	songs: Song[];
	albums: Album[];
	isLoading: boolean;
	error: string | null;
	currentAlbum: Album | null;
	featuredSongs: Song[];
	madeForYouSongs: Song[];
	trendingSongs: Song[];
	likedSongs: Song[];
	stats: Stats;

	fetchAlbums: () => Promise<void>;
	fetchAlbumById: (id: string) => Promise<void>;
	fetchFeaturedSongs: () => Promise<void>;
	fetchMadeForYouSongs: () => Promise<void>;
	fetchTrendingSongs: () => Promise<void>;
	fetchLikedSongs: () => Promise<void>;
	fetchStats: () => Promise<void>;
	fetchSongs: () => Promise<void>;
	deleteSong: (id: string) => Promise<void>;
	deleteAlbum: (id: string) => Promise<void>;
	toggleLike: (id: string) => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set) => ({
	albums: [],
	songs: [],
	isLoading: false,
	error: null,
	currentAlbum: null,
	madeForYouSongs: [],
	featuredSongs: [],
	trendingSongs: [],
	likedSongs: [],
	stats: {
		totalSongs: 0,
		totalAlbums: 0,
		totalUsers: 0,
		totalArtists: 0,
	},

	fetchLikedSongs: async () => {
		try {
			const response = await axiosInstance.get('/songs/liked');
			set({ likedSongs: response.data });
		} catch (error) {
			console.error('Error fetching liked songs:', error);
			toast.error('Failed to fetch liked songs');
		}
	},

	toggleLike: async (id) => {
		try {
			const response = await axiosInstance.post(`/songs/${id}/toggle-like`);
			
			// Update the song in all relevant lists
			set((state) => ({
				songs: state.songs.map((song) =>
					song._id === id ? { ...song, isLiked: response.data.isLiked, userId: response.data.userId } : song
				),
				featuredSongs: state.featuredSongs.map((song) =>
					song._id === id ? { ...song, isLiked: response.data.isLiked, userId: response.data.userId } : song
				),
				madeForYouSongs: state.madeForYouSongs.map((song) =>
					song._id === id ? { ...song, isLiked: response.data.isLiked, userId: response.data.userId } : song
				),
				trendingSongs: state.trendingSongs.map((song) =>
					song._id === id ? { ...song, isLiked: response.data.isLiked, userId: response.data.userId } : song
				),
			}));

			// Refresh liked songs after toggling
			const likedSongsResponse = await axiosInstance.get('/songs/liked');
			set({ likedSongs: likedSongsResponse.data });

			toast.success(response.data.isLiked ? "Added to Liked Songs" : "Removed from Liked Songs");
		} catch (error: any) {
			console.error("Error toggling like:", error);
			const errorMessage = error.response?.data?.message || "Failed to update like status";
			toast.error(errorMessage);
			
			// Refresh songs to ensure UI is in sync with server
			try {
				const response = await axiosInstance.get("/songs");
				set({ songs: response.data });
			} catch (refreshError) {
				console.error("Error refreshing songs:", refreshError);
			}
		}
	},

	deleteSong: async (id) => {
		set({ isLoading: true, error: null });
		try {
			await axiosInstance.delete(`/admin/songs/${id}`);

			set((state) => ({
				songs: state.songs.filter((song) => song._id !== id),
			}));
			toast.success("Song deleted successfully");
		} catch (error: any) {
			console.log("Error in deleteSong", error);
			toast.error("Error deleting song");
		} finally {
			set({ isLoading: false });
		}
	},

	deleteAlbum: async (id) => {
		set({ isLoading: true, error: null });
		try {
			await axiosInstance.delete(`/admin/albums/${id}`);
			set((state) => ({
				albums: state.albums.filter((album) => album._id !== id),
				songs: state.songs.map((song) =>
					song.albumId === state.albums.find((a) => a._id === id)?.title ? { ...song, album: null } : song
				),
			}));
			toast.success("Album deleted successfully");
		} catch (error: any) {
			toast.error("Failed to delete album: " + error.message);
		} finally {
			set({ isLoading: false });
		}
	},

	fetchSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/songs");
			set({ songs: response.data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchStats: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/stats");
			set({ stats: response.data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchAlbums: async () => {
		set({ isLoading: true, error: null });

		try {
			const response = await axiosInstance.get("/albums");
			if (response && response.data) {
				set({ albums: response.data });
			} else {
				set({ albums: [], error: "No data received from server" });
			}
		} catch (error: any) {
			const errorMessage = error.response?.data?.message || error.message || "Failed to fetch albums";
			set({ albums: [], error: errorMessage });
			console.error("Error fetching albums:", error);
		} finally {
			set({ isLoading: false });
		}
	},

	fetchAlbumById: async (id) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get(`/albums/${id}`);
			set({ currentAlbum: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchFeaturedSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/songs/featured");
			set({ featuredSongs: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchMadeForYouSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/songs/made-for-you");
			set({ madeForYouSongs: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchTrendingSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/songs/trending");
			set({ trendingSongs: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},
}));
