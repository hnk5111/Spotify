import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Volume2, VolumeX, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat } from "lucide-react";
import { Slider } from "./ui/slider";
import ReactPlayer from "react-player/youtube";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  url: string;
  isPlaying: boolean;
  onError: () => void;
  setIsPlaying: (playing: boolean) => void;
}

const AudioPlayer = ({ url, isPlaying, onError, setIsPlaying }: AudioPlayerProps) => {
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    if (!seeking) {
      setProgress(state.playedSeconds);
    }
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const handleSeekChange = (value: number[]) => {
    setSeeking(true);
    setProgress(value[0]);
  };

  const handleSeekMouseUp = (value: number[]) => {
    setSeeking(false);
    if (playerRef.current) {
      playerRef.current.seekTo(value[0], 'seconds');
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full space-y-2">
      <ReactPlayer
        ref={playerRef}
        url={url}
        playing={isPlaying}
        volume={isMuted ? 0 : volume}
        onProgress={handleProgress}
        onDuration={handleDuration}
        onError={onError}
        width="0"
        height="0"
        style={{ display: 'none' }}
        config={{
          playerVars: {
            controls: 0,
            modestbranding: 1,
            iv_load_policy: 3,
            rel: 0
          }
        }}
      />

      {/* Main Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <Shuffle className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-10 w-10 rounded-full",
            "bg-primary text-primary-foreground hover:bg-primary/90",
            "flex items-center justify-center"
          )}
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5 ml-0.5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <Repeat className="h-4 w-4" />
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground w-12 text-right">
          {formatTime(progress)}
        </span>
        <Slider
          value={[progress]}
          min={0}
          max={duration || 100}
          step={1}
          onValueChange={handleSeekChange}
          onValueCommit={handleSeekMouseUp}
          className="flex-1"
        />
        <span className="text-xs text-muted-foreground w-12">
          {formatTime(duration)}
        </span>
      </div>

      {/* Volume Control */}
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
        <Slider
          value={[isMuted ? 0 : volume * 100]}
          min={0}
          max={100}
          step={1}
          onValueChange={(value) => {
            setVolume(value[0] / 100);
            setIsMuted(false);
          }}
          className="w-24"
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
