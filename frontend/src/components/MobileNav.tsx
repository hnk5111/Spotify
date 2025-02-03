import { Home, Library, MessageCircle, Search, ListMusic, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { ScrollArea } from "./ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const MobileNav = () => {
  const location = useLocation();
  const { playlists } = usePlaylistStore();
  
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: MessageCircle, label: "Chat", path: "/chat" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Main Navigation */}
      <div className="flex justify-around items-center p-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center space-y-1 ${
              location.pathname === item.path ? "text-green-500" : "text-zinc-400"
            }`}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
        
        {/* Library/Playlist Sheet */}
        <Sheet>
          <SheetTrigger className="flex flex-col items-center space-y-1 text-zinc-400">
            <Library className="h-6 w-6" />
            <span className="text-xs">Library</span>
          </SheetTrigger>
          <SheetContent side="left" className="w-[80%] p-0">
            <ScrollArea className="h-full">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Your Library</h2>
                
                {/* Playlists */}
                {playlists.length > 0 ? (
                  <div className="space-y-4">
                    {playlists.map((playlist) => (
                      <Link
                        key={playlist._id}
                        to={`/playlists/${playlist._id}`}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <ListMusic className="h-5 w-5 text-zinc-400" />
                          <div>
                            <p className="font-medium">{playlist.title}</p>
                            <p className="text-sm text-zinc-400">Playlist</p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-zinc-400" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-zinc-400 text-center">No playlists yet</p>
                )}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default MobileNav; 