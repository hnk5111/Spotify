import { useQuery, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useUser } from '@clerk/clerk-react';
import { useSocket } from '@/hooks/useSocket';
import { toast } from "react-hot-toast";
import { useInView } from "react-intersection-observer";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { ref: topRef, inView: isTopVisible } = useInView();

  const { 
    data: messages, 
    isLoading: isLoadingMessages,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage 
  } = useInfiniteQuery<MessagePage>({
    queryKey: ["messages", userId],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axiosInstance.get(`/users/messages/${userId}?page=${pageParam}`);
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

    socket.on('messageError', handleMessageError);

    return () => {
      socket.off('messageError', handleMessageError);
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
    if (!isLoadingMessages && messages?.pages && messages.pages[0]?.messages?.length > 0) {
      scrollToBottom();
    }
    // Scroll to bottom when new messages arrive
    if (autoScroll && messages?.pages && messages.pages.length > 0 && messages.pages[messages.pages.length - 1]?.messages?.length > 0) {
      scrollToBottom();
    }
  }, [messages, isLoadingMessages]);

  // Socket message listener
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage: Message) => {
      if (newMessage.senderId === userId || newMessage.receiverId === userId) {
        queryClient.invalidateQueries({ queryKey: ["messages", userId] });
      }
    };

    socket.on('receiveMessage', handleNewMessage);

    return () => {
      socket.off('receiveMessage', handleNewMessage);
    };
  }, [socket, userId, queryClient]);

  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      console.log('Socket connected');
    };

    const handleConnectError = (error: Error) => {
      console.error('Socket connection error:', error);
      toast.error('Connection error. Trying to reconnect...');
    };

    const handleDisconnect = () => {
      console.log('Socket disconnected');
    };

    socket.on('connect', handleConnect);
    socket.on('connect_error', handleConnectError);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('connect_error', handleConnectError);
      socket.off('disconnect', handleDisconnect);
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

  const allMessages = messages?.pages.flatMap(page => page.messages) ?? [];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !socket || !user || isSending) return;

    try {
      setIsSending(true);
      
      socket.emit("sendMessage", {
        receiverId: userId,
        content: message.trim(),
      });

      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["messages", userId] });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  if (!userData) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-background z-10 p-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={userData?.imageUrl} alt={userData?.fullName} />
            <AvatarFallback>{userData?.fullName?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">{userData?.fullName}</h2>
          </div>
        </div>
      </div>

      {/* Scrollable Messages Area */}
      <ScrollArea 
        className="flex-1" 
        onScroll={handleScroll}
      >
        <div className="p-4 space-y-4">
          {/* Loading indicator for older messages */}
          {isFetchingNextPage && (
            <div className="flex justify-center py-2">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}

          {/* Intersection observer target for infinite scroll */}
          <div ref={topRef} />

          {isLoadingMessages ? (
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
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
                    className={`max-w-[70%] rounded-lg p-3 ${
                      msg.senderId === user?.id
                        ? "bg-blue-600"
                        : "bg-zinc-800"
                    }`}
                  >
                    <p className="break-words">{msg.content}</p>
                    <span className="text-xs text-zinc-400 mt-1 block">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}

              {/* Auto-scroll anchor */}
              <div ref={messagesEndRef} />

              {/* New message indicator when auto-scroll is disabled */}
              {!autoScroll && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="fixed bottom-20 right-4 z-10"
                  onClick={() => {
                    setAutoScroll(true);
                    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <ChevronDown className="h-4 w-4 mr-1" />
                  New Messages
                </Button>
              )}
            </>
          )}
        </div>
      </ScrollArea>

      {/* Sticky Message Input */}
      <div className="sticky bottom-0 bg-background border-t border-zinc-800">
        <form onSubmit={handleSendMessage} className="p-4">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
              disabled={isSending}
            />
            <Button type="submit" disabled={isSending}>
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}; 