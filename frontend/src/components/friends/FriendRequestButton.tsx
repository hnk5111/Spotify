import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { UserPlus, Check, X, Loader2 } from "lucide-react";
import { axiosInstance } from "@/lib/axios";
import { toast } from "react-hot-toast";

interface FriendRequestButtonProps {
  userId: string;
}

export const FriendRequestButton = ({ userId }: FriendRequestButtonProps) => {
  const queryClient = useQueryClient();

  const { data: friendshipStatus, isLoading, error } = useQuery({
    queryKey: ["friendshipStatus", userId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/friends/status/${userId}`);
      return data;
    },
    retry: false,
    onError: (error: any) => {
      console.error("Error fetching friendship status:", error);
    }
  });

  const { mutate: sendRequest, isPending: isSending } = useMutation({
    mutationFn: async () => {
      await axiosInstance.post(`/friends/request`, { receiverId: userId });
    },
    onSuccess: () => {
      toast.success("Friend request sent!");
      queryClient.invalidateQueries({ queryKey: ["friendshipStatus", userId] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to send request");
    },
  });

  const { mutate: respondToRequest, isPending: isResponding } = useMutation({
    mutationFn: async ({ requestId, status }: { requestId: string; status: string }) => {
      await axiosInstance.put(`/friends/request/${requestId}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendshipStatus", userId] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  if (isLoading) {
    return (
      <Button variant="outline" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  if (friendshipStatus?.status === "accepted") {
    return (
      <Button variant="secondary" disabled>
        <Check className="h-4 w-4 mr-2" />
        Friends
      </Button>
    );
  }

  if (friendshipStatus?.status === "pending") {
    if (friendshipStatus.receiverId === userId) {
      return (
        <Button variant="outline" disabled>
          <Loader2 className="h-4 w-4 mr-2" />
          Request Sent
        </Button>
      );
    }

    return (
      <div className="flex gap-2">
        <Button
          variant="default"
          onClick={() => respondToRequest({ 
            requestId: friendshipStatus.requestId, 
            status: "accepted" 
          })}
          disabled={isResponding}
        >
          <Check className="h-4 w-4 mr-2" />
          Accept
        </Button>
        <Button
          variant="outline"
          onClick={() => respondToRequest({ 
            requestId: friendshipStatus.requestId, 
            status: "rejected" 
          })}
          disabled={isResponding}
        >
          <X className="h-4 w-4 mr-2" />
          Decline
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={() => sendRequest()}
      variant="outline"
      disabled={isSending}
      className="flex items-center gap-2"
    >
      <UserPlus className="h-4 w-4" />
      Add Friend
    </Button>
  );
}; 