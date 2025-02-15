import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { HeadphonesIcon, Users } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

interface Friend {
  _id: string;
  fullName: string;
  imageUrl: string;
  currentlyPlaying?: {
    songName: string;
    artistName: string;
  };
}

export const FriendsActivity = ({
  isMobile = false,
}: {
  isMobile?: boolean;
}) => {
  const { isSignedIn } = useUser();
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
        className={`h-full bg-card rounded-xl border border-border flex flex-col ${
          isMobile ? "p-4" : ""
        }`}
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
              Connect with friends and discover the music they're enjoying right
              now
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`h-full bg-card rounded-xl border border-border flex flex-col ${
        isMobile ? "p-4" : ""
      }`}
    >
      <div className="p-4 flex justify-between items-center border-b border-border">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-foreground" />
          <h2 className="font-semibold text-foreground">Friend Activity</h2>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {isLoading ? (
            <div className="text-sm text-muted-foreground">
              Loading friends...
            </div>
          ) : error ? (
            <div className="text-sm text-destructive">
              Failed to load friends
            </div>
          ) : friends.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No friends found
            </div>
          ) : (
            friends.map((friend) => (
              <div
                key={friend._id}
                className="flex items-start gap-3 group hover:bg-secondary/50 p-2 rounded-lg transition-all duration-200"
              >
                <Avatar className="w-10 h-10 border border-border/50">
                  <AvatarImage src={friend.imageUrl} />
                  <AvatarFallback>{friend.fullName[0]}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    {friend.fullName}
                  </p>
                  {friend.currentlyPlaying ? (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground truncate">
                        {friend.currentlyPlaying.songName}
                      </p>
                      <p className="text-xs text-muted-foreground/60 truncate">
                        {friend.currentlyPlaying.artistName}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground/60">
                      Not playing
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
