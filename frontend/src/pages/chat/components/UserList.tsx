import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface User {
  clerkId: string;
  fullName: string;
  imageUrl: string;
  isOnline?: boolean;
  lastMessage?: string;
  lastMessageTime?: string;
}

interface UserListProps {
  users: User[];
  selectedUserId?: string;
  onUserSelect?: (userId: string) => void;
  className?: string;
}

export const UserList = ({
  users,
  selectedUserId,
  onUserSelect,
  className
}: UserListProps) => {
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Users List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {filteredUsers.map((user) => (
            <Link
              key={user.clerkId}
              to={`/chat?userId=${user.clerkId}`}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg transition-colors relative",
                "hover:bg-muted/50",
                selectedUserId === user.clerkId ? "bg-muted" : "hover:bg-muted/50"
              )}
              onClick={() => onUserSelect?.(user.clerkId)}
            >
              <div className="relative">
                <Avatar>
                  <AvatarImage src={user.imageUrl} alt={user.fullName} />
                  <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                </Avatar>
                {user.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium truncate">{user.fullName}</p>
                  {user.lastMessageTime && (
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {user.lastMessageTime}
                    </span>
                  )}
                </div>
                {user.lastMessage && (
                  <p className="text-sm text-muted-foreground truncate">
                    {user.lastMessage}
                  </p>
                )}
              </div>
            </Link>
          ))}

          {filteredUsers.length === 0 && (
            <div className="text-center p-4 text-muted-foreground">
              {search ? "No users found" : "No users available"}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
