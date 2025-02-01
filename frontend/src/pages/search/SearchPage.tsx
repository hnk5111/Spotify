import { useState, useEffect } from 'react';
import axios from 'axios';
import { useDebounce } from '@/hooks/useDebounce';
import SearchResultsSkeleton from '@/components/skeletons/SearchResultsSkeleton';

interface Song {
  id: string;
  title: string;
  artist: string;
  albumId: string | null;
  duration: number;
  url: string;
  imageUrl: string;
}

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const searchSongs = async () => {
      if (!debouncedQuery) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get(`/api/search?q=${debouncedQuery}`);
        setResults(response.data);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    searchSongs();
  }, [debouncedQuery]);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search songs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 rounded-lg bg-zinc-800 text-white"
        />
      </div>

      {isLoading ? (
        <SearchResultsSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((song) => (
            <div 
              key={song.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-card"
            >
              <img 
                src={song.imageUrl} 
                alt={song.title}
                className="w-12 h-12 rounded-md object-cover"
              />
              <div>
                <h3 className="font-medium">{song.title}</h3>
                <p className="text-sm text-zinc-400">{song.artist}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage; 