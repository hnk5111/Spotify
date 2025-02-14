import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useMusicStore } from "@/stores/useMusicStore";
import { SignedIn, UserButton } from "@clerk/clerk-react";
import { Bell, HomeIcon, Library, MessageCircle, Settings, Users } from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FriendsActivity } from "./FriendsActivity";
import { Home, Search, MessageSquare, BellOff, Check, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { useSocket } from "@/hooks/useSocket";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "react-hot-toast";

interface LeftSidebarProps {
  onNavigate?: () => void;
}

interface Notification {
  _id: string;
  message: string;
  read: boolean;
  type: string;
  metadata?: {
    requestId?: string;
    senderId?: string;
    senderName?: string;
    senderImage?: string;
  };
  createdAt: string;
}

const LeftSidebar = ({ onNavigate }: LeftSidebarProps) => {
  const { albums, fetchAlbums, isLoading } = useMusicStore();
  const location = useLocation();
  const socket = useSocket();
  const queryClient = useQueryClient();
  const [hasUnread, setHasUnread] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  // Fetch notifications with sender details
  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/notifications");
      return data as Notification[];
    },
  });

  // Listen for new notifications
  useEffect(() => {
    if (!socket) return;

    socket.on("new_notification", () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      setHasUnread(true);
    });

    return () => {
      socket.off("new_notification");
    };
  }, [socket, queryClient]);

  // Mark notification as read
  const { mutate: markAsRead } = useMutation({
    mutationFn: async (notificationId: string) => {
      await axiosInstance.put(`/notifications/${notificationId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  // Mark all notifications as read
  const { mutate: markAllAsRead } = useMutation({
    mutationFn: async () => {
      await axiosInstance.put("/notifications/mark-all-read");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      setHasUnread(false);
    },
  });

  // Handle friend request response
  const { mutate: respondToRequest } = useMutation({
    mutationFn: async ({
      requestId,
      status,
    }: {
      requestId: string;
      status: string;
    }) => {
      await axiosInstance.put(`/friends/request/${requestId}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      toast.success("Friend request updated!");
    },
  });

  // Handle profile navigation
  const handleProfileClick = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/profile/${userId}`);
    if (onNavigate) {
      onNavigate();
    }
  };

  const navItems = [
    { icon: HomeIcon, label: "Home", path: "/" },
    { icon: MessageCircle, label: "Messages", path: "/chat" },
    { icon: Users, label: "Search Users", path: "/users" },
    { icon: Users, label: "Friends", path: "/friends" },
    { icon: Bell, label: "Notifications", path: "/notifications" },
    { icon: Settings, label: "Settings", path: "/settings" },
    
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
            {navItems.map((item) => (
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
          </SignedIn>
        </div>
      </div>

      {/* Library section */}
      <div className="flex-1 rounded-lg bg-card/50 p-4 border border-border/50 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-foreground px-2">
            <Library className="size-5 mr-2" />
            <span className="md:inline font-medium">Playlists</span>
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
                  onClick={handleNavigation}
                  className="p-2 hover:bg-secondary/80 rounded-lg flex items-center gap-3 group cursor-pointer
                           transition-all duration-200"
                >
                  <img
                    src={album.imageUrl}
                    alt="Playlist img"
                    className="size-12 rounded-lg flex-shrink-0 object-cover shadow-sm"
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
        </ScrollArea>
      </div>

      {/* Mobile Friends Activity */}
      <div className="lg:hidden">
        <FriendsActivity isMobile={true} />
      </div>

      <div className="flex flex-col gap-2">
        <Link
          to="/"
          className={cn(
            "flex items-center gap-4 text-sm font-medium p-3 hover:bg-accent rounded-lg transition-colors",
            location.pathname === "/" && "bg-accent"
          )}
        >
          <Home className="h-5 w-5" />
          Home
        </Link>

        <Link
          to="/search"
          className={cn(
            "flex items-center gap-4 text-sm font-medium p-3 hover:bg-accent rounded-lg transition-colors",
            location.pathname === "/search" && "bg-accent"
          )}
        >
          <Search className="h-5 w-5" />
          Search
        </Link>

        <Link
          to="/chat"
          className={cn(
            "flex items-center gap-4 text-sm font-medium p-3 hover:bg-accent rounded-lg transition-colors",
            location.pathname === "/chat" && "bg-accent"
          )}
        >
          <MessageSquare className="h-5 w-5" />
          Messages
        </Link>

        <Link
          to="/friends"
          className={cn(
            "flex items-center gap-4 text-sm font-medium p-3 hover:bg-accent rounded-lg transition-colors",
            location.pathname === "/friends" && "bg-accent"
          )}
        >
          <Users className="h-5 w-5" />
          Friends
        </Link>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-4 px-3",
                hasUnread && "text-primary"
              )}
            >
              {hasUnread ? (
                <Bell className="h-5 w-5" />
              ) : (
                <BellOff className="h-5 w-5" />
              )}
              Notifications
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <div className="flex items-center justify-between p-4 border-b">
              <h4 className="font-semibold">Notifications</h4>
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => markAllAsRead()}
                >
                  Mark all as read
                </Button>
              )}
            </div>
            <ScrollArea className="h-[300px]">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={cn(
                      "p-4 border-b hover:bg-accent transition-colors cursor-pointer",
                      !notification.read && "bg-accent/50"
                    )}
                    onClick={() => markAsRead(notification._id)}
                  >
                    <div className="flex items-start gap-4">
                      <Avatar
                        className="cursor-pointer"
                        onClick={(e) =>
                          notification.metadata?.senderId &&
                          handleProfileClick(notification.metadata.senderId, e)
                        }
                      >
                        <AvatarImage
                          src={
                            notification.metadata?.senderImage ||
                            "/default-avatar.png"
                          }
                          alt={notification.metadata?.senderName || "User"}
                        />
                        <AvatarFallback>
                          {notification.metadata?.senderName?.[0]?.toUpperCase() ||
                            "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span
                            className="font-medium hover:underline cursor-pointer"
                            onClick={(e) =>
                              notification.metadata?.senderId &&
                              handleProfileClick(
                                notification.metadata.senderId,
                                e
                              )
                            }
                          >
                            {notification.metadata?.senderName}
                          </span>{" "}
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(
                            new Date(notification.createdAt),
                            "MMM d, h:mm a"
                          )}
                        </p>
                        {notification.type === "friend_request" &&
                          notification.metadata?.requestId && (
                            <div className="flex gap-2 mt-2">
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  respondToRequest({
                                    requestId:
                                      notification.metadata?.requestId!,
                                    status: "accepted",
                                  });
                                }}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  respondToRequest({
                                    requestId:
                                      notification.metadata?.requestId!,
                                    status: "rejected",
                                  });
                                }}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Decline
                              </Button>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default LeftSidebar;
