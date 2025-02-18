import { useRef, useState, useCallback, useEffect } from "react";
import { Button } from "./ui/button";
import { Volume2, VolumeX, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat } from "lucide-react";
import { Slider } from "./ui/slider";
import ReactPlayer from "react-player/youtube";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

interface AudioPlayerProps {
  url: string;
  isPlaying: boolean;
  onError: () => void;
  setIsPlaying: (playing: boolean) => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

const AudioPlayer = ({ 
  url, 
  isPlaying, 
  onError, 
  setIsPlaying,
  onNext,
  onPrevious 
}: AudioPlayerProps) => {
  // Player states
  const [volume, setVolume] = useState(() => {
    const savedVolume = localStorage.getItem('player-volume');
    return savedVolume ? parseFloat(savedVolume) : 0.7;
  });
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem('player-muted') === 'true';
  });
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');
  const playerRef = useRef<ReactPlayer>(null);

  // Save volume and mute state to localStorage
  useEffect(() => {
    localStorage.setItem('player-volume', volume.toString());
    localStorage.setItem('player-muted', isMuted.toString());
  }, [volume, isMuted]);

  // Handle player progress
  const handleProgress = useCallback((state: { played: number; playedSeconds: number }) => {
    if (!seeking) {
      setProgress(state.playedSeconds);
    }
  }, [seeking]);

  // Handle duration change
  const handleDuration = useCallback((duration: number) => {
    setDuration(duration);
  }, []);

  // Handle seeking
  const handleSeekChange = useCallback((value: number[]) => {
    setSeeking(true);
    setProgress(value[0]);
  }, []);

  const handleSeekMouseUp = useCallback((value: number[]) => {
    setSeeking(false);
    if (playerRef.current) {
      playerRef.current.seekTo(value[0], 'seconds');
    }
  }, []);

  // Handle player end
  const handleEnded = useCallback(() => {
    if (repeatMode === 'one') {
      if (playerRef.current) {
        playerRef.current.seekTo(0);
        setIsPlaying(true);
      }
    } else if (repeatMode === 'all' && onNext) {
      onNext();
    } else {
      setIsPlaying(false);
    }
  }, [repeatMode, onNext, setIsPlaying]);

  // Handle player error
  const handleError = useCallback((error: any) => {
    console.error('Player error:', error);
    toast.error('Error playing track. Please try again.');
    onError();
  }, [onError]);

  // Handle volume change
  const handleVolumeChange = useCallback((value: number[]) => {
    const newVolume = value[0] / 100;
    setVolume(newVolume);
    setIsMuted(false);
  }, []);

  // Toggle repeat mode
  const toggleRepeat = useCallback(() => {
    setRepeatMode(current => {
      switch (current) {
        case 'none': return 'one';
        case 'one': return 'all';
        case 'all': return 'none';
      }
    });
  }, []);

  // Format time helper
  const formatTime = useCallback((time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  return (
    <div className="w-full space-y-2">
      <ReactPlayer
        ref={playerRef}
        url={url}
        playing={isPlaying}
        volume={isMuted ? 0 : volume}
        onProgress={handleProgress}
        onDuration={handleDuration}
        onError={handleError}
        onEnded={handleEnded}
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
          className={cn(
            "h-8 w-8 text-muted-foreground hover:text-foreground",
            isShuffling && "text-primary"
          )}
          onClick={() => setIsShuffling(!isShuffling)}
          title="Shuffle"
        >
          <Shuffle className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={onPrevious}
          disabled={!onPrevious}
          title="Previous"
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
          title={isPlaying ? "Pause" : "Play"}
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
          onClick={onNext}
          disabled={!onNext}
          title="Next"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 text-muted-foreground hover:text-foreground",
            repeatMode !== 'none' && "text-primary"
          )}
          onClick={toggleRepeat}
          title={`Repeat ${repeatMode}`}
        >
          <Repeat className="h-4 w-4" />
          {repeatMode === 'one' && (
            <span className="absolute text-[10px] font-bold">1</span>
          )}
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
          title={isMuted ? "Unmute" : "Mute"}
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
          onValueChange={handleVolumeChange}
          className="w-24"
          aria-label="Volume"
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
