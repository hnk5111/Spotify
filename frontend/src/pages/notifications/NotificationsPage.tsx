import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Bell, Check, MessageSquare, UserPlus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-hot-toast";
import { useUser } from "@clerk/clerk-react";

interface Notification {
  _id: string;
  message: string;
  type: 'message' | 'friend_request' | 'friend_request_response' | 'system';
  read: boolean;
  createdAt: string;
  metadata?: {
    requestId?: string;
    messageId?: string;
  };
}

const NotificationsPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"] as const,
    queryFn: async () => {
      const { data } = await axiosInstance.get<Notification[]>("/notifications");
      return data;
    },
    enabled: !!user,
    staleTime: 1000 * 60, // 1 minute
    retry: false,
    gcTime: 0,
  });

  const { mutate: markAsRead } = useMutation({
    mutationFn: async (notificationId: string) => {
      await axiosInstance.put(`/notifications/${notificationId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: () => {
      toast.error("Failed to mark notification as read");
    }
  });

  const { mutate: deleteNotification } = useMutation({
    mutationFn: async (notificationId: string) => {
      await axiosInstance.delete(`/notifications/${notificationId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notification deleted");
    },
    onError: () => {
      toast.error("Failed to delete notification");
    }
  });

  const { mutate: clearAll } = useMutation({
    mutationFn: async () => {
      await axiosInstance.delete("/notifications");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("All notifications cleared");
    },
    onError: () => {
      toast.error("Failed to clear notifications");
    }
  });

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification._id);
    }

    if (notification.type === 'message' && notification.metadata?.messageId) {
      navigate(`/chat?userId=${notification.metadata.messageId}`);
    } else if (notification.type === 'friend_request') {
      navigate('/friends');
    }
  };

  // Handle unauthorized access
  if (isLoaded && !user) {
    navigate("/");
    return null;
  }

  const notificationsList = notifications || [];

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Bell className="h-6 w-6" />
          Notifications
        </h1>
        {notificationsList.length > 0 && (
          <Button 
            variant="outline" 
            onClick={() => clearAll()}
            className="text-sm"
          >
            Clear All
          </Button>
        )}
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)] rounded-lg border bg-card">
        <div className="p-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : notificationsList.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            <div className="space-y-2">
              {notificationsList.map((notification: Notification) => (
                <div
                  key={notification._id}
                  className={`
                    flex items-center justify-between p-4 rounded-lg
                    ${notification.read ? 'bg-secondary/20' : 'bg-secondary/40'}
                    border border-border/10 transition-all duration-200
                  `}
                >
                  <div 
                    className="flex items-center gap-3 flex-1 cursor-pointer"
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {notification.type === 'message' ? (
                        <MessageSquare className="h-5 w-5 text-primary" />
                      ) : notification.type === 'friend_request' ? (
                        <UserPlus className="h-5 w-5 text-primary" />
                      ) : (
                        <Bell className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!notification.read && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => markAsRead(notification._id)}
                        className="h-8 w-8"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => deleteNotification(notification._id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default NotificationsPage;
