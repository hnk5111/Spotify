import {
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2, ChevronLeft } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { useSocket } from "@/hooks/useSocket";
import { toast } from "react-hot-toast";
import { useInView } from "react-intersection-observer";
import { InfiniteData } from "@tanstack/react-query";

interface ChatProps {
  userId: string;
  onBack?: () => void;
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

export const DirectMessageChat = ({ userId, onBack }: ChatProps) => {
  const { user } = useUser();
  const socket = useSocket();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
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
      }
    };

    socket.on("messageUpdate", handleNewMessage);

    return () => {
      socket.off("messageUpdate", handleNewMessage);
    };
  }, [socket, userId, queryClient]);

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

      // Optimistically add the message
      const optimisticMessage: Message = {
        _id: Date.now().toString(),
        senderId: user.id,
        receiverId: userId,
        content: trimmedMessage,
        createdAt: new Date().toISOString()
      };

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

      socket.emit("sendMessage", {
        receiverId: userId,
        content: trimmedMessage,
      });

    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
      setMessage(message); // Restore message on error
    } finally {
      setIsSending(false);
    }
  };

  // Ensure messages are sorted by date
  const allMessages = messages?.pages
    .flatMap((page) => page.messages)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) ?? [];

  if (!userData) return null;

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 p-4 border-b border-border/10">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              className="mr-1 -ml-2"
              onClick={onBack}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          <Avatar className="h-10 w-10 ring-2 ring-border/5 ring-offset-2 ring-offset-background">
            <AvatarImage src={userData?.imageUrl} alt={userData?.fullName} />
            <AvatarFallback>{userData?.fullName?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-lg text-foreground">
              {userData?.fullName}
            </h2>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-2 md:px-4" onScroll={handleScroll}>
        <div className="py-4 space-y-4 md:space-y-6">
          {/* Loading indicator for older messages */}
          {isFetchingNextPage && (
            <div className="flex justify-center py-2">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Intersection observer target */}
          <div ref={topRef} />

          {/* Messages */}
          {isLoadingMessages ? (
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {allMessages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${
                    msg.senderId === user?.id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm ${
                      msg.senderId === user?.id
                        ? "bg-primary/90 text-primary-foreground"
                        : "bg-secondary/50 text-secondary-foreground backdrop-blur-sm"
                    }`}
                  >
                    <p className="break-words text-[15px] leading-relaxed">
                      {msg.content}
                    </p>
                    <span className="text-[11px] opacity-70 mt-1 block">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSendMessage}
        className="sticky bottom-0 p-3 md:p-4 border-t border-border/10 bg-background/95 backdrop-blur-sm mt-auto"
      >
        <div className="flex gap-2 max-w-[720px] mx-auto">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="bg-secondary/20 border-border/10 focus:ring-primary/20 rounded-xl"
            disabled={isSending}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isSending || !message.trim()}
            className="bg-primary/90 text-primary-foreground hover:bg-primary/80 rounded-xl transition-all duration-200 flex-shrink-0"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
