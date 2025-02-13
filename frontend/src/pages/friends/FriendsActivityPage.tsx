import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import axios from "axios";

interface Friend {
  clerkId: string;
  fullName: string;
  imageUrl: string;
}

const FriendsActivityPage = () => {
  const { data: friends = [], isLoading } = useQuery<Friend[]>({
    queryKey: ["friends"],
    queryFn: async () => {
      const { data } = await axios.get("/api/friends");
      return data;
    },
  });

  if (isLoading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-center md:text-left">Friends Activity</h1>
        
        <div className="space-y-4">
          {friends.map((friend) => (
            <div
              key={friend.clerkId}
              className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/50"
            >
              <Link
                to={`/profile/${friend.clerkId}`}
                className="flex items-center gap-3"
              >
                <Avatar>
                  <AvatarImage src={friend.imageUrl} alt={friend.fullName} />
                  <AvatarFallback>
                    {friend.fullName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{friend.fullName}</p>
                </div>
              </Link>
            </div>
          ))}
          
          {friends.length === 0 && (
            <p className="text-center text-zinc-400">No friends yet</p>
          )}
        </div>
      </div>
    </ScrollArea>
  );
};

export default FriendsActivityPage; 