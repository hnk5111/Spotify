import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useMusicStore } from "@/stores/useMusicStore";
import { SignedIn, UserButton } from "@clerk/clerk-react";
import { HomeIcon, Library, MessageCircle, Users } from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FriendsActivity } from "./FriendsActivity";

const LeftSidebar = () => {
  const { albums, fetchAlbums, isLoading } = useMusicStore();
  const location = useLocation();

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  const navItems = [
    { icon: HomeIcon, label: "Home", path: "/" },
    { icon: MessageCircle, label: "Messages", path: "/chat" },
    { icon: Users, label: "Search Users", path: "/users" },
    { icon: Users, label: "Friends", path: "/friends" },
  ];

  return (
    <div className="h-full flex flex-col gap-2">
      {/* Navigation menu */}
      <div className="rounded-lg bg-zinc-900 p-4">
        <div className="space-y-2">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-10 w-10 lg:hidden",
              },
            }}
          />

          <SignedIn>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    className: cn(
                      "w-full justify-start text-white hover:bg-zinc-800",
                      location.pathname === item.path && "bg-zinc-800"
                    ),
                  })
                )}
              >
                <item.icon className="mr-2 size-5" />
                <span className="md:inline">{item.label}</span>
              </Link>
            ))}
          </SignedIn>
        </div>
      </div>

      {/* Library section */}
      <div className="flex-1 rounded-lg bg-zinc-900 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-white px-2">
            <Library className="size-5 mr-2" />
            <span className="md:inline">Playlists</span>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="space-y-2">
            {isLoading ? (
              <PlaylistSkeleton />
            ) : (
              albums.map((album) => (
                <Link
                  to={`/albums/${album._id}`}
                  key={album._id}
                  className="p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer"
                >
                  <img
                    src={album.imageUrl}
                    alt="Playlist img"
                    className="size-12 rounded-md flex-shrink-0 object-cover"
                  />

                  <div className="flex-1 min-w-0 md:block">
                    <p className="font-medium truncate">{album.title}</p>
                    <p className="text-sm text-zinc-400 truncate">
                      Album • {album.artist}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Mobile Friends Activity */}
      <div className="lg:hidden">
        <FriendsActivity isMobile={true} />
      </div>
    </div>
  );
};

export default LeftSidebar;
