import { SignedOut, UserButton, SignedIn } from "@clerk/clerk-react";
import { LayoutDashboardIcon, Search, Loader2, X } from "lucide-react";
import { Link } from "react-router-dom";
import SignInOAuthButtons from "./SignInOAuthButtons";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSearchStore } from "@/stores/useSearchStore";
import { useSidebarStore } from "@/stores/useSidebarStore";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { Input } from "./ui/input";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import PlayButton from "@/pages/home/components/PlayButton";
import { EditProfileDialog } from "./profile/EditProfileDialog";
import { ThemeToggle } from "./ui/theme-toggle";

const Topbar = () => {
  const { isAdmin } = useAuthStore();
  const {
    searchQuery,
    searchResults,
    isLoading,
    setSearchQuery,
    searchSongs,
    clearSearch,
  } = useSearchStore();
  const { setIsVisible } = useSidebarStore();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebounce(searchQuery, 300);

  // const playSong = {
  //   _id: "",
  //   title: "",
  //   artist: "",
  //   imageUrl: "",
  //   audioUrl: "",
  // };

  useEffect(() => {
    if (showMobileSearch) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  }, [showMobileSearch, setIsVisible]);

  useEffect(() => {
    if (debouncedSearch) {
      searchSongs(debouncedSearch);
    }
  }, [debouncedSearch, searchSongs]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
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
    setIsVisible(true);
  };

  return (
    <>
      {/* Regular Topbar */}
      <div className="flex items-center justify-end p-4 sticky top-0 bg-background/75 dark:bg-background/90 backdrop-blur-md z-10 border-b border-border">
        <div className="flex-1 hidden md:flex gap-2 items-center">
          <img src="/logo.png" className="size-10" alt="BeatBond logo" />
          <span className="font-semibold tracking-tight">BeatBond</span>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-4" ref={searchRef}>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
            {isLoading && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4 animate-spin" />
            )}
            <Input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              placeholder="Search songs, albums..."
              className="w-full pl-10 pr-10 bg-secondary/50 dark:bg-secondary/30 border-border focus:ring-primary"
            />

            {/* Desktop Search Results */}
            {showResults && searchResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-md shadow-lg max-h-96 overflow-y-auto border border-border">
                {searchResults.length === 0 && !isLoading && searchQuery && (
                  <div className="p-3 text-sm text-muted-foreground">
                    No results found
                  </div>
                )}
                {Array.isArray(searchResults) &&
                  searchResults.map((song) => (
                    <div
                      key={song.id}
                      className="flex items-center gap-3 p-3 bg-card/50 hover:bg-secondary/50 
                               transition-all duration-200 group cursor-pointer relative"
                      onClick={() => {
                        setShowResults(false);
                        clearSearch();
                      }}
                    >
                      <img
                        src={song.image[2]?.url || "/default-image.png"}
                        alt={song.name}
                        className="h-12 w-12 object-cover rounded shadow-md"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {song.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {song.artists.all[0].name}
                        </p>
                        <PlayButton
                          song={{
                            _id: song.id,
                            title: song.name,
                            artist:
                              song.artists?.all?.[0]?.name || "Unknown Artist",
                            imageUrl:
                              song.image?.[2]?.url ||
                              song.image?.[1]?.url ||
                              song.image?.[0]?.url ||
                              "/default-image.png",
                            audioUrl: song.downloadUrl?.[0]?.url || "",
                            albumId: song.albumId || "",
                            duration: Number(song.duration) || 0,
                            createdAt: "",
                            updatedAt: "",
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Mobile Search Button */}
          <button
            onClick={() => setShowMobileSearch(true)}
            className="md:hidden p-2 hover:bg-secondary/50 rounded-full transition-colors"
          >
            <Search className="size-5" />
          </button>

          {isAdmin && (
            <Link
              to={"/admin"}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "hidden sm:flex hover:bg-secondary/50 transition-colors"
              )}
            >
              <LayoutDashboardIcon className="size-4 mr-2" />
              <span className="hidden sm:inline">Admin Dashboard</span>
            </Link>
          )}

          <SignedOut>
            <SignInOAuthButtons />
          </SignedOut>

          <SignedIn>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <EditProfileDialog />
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>
      </div>

      {/* Mobile Search Modal */}
      {showMobileSearch && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 p-4 md:hidden">
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
                {isLoading && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4 animate-spin" />
                )}
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search songs, albums..."
                  className="w-full pl-10 pr-10 bg-secondary/50 dark:bg-secondary/30 border-border focus:ring-primary"
                  autoFocus
                />
              </div>
              <button
                onClick={handleSearchClose}
                className="p-2 hover:bg-secondary/50 rounded-full transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Mobile Search Results */}
            <div className="flex-1 overflow-y-auto">
              {searchResults.length === 0 && !isLoading && searchQuery && (
                <div className="p-3 text-sm text-muted-foreground">
                  No results found
                </div>
              )}
              {Array.isArray(searchResults) &&
                searchResults.map((song) => (
                  <div
                    key={song.id}
                    className="flex items-center gap-5 p-3 m-2 bg-card/50 rounded-md overflow-hidden
                             hover:bg-secondary/50 transition-all duration-200 group cursor-pointer relative"
                    onClick={handleSearchClose}
                  >
                    <img
                      src={song.image[2].url}
                      alt={song.name}
                      className="h-12 w-12 object-cover rounded shadow-md"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {song.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {song.artists.all[0].name}
                      </p>
                      <PlayButton
                        song={{
                          _id: song.id,
                          title: song.name,
                          artist:
                            song.artists?.all?.[0]?.name || "Unknown Artist",
                          imageUrl:
                            song.image?.[2]?.url ||
                            song.image?.[1]?.url ||
                            song.image?.[0]?.url ||
                            "/default-image.png",
                          audioUrl: song.downloadUrl?.[0]?.url || "",
                          albumId: song.albumId || "",
                          duration: Number(song.duration) || 0,
                          createdAt: "",
                          updatedAt: "",
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Topbar;
