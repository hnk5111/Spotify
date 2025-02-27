import { create } from "zustand";
import { Song } from "@/types";
import { useChatStore } from "./useChatStore";

interface PlayerStore {
	currentSong: Song | null;
	isPlaying: boolean;
	queue: Song[];
	playedSongs: Song[];
	currentIndex: number;
	progress: number;
	duration: number;

	initializeQueue: (songs: Song[]) => void;
	playAlbum: (songs: Song[], startIndex?: number) => void;
	setCurrentSong: (song: Song | null) => void;
	togglePlay: () => void;
	playNext: () => void;
	playPrevious: () => void;
	setProgress: (time: number) => void;
	setDuration: (time: number) => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
	currentSong: null,
	isPlaying: false,
	queue: [],
	playedSongs: [],
	currentIndex: -1,
	progress: 0,
	duration: 0,

	initializeQueue: (songs: Song[]) => {
		const currentSong = get().currentSong || songs[0];
		const currentIndex = songs.findIndex(song => song._id === currentSong._id);
		
		set({
			queue: songs,
			currentSong: currentSong,
			currentIndex: currentIndex !== -1 ? currentIndex : 0,
			playedSongs: currentSong ? [currentSong] : [],
			progress: 0,
			duration: currentSong?.duration || 0,
		});
	},

	playAlbum: (songs: Song[], startIndex = 0) => {
		if (songs.length === 0) return;

		const song = songs[startIndex];

		const socket = useChatStore.getState().socket;
		if (socket.auth) {
			socket.emit("update_activity", {
				userId: socket.auth.userId,
				activity: `Playing ${song.title} by ${song.artist}`,
			});
		}

		set({
			queue: songs,
			currentSong: song,
			currentIndex: startIndex,
			isPlaying: true,
			playedSongs: [song],
			progress: 0,
			duration: song.duration || 0,
		});
	},

	setCurrentSong: (song: Song | null) => {
		if (!song) return;

		const socket = useChatStore.getState().socket;
		if (socket.auth) {
			socket.emit("update_activity", {
				userId: socket.auth.userId,
				activity: `Playing ${song.title} by ${song.artist}`,
			});
		}

		const songIndex = get().queue.findIndex((s) => s._id === song._id);
		set((state) => ({
			currentSong: song,
			isPlaying: true,
			currentIndex: songIndex !== -1 ? songIndex : state.currentIndex,
			playedSongs: [...state.playedSongs, song],
			progress: 0,
			duration: song.duration || 0,
		}));
	},

	togglePlay: () => {
		const willStartPlaying = !get().isPlaying;

		const currentSong = get().currentSong;
		const socket = useChatStore.getState().socket;
		if (socket.auth) {
			socket.emit("update_activity", {
				userId: socket.auth.userId,
				activity:
					willStartPlaying && currentSong ? `Playing ${currentSong.title} by ${currentSong.artist}` : "Idle",
			});
		}

		set({
			isPlaying: willStartPlaying,
		});
	},

	playNext: () => {
		const { currentIndex, queue, currentSong } = get();
		const nextIndex = currentIndex + 1;

		if (nextIndex < queue.length) {
			const nextSong = queue[nextIndex];

			const socket = useChatStore.getState().socket;
			if (socket.auth) {
				socket.emit("update_activity", {
					userId: socket.auth.userId,
					activity: `Playing ${nextSong.title} by ${nextSong.artist}`,
				});
			}

			set((state) => ({
				currentSong: nextSong,
				currentIndex: nextIndex,
				isPlaying: true,
				playedSongs: currentSong ? [...state.playedSongs, nextSong] : [nextSong],
				progress: 0,
				duration: nextSong.duration || 0,
			}));
		} else {
			// No next song, loop back to the first song
			if (queue.length > 0) {
				const firstSong = queue[0];
				
				const socket = useChatStore.getState().socket;
				if (socket.auth) {
					socket.emit("update_activity", {
						userId: socket.auth.userId,
						activity: `Playing ${firstSong.title} by ${firstSong.artist}`,
					});
				}

				set((state) => ({
					currentSong: firstSong,
					currentIndex: 0,
					isPlaying: true,
					playedSongs: currentSong ? [...state.playedSongs, firstSong] : [firstSong],
					progress: 0,
					duration: firstSong.duration || 0,
				}));
			} else {
				set({ isPlaying: false });
				
				const socket = useChatStore.getState().socket;
				if (socket.auth) {
					socket.emit("update_activity", {
						userId: socket.auth.userId,
						activity: `Idle`,
					});
				}
			}
		}
	},

	playPrevious: () => {
		const { currentIndex, queue, currentSong } = get();
		const prevIndex = currentIndex - 1;

		if (prevIndex >= 0) {
			const prevSong = queue[prevIndex];

			const socket = useChatStore.getState().socket;
			if (socket.auth) {
				socket.emit("update_activity", {
					userId: socket.auth.userId,
					activity: `Playing ${prevSong.title} by ${prevSong.artist}`,
				});
			}

			set((state) => ({
				currentSong: prevSong,
				currentIndex: prevIndex,
				isPlaying: true,
				playedSongs: currentSong ? [...state.playedSongs, prevSong] : [prevSong],
				progress: 0,
				duration: prevSong.duration || 0,
			}));
		} else {
			// If at the start, loop to the last song
			if (queue.length > 0) {
				const lastSong = queue[queue.length - 1];
				
				const socket = useChatStore.getState().socket;
				if (socket.auth) {
					socket.emit("update_activity", {
						userId: socket.auth.userId,
						activity: `Playing ${lastSong.title} by ${lastSong.artist}`,
					});
				}

				set((state) => ({
					currentSong: lastSong,
					currentIndex: queue.length - 1,
					isPlaying: true,
					playedSongs: currentSong ? [...state.playedSongs, lastSong] : [lastSong],
					progress: 0,
					duration: lastSong.duration || 0,
				}));
			} else {
				set({ isPlaying: false });
				
				const socket = useChatStore.getState().socket;
				if (socket.auth) {
					socket.emit("update_activity", {
						userId: socket.auth.userId,
						activity: `Idle`,
					});
				}
			}
		}
	},

	setProgress: (time: number) => {
		set({ progress: time });
	},

	setDuration: (time: number) => {
		set({ duration: time });
	},
}));
