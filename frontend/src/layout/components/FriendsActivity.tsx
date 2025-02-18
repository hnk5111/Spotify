import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { HeadphonesIcon, Users, Music, ChevronUp, ChevronDown, Maximize2, Minimize2 } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Friend {
  _id: string;
  fullName: string;
  imageUrl: string;
  currentlyPlaying?: {
    songName: string;
    artistName: string;
  };
}

interface FriendsActivityProps {
  isMobile?: boolean;
  isFloating?: boolean;
  onToggleFloat?: () => void;
}

export const FriendsActivity = ({
  isMobile = false,
  isFloating = false,
  onToggleFloat,
}: FriendsActivityProps) => {
  const { isSignedIn } = useUser();
  const [isCompact, setIsCompact] = useState(false);

  const {
    data: friends = [],
    isLoading,
    error,
  } = useQuery<Friend[]>({
    queryKey: ["friends"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/friends");
      return data;
    },
    retry: false,
    enabled: !!isSignedIn,
  });

  // Hide the component on mobile when not signed in
  if (!isSignedIn && isMobile) {
    return null;
  }

  if (!isSignedIn) {
    return (
      <div
        className={cn(
          "h-full bg-card rounded-xl border border-border flex flex-col",
          isMobile ? "p-4" : "",
          isFloating && "h-[400px]"
        )}
      >
        <div className="p-4 flex justify-between items-center border-b border-border">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-foreground" />
            <h2 className="font-semibold text-foreground">Friend Activity</h2>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur-lg opacity-50 animate-pulse" />
            <div className="relative bg-background rounded-full p-4 shadow-lg">
              <HeadphonesIcon className="w-8 h-8 text-primary" />
            </div>
          </div>

          <div className="space-y-3 max-w-[250px]">
            <h3 className="text-lg font-semibold text-foreground">
              See What Friends Are Playing
            </h3>
            <p className="text-sm text-muted-foreground">
              Connect with friends and discover the music they're enjoying right now
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "h-full bg-card rounded-xl border border-border flex flex-col",
        isMobile ? "p-4" : "",
        isFloating && "h-[400px]"
      )}
    >
      <div className="p-4 flex justify-between items-center border-b border-border">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-foreground" />
          <h2 className="font-semibold text-foreground">Friend Activity</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCompact(!isCompact)}
            className="hover:bg-secondary/80 p-1 rounded-md transition-colors"
          >
            {isCompact ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </button>
          {onToggleFloat && (
            <button
              onClick={onToggleFloat}
              className="hover:bg-secondary/80 p-1 rounded-md transition-colors"
            >
              {isFloating ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 transition-all duration-300 ease-in-out" scrollHideDelay={100}>
        <div className="p-4 space-y-4">
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/60" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-24 bg-secondary/60 rounded" />
                    <div className="h-3 w-32 bg-secondary/60 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-sm text-destructive">Failed to load friends</div>
          ) : friends.length === 0 ? (
            <div className="text-sm text-muted-foreground">No friends found</div>
          ) : (
            friends.map((friend) => (
              <div key={friend._id} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                
                <div className={cn(
                  "relative flex items-start gap-3 p-3 group-hover:transform group-hover:translate-x-1 transition-all duration-200",
                  isCompact && "py-2"
                )}>
                  <Avatar className="ring-2 ring-offset-2 ring-offset-background ring-primary/10 transition-all duration-300 group-hover:ring-primary/30">
                    <AvatarImage src={friend.imageUrl} />
                    <AvatarFallback>{friend.fullName[0]}</AvatarFallback>
                  </Avatar>
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground truncate">
                        {friend.fullName}
                      </p>
                      <span className="flex-shrink-0 w-2 h-2 rounded-full bg-green-500" />
                    </div>
                    
                    {!isCompact && friend.currentlyPlaying ? (
                      <div className="mt-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="animate-spin-slow w-3 h-3">
                            <Music className="w-3 h-3 text-primary" />
                          </div>
                          <p className="text-xs text-primary truncate">
                            {friend.currentlyPlaying.songName}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground/60 truncate">
                          {friend.currentlyPlaying.artistName}
                        </p>
                      </div>
                    ) : !isCompact ? (
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        Not playing
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
