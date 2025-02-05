import { useEffect, useRef } from "react";

interface AudioPlayerProps {
  url: string;
  isPlaying: boolean;
  onError?: () => void;
}

const AudioPlayer = ({ url, isPlaying, onError }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Playback error:", error);
            if (onError) onError();
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, url]);

  return (
    <audio
      ref={audioRef}
      src={url}
      preload="metadata"
      onError={(e) => {
        console.error("Audio error:", e);
        if (onError) onError();
      }}
      controls={false}
      crossOrigin="anonymous"
    />
  );
};

export default AudioPlayer;
