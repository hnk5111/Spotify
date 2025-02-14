import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { HeadphonesIcon, Users } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { useSocket } from "@/hooks/useSocket";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface Friend {
  clerkId: string;
  fullName: string;
  imageUrl: string;
  username: string;
  bio?: string;
  lastSeen?: string;
}

export const FriendsActivity = ({
  isMobile = false,
}: {
  isMobile?: boolean;
}) => {
  const { isSignedIn } = useUser();
  const socket = useSocket();
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  const {
    data: friends = [],
    isLoading,
  } = useQuery<Friend[]>({
    queryKey: ["friends"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/friends");
      return data;
    },
    retry: false,
    enabled: !!isSignedIn,
  });

  useEffect(() => {
    if (!socket) return;

    // Listen for online users
    socket.on("online_users", (users: string[]) => {
      setOnlineUsers(new Set(users));
    });

    // Listen for user connected
    socket.on("user_connected", (userId: string) => {
      setOnlineUsers((prev) => new Set([...prev, userId]));
    });

    // Listen for user disconnected
    socket.on("user_disconnected", (userId: string) => {
      setOnlineUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    });

    // Request current online users
    socket.emit("get_online_users");

    return () => {
      socket.off("online_users");
      socket.off("user_connected");
      socket.off("user_disconnected");
    };
  }, [socket]);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="h-full bg-card/50 backdrop-blur-sm border-white/10">
      <div className="p-4 border-b border-white/10">
        <h2 className="font-semibold">Friends Activity</h2>
      </div>
      <ScrollArea className="h-[calc(100%-60px)]">
        <div className="p-4 space-y-4">
          {friends.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              Add friends to see their activity
            </p>
          ) : (
            friends.map((friend) => (
              <Link
                key={friend.clerkId}
                to={`/profile/${friend.clerkId}`}
                className="block"
              >
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="relative">
                    <Avatar className="h-10 w-10 border border-white/10">
                      <AvatarImage src={friend.imageUrl} alt={friend.fullName} />
                      <AvatarFallback>
                        {friend.fullName[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className={cn(
                        "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                        onlineUsers.has(friend.clerkId)
                          ? "bg-green-500"
                          : "bg-muted"
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{friend.fullName}</p>
                      <Badge
                        variant={
                          onlineUsers.has(friend.clerkId) ? "default" : "secondary"
                        }
                        className="h-5"
                      >
                        {onlineUsers.has(friend.clerkId) ? "Online" : "Offline"}
                      </Badge>
                    </div>
                    {friend.bio && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {friend.bio}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};
