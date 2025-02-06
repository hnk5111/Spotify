import { useEffect, useRef, useState } from "react";

interface AudioPlayerProps {
  url: string;
  isPlaying: boolean;
  onError?: () => void;
}

const AudioPlayer = ({ url, isPlaying, onError }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      // Reset error state when URL changes
      setHasError(false);
      
      if (isPlaying && !hasError) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Playback error:", error);
            setHasError(true);
            if (onError) onError();
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, url, hasError]);

  const handleError = (e: any) => {
    console.error("Audio error:", e);
    setHasError(true);
    if (onError) onError();
  };

  const handleCanPlay = () => {
    setHasError(false);
    console.log("Audio can play");
  };

  return (
    <audio
      ref={audioRef}
      src={url}
      preload="auto"
      onError={handleError}
      onCanPlay={handleCanPlay}
      controls={false}
      crossOrigin="anonymous"
    />
  );
};

export default AudioPlayer;
