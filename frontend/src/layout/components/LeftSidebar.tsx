import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMusicStore } from "@/stores/useMusicStore";
import { SignedIn, SignedOut, useClerk } from "@clerk/clerk-react";
import { HomeIcon, Library, MessageCircle, Users, Heart, Bell, User, ChevronDown, ChevronRight, LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface LeftSidebarProps {
  onNavigate?: () => void;
}

const LeftSidebar = ({ onNavigate }: LeftSidebarProps) => {
  const { albums, fetchAlbums, isLoading } = useMusicStore();
  const location = useLocation();
  const [showPlaylists, setShowPlaylists] = useState(false);
  const { openSignIn } = useClerk();

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

  const handleGoogleSignIn = () => {
    openSignIn({
      redirectUrl: "/",
      appearance: {
        elements: {
          socialButtonsBlockButton: "gap-2"
        }
      }
    });
  };

  return (
    <div className="h-full flex flex-col gap-2">
      {/* Navigation menu */}
      <div className="rounded-lg bg-card/50 p-4 border border-border/50 shadow-sm">
        <div className="space-y-2">
          {/* <UserButton
            appearance={{
              elements: {
                avatarBox: "h-10 w-10 lg:hidden",
              },
            }}
          /> */}

          <SignedOut>
            <div className="flex flex-col items-center gap-4 py-8">
              <LogIn className="size-12 text-muted-foreground" />
              <div className="text-center">
                <h3 className="font-semibold text-lg">Sign in to BeatBond</h3>
                <p className="text-sm text-muted-foreground mt-1">Access playlists, friends, and more features</p>
              </div>
              <button
                onClick={handleGoogleSignIn}
                className={cn(
                  buttonVariants({
                    className: "w-full justify-center gap-2"
                  })
                )}
              >
                <svg className="size-5" viewBox="0 0 18 18">
                  <g fill="none" fillRule="evenodd">
                    <path fill="#4285F4" d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                    <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
                    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
                  </g>
                </svg>
                Continue with Google
              </button>
            </div>
          </SignedOut>

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
      {/* <div className="lg:hidden">
        <FriendsActivity isMobile={true} />
      </div> */}
    </div>
  );
};

export default LeftSidebar;
