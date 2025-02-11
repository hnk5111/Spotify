import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSearchParams, Link } from "react-router-dom";
import { DirectMessageChat } from "@/components/chat/DirectMessageChat";
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface Friend {
  clerkId: string;
  fullName: string;
  imageUrl: string;
}

const ChatPage = () => {
  const [searchParams] = useSearchParams();
  const selectedUserId = searchParams.get("userId");

  const { data: friends = [] } = useQuery<Friend[]>({
    queryKey: ["friends"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/friends");
      return data;
    },
  });

  return (
    <ErrorBoundary>
      <div className="grid lg:grid-cols-[320px,1fr] h-full">
        <div className="flex flex-col h-full border-r border-zinc-800">
          <div className="sticky top-0 bg-background z-10 p-4 border-b border-zinc-800">
            <h2 className="font-semibold">Messages</h2>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {friends.map((friend) => (
                <Link
                  key={friend.clerkId}
                  to={`/chat?userId=${friend.clerkId}`}
                  className={`flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800/50 transition-colors ${
                    selectedUserId === friend.clerkId ? "bg-zinc-800" : ""
                  }`}
                >
                  <Avatar>
                    <AvatarImage src={friend.imageUrl} alt={friend.fullName} />
                    <AvatarFallback>{friend.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{friend.fullName}</p>
                  </div>
                </Link>
              ))}

              {friends.length === 0 && (
                <p className="text-center text-zinc-400">
                  Add friends to start chatting
                </p>
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="flex flex-col h-full">
          {selectedUserId ? (
            <DirectMessageChat userId={selectedUserId} />
          ) : (
            <div className="flex items-center justify-center h-full text-zinc-400">
              Select a friend to start chatting
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ChatPage;
