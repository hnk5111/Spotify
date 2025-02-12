import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { axiosInstance } from "@/lib/axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";
import { FriendRequestButton } from "@/components/friends/FriendRequestButton";

interface UserProfile {
  clerkId: string;
  fullName: string;
  username: string;
  imageUrl: string;
  bio: string;
  email: string;
}

const UserProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  useUser();

  const { data: profile, isLoading, error } = useQuery<UserProfile>({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");
      const { data } = await axiosInstance.get(`/users/profile/${userId}`);
      return data;
    },
    retry: false,
  });

  const queryClient = useQueryClient();
  
  useMutation({
    mutationFn: async () => {
      await axiosInstance.post(`/friends/request`, { receiverId: userId });
    },
    onSuccess: () => {
      toast.success("Friend request sent!");
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const handleStartChat = () => {
    if (userId) {
      navigate(`/chat?userId=${userId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-red-500">User not found</div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col p-6 max-w-3xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <Avatar className="h-32 w-32 mb-4">
            <AvatarImage src={profile.imageUrl} alt={profile.fullName} />
            <AvatarFallback>{profile.fullName.charAt(0)}</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold mb-2">{profile.fullName}</h1>
          <p className="text-zinc-400 mb-4">@{profile.username}</p>
          <div className="flex gap-2">
            <Button
              onClick={handleStartChat}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Send Message
            </Button>
            
            <FriendRequestButton userId={userId!} />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">About</h2>
            <p className="text-zinc-400">
              {profile.bio || "No bio available"}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Contact</h2>
            <p className="text-zinc-400">{profile.email}</p>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default UserProfilePage; 