import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { toast } from "react-hot-toast";
import { useMusicStore } from "./useMusicStore";

interface LyricsStore {
    lyrics: string | null;
    isLoading: boolean;
    error: string | null;
    fetchLyrics: (songId: string) => Promise<void>;
}

export const useLyricsStore = create<LyricsStore>((set) => ({
    lyrics: null,
    isLoading: false,
    error: null,

    fetchLyrics: async (songId: string) => {
        set({ isLoading: true, error: null });
        try {
            // Get song details from music store
            const songs = useMusicStore.getState().songs;
            const song = songs.find(s => s._id === songId);

            if (!song) {
                throw new Error("Song not found");
            }

            // Format song title and artist for search
            const searchQuery = encodeURIComponent(`${song.title} ${song.artist}`);

            // Use Genius API to search for lyrics
            const response = await fetch(`https://genius-song-lyrics1.p.rapidapi.com/search?q=${searchQuery}&per_page=1&page=1`, {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': '2144e98519msh6d88c2f5d56c66fp1c1f8djsn4d044a95c2c6',
                    'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
                }
            });

            const data = await response.json();

            if (data.hits && data.hits.length > 0) {
                // Get lyrics for the first result
                const songId = data.hits[0].result.id;
                const lyricsResponse = await fetch(`https://genius-song-lyrics1.p.rapidapi.com/song/lyrics/?id=${songId}`, {
                    method: 'GET',
                    headers: {
                        'X-RapidAPI-Key': '2144e98519msh6d88c2f5d56c66fp1c1f8djsn4d044a95c2c6',
                        'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
                    }
                });

                const lyricsData = await lyricsResponse.json();

                if (lyricsData.lyrics && lyricsData.lyrics.lyrics.body) {
                    set({ lyrics: lyricsData.lyrics.lyrics.body.plain });
                } else {
                    throw new Error("No lyrics found");
                }
            } else {
                throw new Error("No lyrics found for this song");
            }
        } catch (error: any) {
            console.error("Error fetching lyrics:", error);
            const errorMessage = error.message || "Failed to fetch lyrics";
            set({ error: errorMessage, lyrics: null });
            toast.error(errorMessage);
        } finally {
            set({ isLoading: false });
        }
    },
})); 