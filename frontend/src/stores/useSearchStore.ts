import { create } from "zustand";
import axios from "axios";

interface Song {
  id: string;
  title: string;
  artist: string;
  albumId: string;
  duration: number;
  url: string;
  imageUrl: string;
  // Add other song properties as needed
}

interface SearchStore {
  searchQuery: string;
  searchResults: Song[];
  isLoading: boolean;
  setSearchQuery: (query: string) => void;
  searchSongs: (query: string) => Promise<void>;
  clearSearch: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  recentSearches: string[];
  addRecentSearch: (term: string) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  searchQuery: "",
  searchResults: [],
  isLoading: false,
  setSearchQuery: (query) => set({ searchQuery: query }),
  searchSongs: async (query) => {
    if (!query.trim()) {
      set({ searchResults: [], isLoading: false });
      return;
    }

    set({ isLoading: true });
    try {
      const response = await axios.get(`/api/search?q=${encodeURIComponent(query)}`);
      set({ 
        searchResults: Array.isArray(response.data) ? response.data : [], 
        isLoading: false 
      });
    } catch (error) {
      console.error("Search error:", error);
      set({ searchResults: [], isLoading: false });
    }
  },
  clearSearch: () => set({ searchQuery: "", searchResults: [] }),
  searchTerm: '',
  setSearchTerm: (term) => set({ searchTerm: term }),
  recentSearches: [],
  addRecentSearch: (term) => 
    set((state) => ({
      recentSearches: [
        term,
        ...state.recentSearches.filter(t => t !== term)
      ].slice(0, 5)
    })),
})); 