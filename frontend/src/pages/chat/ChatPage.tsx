import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { UserList } from "./components/UserList";
import { DirectMessageChat } from "../../components/chat/DirectMessageChat";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const ChatPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedUserId = searchParams.get("userId") || undefined;
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch users
  const { data: users = [] } = useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/friends");
      return data;
    },
  });

  const handleBack = () => {
    navigate("/chat");
  };

  if (isMobile) {
    // Mobile View
    return (
      <div className="flex flex-col h-full bg-background">
        {selectedUserId ? (
          // Chat View
          <div className="flex flex-col h-full">
            <div className="h-14 px-4 border-b flex items-center gap-3 bg-card/30 backdrop-blur-sm">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleBack}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex-1 flex justify-center">
                <h2 className="font-medium">Chat</h2>
              </div>
            </div>
            <DirectMessageChat userId={selectedUserId} />
          </div>
        ) : (
          // Users List View
          <div className="flex flex-col h-full">
            <div className="h-14 px-4 border-b flex items-center justify-center">
              <h1 className="text-xl font-semibold">Messages</h1>
            </div>
            <UserList
              users={users}
              selectedUserId={selectedUserId}
              className="flex-1"
            />
          </div>
        )}
      </div>
    );
  }

  // Desktop View
  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-80 border-r flex-shrink-0 bg-background">
        <UserList
          users={users}
          selectedUserId={selectedUserId}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUserId ? (
          <DirectMessageChat userId={selectedUserId} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;

