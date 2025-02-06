import { create } from "zustand";
// import axios from "axios";

interface Song {
  downloadUrl: any;
  id: string;
  name: string;
  artists: {
    all: {
      name: string;
    }[];
  };
  albumId: string;
  duration: number;
  url: string;
  image: {
    url: string;
  }[];
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
      const responseData = await fetch(`https://saavn.dev/api/search/songs?query=${encodeURIComponent(query)}`);
      const response = await responseData.json();
      console.log(response.data.results)

      const transformedResults = response.data.results.map((song: any) => {
        const downloadUrl = song.downloadUrl.reduce((prev: any, curr: any) => {
          return (prev.quality > curr.quality) ? prev : curr;
        });

        return {
          ...song,
          downloadUrl: [{
            url: downloadUrl.url, // Use the original URL without conversion
            quality: downloadUrl.quality
          }]
        };
      });

      set({
        searchResults: transformedResults,
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