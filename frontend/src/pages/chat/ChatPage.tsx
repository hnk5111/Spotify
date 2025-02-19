import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { DirectMessageChat } from "@/components/chat/DirectMessageChat";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Send, PanelLeftClose, PanelLeft, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Friend {
  clerkId: string;
  fullName: string;
  imageUrl: string;
}

const ChatPage = () => {
  const [searchParams] = useSearchParams();
  const selectedUserId = searchParams.get("userId");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setIsSidebarCollapsed(selectedUserId !== null);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call initially
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedUserId]);

  useEffect(() => {
    if (isMobile) {
      setIsSidebarCollapsed(selectedUserId !== null);
    }
  }, [selectedUserId, isMobile]);

  const { data: friends = [] } = useQuery<Friend[]>({
    queryKey: ["friends"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/friends");
      return data;
    },
  });

  return (
    <div className="h-[calc(100vh-4rem)]">
      <ErrorBoundary>
        <div 
          className={cn(
            "grid h-full overflow-hidden relative border rounded-lg shadow-lg",
            "transition-all duration-300",
            isMobile && "border-0 rounded-none shadow-none"
          )}
          style={{
            gridTemplateColumns: isSidebarCollapsed 
              ? isMobile ? "0fr 1fr" : "80px 1fr" 
              : "300px 1fr"
          }}
        >
          {/* Sidebar */}
          <div className={cn(
            "flex flex-col h-full border-r border-border/20 bg-card/30",
            "backdrop-blur-sm shadow-sm transition-all duration-300",
            isMobile && isSidebarCollapsed && "w-0 opacity-0",
            isMobile && "fixed left-0 top-0 bottom-0 z-50 w-full bg-background",
            !isSidebarCollapsed && isMobile && "w-full"
          )}>
            <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 p-4 border-b border-border/20 flex items-center justify-between">
              {(!isSidebarCollapsed || isMobile) && (
                <h2 className="font-semibold text-lg text-foreground/90">
                  Messages
                </h2>
              )}
              {!isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto hover:bg-secondary/30"
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                >
                  {isSidebarCollapsed ? (
                    <PanelLeft className="h-5 w-5" />
                  ) : (
                    <PanelLeftClose className="h-5 w-5" />
                  )}
                </Button>
              )}
            </div>

            <ScrollArea className="flex-1 overflow-y-auto">
              <div className="p-3 space-y-1">
                {friends.map((friend) => (
                  <Link
                    key={friend.clerkId}
                    to={`/chat?userId=${friend.clerkId}`}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/20 transition-all duration-200",
                      "border border-transparent hover:border-border/10",
                      selectedUserId === friend.clerkId && "bg-secondary/30 backdrop-blur-sm border-border/20",
                      isSidebarCollapsed && !isMobile && "justify-center p-2"
                    )}
                    onClick={() => isMobile && setIsSidebarCollapsed(true)}
                  >
                    <Avatar className="h-10 w-10 ring-2 ring-border/5 ring-offset-2 ring-offset-background border border-border/10">
                      <AvatarImage src={friend.imageUrl} alt={friend.fullName} />
                      <AvatarFallback>{friend.fullName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {(!isSidebarCollapsed || isMobile) && (
                      <div className="flex-1">
                        <p className="font-medium text-[15px] text-foreground/90">
                          {friend.fullName}
                        </p>
                      </div>
                    )}
                  </Link>
                ))}

                {friends.length === 0 && (!isSidebarCollapsed || isMobile) && (
                  <div className="text-center text-muted-foreground/70 py-8 border border-dashed border-border/20 rounded-lg m-4">
                    Add friends to start chatting
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Main Chat Area */}
          <div className={cn(
            "flex flex-col h-full bg-background/95 overflow-hidden",
            isMobile && selectedUserId && "fixed inset-0 z-50"
          )}>
            {selectedUserId ? (
              <DirectMessageChat 
                userId={selectedUserId} 
                onBack={isMobile ? () => {
                  setIsSidebarCollapsed(false);
                  window.history.pushState({}, '', '/chat');
                } : undefined}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground/70">
                <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center border border-border/10 shadow-sm">
                  <Send className="h-6 w-6" />
                </div>
                <p className="px-4 py-2 rounded-lg border border-border/10 bg-secondary/5">
                  Select a friend to start chatting
                </p>
              </div>
            )}
          </div>
        </div>
      </ErrorBoundary>

      {/* Mobile Header with Back Button */}
      <div className="md:hidden flex items-center gap-2 p-4 border-b">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="font-semibold">Messages</h1>
      </div>
    </div>
  );
};

export default ChatPage;
