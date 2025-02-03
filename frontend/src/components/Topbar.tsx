import { SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon, Search, Loader2, X } from "lucide-react";
import { Link } from "react-router-dom";
import SignInOAuthButtons from "./SignInOAuthButtons";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSearchStore } from "@/stores/useSearchStore";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { Input } from "./ui/input";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

const Topbar = () => {
  const { isAdmin } = useAuthStore();
  const { 
    searchQuery, 
    searchResults, 
    isLoading, 
    setSearchQuery, 
    searchSongs,
    clearSearch 
  } = useSearchStore();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (debouncedSearch) {
      searchSongs(debouncedSearch);
    }
  }, [debouncedSearch, searchSongs]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchClose = () => {
    setShowMobileSearch(false);
    setShowResults(false);
    clearSearch();
  };

  return (
    <>
      {/* Regular Topbar */}
      <div className='flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 backdrop-blur-md z-10'>
        <div className='flex gap-2 items-center'>
          <img src='/spotify.png' className='size-8' alt='Spotify logo' />
          <span className="hidden xs:inline">Spotify</span>
        </div>
        
        {/* Desktop Search */}
        <div className='hidden md:flex flex-1 max-w-md mx-4' ref={searchRef}>
          <div className='relative w-full'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 size-4' />
            {isLoading && (
              <Loader2 className='absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 size-4 animate-spin' />
            )}
            <Input 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              placeholder="Search songs, albums..." 
              className='w-full pl-10 pr-10 bg-zinc-800 border-zinc-700'
            />
            
            {/* Desktop Search Results */}
            {showResults && searchResults && (
              <div className='absolute top-full left-0 right-0 mt-2 bg-zinc-800 rounded-md shadow-lg max-h-96 overflow-y-auto'>
                {searchResults.length === 0 && !isLoading && searchQuery && (
                  <div className='p-3 text-sm text-zinc-400'>
                    No results found
                  </div>
                )}
                {Array.isArray(searchResults) && searchResults.map((song) => (
                  <Link
                    key={song.id}
                    to={`/albums/${song.albumId}?track=${song.id}`}
                    className='flex items-center gap-3 p-3 hover:bg-zinc-700 transition-colors'
                    onClick={() => {
                      setShowResults(false);
                      clearSearch();
                    }}
                  >
                    <img 
                      src={song.imageUrl} 
                      alt={song.title}
                      className="h-12 w-12 object-cover rounded"
                    />
                    <div className='flex-1'>
                      <p className='text-sm font-medium text-white'>{song.title}</p>
                      <p className='text-xs text-zinc-400'>{song.artist}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className='flex items-center gap-2 sm:gap-4'>
          {/* Mobile Search Button */}
          <button 
            onClick={() => setShowMobileSearch(true)}
            className="md:hidden p-2 hover:bg-zinc-800 rounded-full"
          >
            <Search className="size-5" />
          </button>

          {isAdmin && (
            <Link 
              to={"/admin"} 
              className={cn(
                buttonVariants({ variant: "outline" }), 
                "hidden sm:flex"
              )}
            >
              <LayoutDashboardIcon className='size-4 mr-2' />
              <span className="hidden sm:inline">Admin Dashboard</span>
            </Link>
          )}

          <SignedOut>
            <SignInOAuthButtons />
          </SignedOut>

          <UserButton />
        </div>
      </div>

      {/* Mobile Search Modal */}
      {showMobileSearch && (
        <div className='fixed inset-0 bg-black z-50 p-4 md:hidden'>
          <div className='flex flex-col h-full'>
            <div className='flex items-center gap-4 mb-4'>
              <div className='relative flex-1'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 size-4' />
                {isLoading && (
                  <Loader2 className='absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 size-4 animate-spin' />
                )}
                <Input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search songs, albums..." 
                  className='w-full pl-10 pr-10 bg-zinc-800 border-zinc-700'
                  autoFocus
                />
              </div>
              <button 
                onClick={handleSearchClose}
                className="p-2 hover:bg-zinc-800 rounded-full"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Mobile Search Results */}
            <div className='flex-1 overflow-y-auto'>
              {searchResults.length === 0 && !isLoading && searchQuery && (
                <div className='p-3 text-sm text-zinc-400'>
                  No results found
                </div>
              )}
              {Array.isArray(searchResults) && searchResults.map((song) => (
                <Link
                  key={song.id}
                  to={`/albums/${song.albumId}?track=${song.id}`}
                  className='flex items-center gap-3 p-3 hover:bg-zinc-700 transition-colors'
                  onClick={handleSearchClose}
                >
                  <img 
                    src={song.imageUrl} 
                    alt={song.title}
                    className="h-12 w-12 object-cover rounded"
                  />
                  <div className='flex-1'>
                    <p className='text-sm font-medium text-white'>{song.title}</p>
                    <p className='text-xs text-zinc-400'>{song.artist}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Topbar;