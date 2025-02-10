import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

interface User {
  clerkId: string;
  fullName: string;
  imageUrl: string;
}

const UserSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["users", searchQuery],
    queryFn: async () => {
      if (!searchQuery) return [];
      const { data } = await axios.get(`/api/users/search?q=${searchQuery}`);
      return data;
    },
    enabled: searchQuery.length > 0,
  });

  const handleStartChat = (userId: string) => {
    navigate(`/chat?userId=${userId}`);
  };

  return (
    <div className="flex flex-col h-full p-6">
      <h1 className="text-2xl font-bold mb-6">Find Users</h1>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users..."
          className="pl-10 bg-zinc-800 border-zinc-700"
          autoComplete="off"
        />
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-4">
          {isLoading ? (
            <p className="text-center text-zinc-400">Loading...</p>
          ) : users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.clerkId}
                className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.imageUrl} alt={user.fullName} />
                    <AvatarFallback>
                      {user.fullName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.fullName}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleStartChat(user.clerkId)}
                >
                  <MessageCircle className="h-5 w-5" />
                </Button>
              </div>
            ))
          ) : searchQuery ? (
            <p className="text-center text-zinc-400">No users found</p>
          ) : (
            <p className="text-center text-zinc-400">
              Start typing to search for users
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default UserSearchPage; 