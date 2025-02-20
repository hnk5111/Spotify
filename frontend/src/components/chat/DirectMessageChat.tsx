import {
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { useSocket } from "@/hooks/useSocket";
import { toast } from "react-hot-toast";
import { useInView } from "react-intersection-observer";
import { InfiniteData } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { MessageInput } from "@/pages/chat/components/MessageInput";

interface ChatProps {
  userId: string;
}

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

interface User {
  clerkId: string;
  fullName: string;
  imageUrl: string;
}

interface MessagePage {
  messages: Message[];
  nextPage?: number;
  totalPages: number;
}

export const DirectMessageChat = ({ userId }: ChatProps) => {
  const { user } = useUser();
  const socket = useSocket();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { ref: topRef, inView: isTopVisible } = useInView();

  const {
    data: messages,
    isLoading: isLoadingMessages,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<MessagePage>({
    queryKey: ["messages", userId],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axiosInstance.get(
        `/users/messages/${userId}?page=${pageParam}`
      );
      return data;
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });

  const { data: userData } = useQuery<User>({
    queryKey: ["user", userId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/users/profile/${userId}`);
      return data;
    },
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Listen for socket errors
  useEffect(() => {
    if (!socket) return;

    const handleMessageError = (error: { message: string }) => {
      toast.error(error.message);
      setIsSending(false);
    };

    socket.on("messageError", handleMessageError);

    return () => {
      socket.off("messageError", handleMessageError);
    };
  }, [socket]);

  // Auto-scroll on initial load and new messages
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };
    // Scroll to bottom on initial load
    if (
      !isLoadingMessages &&
      messages?.pages &&
      messages.pages[0]?.messages?.length > 0
    ) {
      scrollToBottom();
    }
    // Scroll to bottom when new messages arrive
    if (
      autoScroll &&
      messages?.pages &&
      messages.pages.length > 0 &&
      messages.pages[messages.pages.length - 1]?.messages?.length > 0
    ) {
      scrollToBottom();
    }
  }, [messages, isLoadingMessages]);

  // Socket message listener
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data: { message: Message }) => {
      if (data.message.senderId === userId || data.message.receiverId === userId) {
        // Update messages immediately in the cache
        queryClient.setQueryData<InfiniteData<MessagePage>>(
          ["messages", userId],
          (oldData) => {
            if (!oldData) return oldData;
            
            // Check if message already exists
            const messageExists = oldData.pages.some(page => 
              page.messages.some(msg => msg._id === data.message._id)
            );

            if (messageExists) return oldData;

            const newPages = oldData.pages.map((page, index) => {
              if (index === oldData.pages.length - 1) {
                return {
                  ...page,
                  messages: [...page.messages, data.message]
                };
              }
              return page;
            });

            return {
              ...oldData,
              pages: newPages
            };
          }
        );

        // Scroll to bottom for new messages
        if (messagesEndRef.current && autoScroll) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    socket.on("messageUpdate", handleNewMessage);

    return () => {
      socket.off("messageUpdate", handleNewMessage);
    };
  }, [socket, userId, queryClient, autoScroll]);

  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      console.log("Socket connected");
    };

    const handleConnectError = (error: Error) => {
      console.error("Socket connection error:", error);
      toast.error("Connection error. Trying to reconnect...");
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected");
    };

    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);
      socket.off("disconnect", handleDisconnect);
    };
  }, [socket]);

  // Load more messages when scrolling to top
  useEffect(() => {
    if (isTopVisible && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isTopVisible, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Auto-scroll to bottom for new messages
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, autoScroll]);

  // Handle scroll to detect manual scrolling
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollHeight, scrollTop, clientHeight } = e.currentTarget;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setAutoScroll(isNearBottom);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !socket || !user || isSending) return;

    try {
      setIsSending(true);
      const trimmedMessage = message.trim();
      setMessage("");

      // Create optimistic message
      const optimisticMessage: Message = {
        _id: `temp-${Date.now()}`,
        senderId: user.id,
        receiverId: userId,
        content: trimmedMessage,
        createdAt: new Date().toISOString()
      };

      // Update UI optimistically
      queryClient.setQueryData<InfiniteData<MessagePage>>(
        ["messages", userId],
        (oldData) => {
          if (!oldData) return oldData;
          
          const newPages = oldData.pages.map((page, index) => {
            if (index === oldData.pages.length - 1) {
              return {
                ...page,
                messages: [...page.messages, optimisticMessage]
              };
            }
            return page;
          });

          return {
            ...oldData,
            pages: newPages
          };
        }
      );

      // Emit socket event
      socket.emit("sendMessage", {
        receiverId: userId,
        content: trimmedMessage,
      });

      // Ensure scroll to bottom
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }

    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
      setMessage(message); // Restore message on error

      // Remove optimistic message on error
      queryClient.setQueryData<InfiniteData<MessagePage>>(
        ["messages", userId],
        (oldData) => {
          if (!oldData) return oldData;
          
          const newPages = oldData.pages.map(page => ({
            ...page,
            messages: page.messages.filter(msg => !msg._id.startsWith('temp-'))
          }));

          return {
            ...oldData,
            pages: newPages
          };
        }
      );
    } finally {
      setIsSending(false);
    }
  };

  if (!userData) return null;

  return (
    <div className="flex flex-col h-full relative bg-background">
      {/* Desktop Header */}
      {!isMobile && (
        <div className="px-6 h-14 border-b flex items-center gap-3 bg-card/30 backdrop-blur-sm sticky top-0 z-10">
          <Avatar>
            <AvatarImage src={userData.imageUrl} alt={userData.fullName} />
            <AvatarFallback>{userData.fullName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-medium leading-none">{userData.fullName}</h2>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div 
        className="flex-1 overflow-y-auto"
        onScroll={handleScroll}
        style={{ overscrollBehavior: 'contain' }}
      >
        <div className="flex flex-col justify-end min-h-full">
          {/* Loading More Indicator */}
          {isFetchingNextPage && (
            <div className="flex justify-center py-2" ref={topRef}>
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Empty State */}
          {!isLoadingMessages && (!messages?.pages[0]?.messages || messages.pages[0].messages.length === 0) && (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Send className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  No messages yet. Start the conversation!
                </p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoadingMessages && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Messages */}
          <div className="p-4 space-y-4">
            {[...messages?.pages || []].reverse().map((page, i) => (
              <div key={i} className="flex flex-col gap-3">
                {page.messages.map((msg) => {
                  const isCurrentUser = msg.senderId === user?.id;
                  return (
                    <div
                      key={msg._id}
                      className={cn(
                        "flex items-start gap-2 max-w-[85%]",
                        isCurrentUser ? "ml-auto" : "mr-auto"
                      )}
                    >
                      {!isCurrentUser && (
                        <Avatar className="h-8 w-8 mt-0.5 flex-shrink-0">
                          <AvatarImage src={userData.imageUrl} alt={userData.fullName} />
                          <AvatarFallback>{userData.fullName.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          "rounded-2xl px-4 py-2.5 text-sm break-words",
                          isCurrentUser 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-muted"
                        )}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Auto scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="sticky bottom-0 bg-background border-t">
        <MessageInput
          message={message}
          onChange={setMessage}
          onSubmit={handleSendMessage}
          isSending={isSending}
          placeholder="Type a message..."
        />
      </div>
    </div>
  );
};
