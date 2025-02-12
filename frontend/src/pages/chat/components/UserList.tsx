import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatStore } from "@/stores/useChatStore";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import UsersListSkeleton from "@/components/ui/skeletons/UserListSkeletons";

interface UserListProps {
  className?: string;
}

const UserList = ({ className }: UserListProps) => {
  const { users, selectedUser, isLoading, setSelectedUser, onlineUsers } = useChatStore();

  return (
    <div className={cn("border-r border-zinc-800", className)}>
      <div className="flex flex-col h-full">
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="space-y-2 p-4">
            {isLoading ? (
              <UsersListSkeleton />
            ) : (
              users.map((user) => (
                <button
                  key={user.clerkId}
                  onClick={() => setSelectedUser(user)}
                  className={cn(
                    "w-full p-3 flex items-center gap-3 rounded-lg transition-colors",
                    "hover:bg-zinc-800/50",
                    selectedUser?.clerkId === user.clerkId && "bg-zinc-800"
                  )}
                >
                  <div className="relative">
                    <Avatar className="w-8 h-8 md:w-12 md:h-12">
                      <AvatarImage src={user.imageUrl} />
                      <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                    </Avatar>
                    {/* online indicator */}
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-zinc-900 ${
                        onlineUsers.has(user.clerkId)
                          ? "bg-green-500"
                          : "bg-zinc-400"
                      }`}
                    />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{user.fullName}</p>
                    <p className="text-xs text-zinc-400">
                      {onlineUsers.has(user.clerkId) ? "Online" : "Offline"}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default UserList;
