import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMusicStore } from "@/stores/useMusicStore";
import { SignedIn, UserButton } from "@clerk/clerk-react";
import { HomeIcon, Library, MessageCircle, Users, Heart, Bell, User, ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FriendsActivity } from "./FriendsActivity";

interface LeftSidebarProps {
  onNavigate?: () => void;
}

const LeftSidebar = ({ onNavigate }: LeftSidebarProps) => {
  const { albums, fetchAlbums, isLoading } = useMusicStore();
  const location = useLocation();
  const [showPlaylists, setShowPlaylists] = useState(false);

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  const mainNavItems = [
    { icon: HomeIcon, label: "Home", path: "/" },
    { icon: MessageCircle, label: "Messages", path: "/chat" },
    { icon: Users, label: "Search Users", path: "/users" },
    { icon: Users, label: "Friends", path: "/friends" },
    { icon: Bell, label: "Notifications", path: "/notifications" },
    { icon: Heart, label: "Mood Playlist", path: "/mood" },
    { icon: User, label: "Dashboard", path: "/dashboard" }
  ];

  const handleNavigation = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <div className="h-full flex flex-col gap-2">
      {/* Navigation menu */}
      <div className="rounded-lg bg-card/50 p-4 border border-border/50 shadow-sm">
        <div className="space-y-2">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-10 w-10 lg:hidden",
              },
            }}
          />

          <SignedIn>
            {mainNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleNavigation}
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    className: cn(
                      "w-full justify-start text-foreground hover:bg-secondary/80 transition-all duration-200",
                      location.pathname === item.path && "bg-secondary"
                    ),
                  })
                )}
              >
                <item.icon className="mr-2 size-5" />
                <span className="md:inline">{item.label}</span>
              </Link>
            ))}

            {/* Playlists Section */}
            <button
              onClick={() => setShowPlaylists(!showPlaylists)}
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  className: "w-full justify-start text-foreground hover:bg-secondary/80 transition-all duration-200"
                })
              )}
            >
              <Library className="mr-2 size-5" />
              <span className="md:inline flex-1 text-left">Playlists</span>
              {showPlaylists ? (
                <ChevronDown className="size-4" />
              ) : (
                <ChevronRight className="size-4" />
              )}
            </button>

            {showPlaylists && (
              <div className="pl-4 space-y-1">
                {isLoading ? (
                  <PlaylistSkeleton />
                ) : (
                  albums.map((album) => (
                    <Link
                      to={`/albums/${album._id}`}
                      key={album._id}
                      onClick={handleNavigation}
                      className="p-2 hover:bg-secondary/80 rounded-lg flex items-center gap-3 group cursor-pointer
                               transition-all duration-200"
                    >
                      <img
                        src={album.imageUrl}
                        alt="Playlist img"
                        className="size-10 rounded-lg flex-shrink-0 object-cover shadow-sm"
                      />

                      <div className="flex-1 min-w-0 md:block">
                        <p className="font-medium truncate text-foreground">
                          {album.title}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          Album • {album.artist}
                        </p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </SignedIn>
        </div>
      </div>

      {/* Mobile Friends Activity */}
      <div className="lg:hidden">
        <FriendsActivity isMobile={true} />
      </div>
    </div>
  );
};

export default LeftSidebar;
