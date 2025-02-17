import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

export const NotificationIndicator = () => {
  const { user, isLoaded } = useUser();

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/notifications");
      return data;
    },
    // Only fetch if user is authenticated
    enabled: !!user,
    // Prevent retries if unauthorized
    retry: false,
    // Handle errors silently
    staleTime: 30000, // 30 seconds
  });

  // Don't show anything while checking auth status
  if (!isLoaded) return null;

  // Don't show for logged out users
  if (!user) return null;

  const unreadCount = notifications.filter((n: any) => !n.read).length;

  return (
    <Link to="/notifications">
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 text-[10px] font-medium flex items-center justify-center bg-primary text-primary-foreground rounded-full">
            {unreadCount}
          </span>
        )}
      </Button>
    </Link>
  );
};
