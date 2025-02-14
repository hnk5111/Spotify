import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, X, MessageCircle, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";

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

const NotificationsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/notifications");
      return data as Notification[];
    },
  });

  const { mutate: markAsRead } = useMutation({
    mutationFn: async (notificationId: string) => {
      await axiosInstance.put(`/notifications/${notificationId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const { mutate: markAllAsRead } = useMutation({
    mutationFn: async () => {
      await axiosInstance.put("/notifications/mark-all-read");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });

      if (variables.status === "accepted") {
        toast.success("Friend request accepted!", {
          duration: 5000,
          icon: "🎉",
          // Remove action since it's not a valid property
        });
      } else {
        toast.success("Friend request declined");
      }
    },
  });

  const { mutate: sendFriendRequest } = useMutation({
    mutationFn: async (receiverId: string) => {
      await axiosInstance.post("/friends/request", { receiverId });
    },
    onSuccess: () => {
      toast.success("Friend request sent!");
      queryClient.invalidateQueries({ queryKey: ["friendshipStatus"] });
    },
  });

  const [friendshipStatuses, setFriendshipStatuses] = useState<
    Record<string, string>
  >({});

  const fetchFriendshipStatus = async (userId: string) => {
    try {
      const { data } = await axiosInstance.get(`/friends/status/${userId}`);
      setFriendshipStatuses((prev) => ({
        ...prev,
        [userId]: data.status,
      }));
    } catch (error) {
      console.error("Error fetching friendship status:", error);
    }
  };

  const handleProfileClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  const renderNotificationActions = (notification: Notification) => {
    if (
      notification.type === "friend_request" &&
      notification.metadata?.requestId
    ) {
      return (
        <div className="flex gap-2 mt-2">
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              respondToRequest({
                requestId: notification.metadata?.requestId!,
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
                requestId: notification.metadata?.requestId!,
                status: "rejected",
              });
            }}
          >
            <X className="h-4 w-4 mr-1" />
            Decline
          </Button>
        </div>
      );
    }

    if (
      notification.type === "friend_request_response" &&
      notification.metadata?.senderId
    ) {
      const status = friendshipStatuses[notification.metadata.senderId];

      if (status === "accepted") {
        return (
          <div className="flex gap-2 mt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/chat");
              }}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Start Chat
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                handleProfileClick(notification.metadata?.senderId!);
              }}
            >
              View Profile
            </Button>
          </div>
        );
      }

      if (status === "none") {
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              sendFriendRequest(notification.metadata?.senderId!);
            }}
          >
            <UserPlus className="h-4 w-4 mr-1" />
            Follow Back
          </Button>
        );
      }
    }

    return null;
  };

  useEffect(() => {
    notifications.forEach((notification) => {
      if (notification.metadata?.senderId) {
        fetchFriendshipStatus(notification.metadata.senderId);
      }
    });
  }, [notifications]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="container max-w-4xl py-8">
        <div className="bg-card rounded-lg shadow">
          <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-card z-10">
            <h1 className="text-2xl font-bold">Notifications</h1>
            {notifications.length > 0 && (
              <Button variant="outline" onClick={() => markAllAsRead()}>
                Mark all as read
              </Button>
            )}
          </div>

          <div className="divide-y">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={cn(
                    "p-4 hover:bg-accent/50 transition-colors",
                    !notification.read && "bg-accent/20"
                  )}
                  onClick={() => markAsRead(notification._id)}
                >
                  <div className="flex items-start gap-4">
                    <Avatar
                      className="cursor-pointer"
                      onClick={() =>
                        notification.metadata?.senderId &&
                        handleProfileClick(notification.metadata.senderId)
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
                          onClick={() =>
                            notification.metadata?.senderId &&
                            handleProfileClick(notification.metadata.senderId)
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

                      {renderNotificationActions(notification)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
