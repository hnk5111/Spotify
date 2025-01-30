import { useEffect, useRef } from "react";

export const useScrollToBottom = (dependency: any) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [dependency]); // Scroll when dependency changes (like new messages)

  return { scrollRef, scrollToBottom };
}; 