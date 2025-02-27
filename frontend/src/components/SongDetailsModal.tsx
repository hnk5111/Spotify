import { Dialog, DialogContent } from "@/components/ui/dialog";
import { 
  Heart, 
  Share2, 
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume1
} from "lucide-react";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useMusicStore } from "@/stores/useMusicStore";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Slider } from "./ui/slider";
import { useEffect, useState, useRef } from "react";

interface SongDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SongDetailsModal = ({ isOpen, onClose }: SongDetailsModalProps) => {
  const { 
    currentSong, 
    isPlaying, 
    togglePlay, 
    playNext, 
    playPrevious,
    progress,
    duration,
    setProgress,
    setDuration
  } = usePlayerStore();
  const toggleLike = useMusicStore((state) => state.toggleLike);
  const songs = useMusicStore((state) => state.songs);
  const [volume, setVolume] = useState(75);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const isLiked = currentSong ? songs.find(s => s._id === currentSong._id)?.isLiked : false;

  useEffect(() => {
    const updateProgress = () => {
      const audio = document.querySelector('audio');
      if (audio) {
        setProgress(audio.currentTime);
        setDuration(audio.duration || 0);
      }
    };

    // Clear existing interval
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    const audio = document.querySelector('audio');
    if (audio) {
      // Set initial volume
      audio.volume = volume / 100;

      // Update progress more frequently for smoother updates
      progressInterval.current = setInterval(updateProgress, 100);

      // Also listen to native events for more accurate updates
      audio.addEventListener('timeupdate', updateProgress);
      audio.addEventListener('loadedmetadata', updateProgress);
      audio.addEventListener('seeking', updateProgress);
      audio.addEventListener('seeked', updateProgress);

      return () => {
        if (progressInterval.current) {
          clearInterval(progressInterval.current);
        }
        audio.removeEventListener('timeupdate', updateProgress);
        audio.removeEventListener('loadedmetadata', updateProgress);
        audio.removeEventListener('seeking', updateProgress);
        audio.removeEventListener('seeked', updateProgress);
      };
    }
  }, [setProgress, setDuration, volume, isOpen]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (value: number[]) => {
    const time = value[0];
    const audio = document.querySelector('audio');
    if (audio) {
      audio.currentTime = time;
      setProgress(time);
    }
  };

  if (!currentSong) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full w-full h-[100dvh] p-0 overflow-hidden bg-black/95 border-none">
        <div className="relative h-full flex flex-col">
          {/* Background Image with Gradient */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${currentSong.imageUrl})`,
              filter: 'blur(100px) brightness(0.2)',
            }}
          />
          
          {/* Header */}
          <div className="relative z-10 flex justify-between items-center p-4 sm:p-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white/60 hover:text-white"
              >
                <X className="h-6 w-6" />
              </Button>
              <h1 className="text-lg sm:text-xl font-semibold text-white">Now Playing</h1>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-8 gap-6 sm:gap-12">
            {/* Album Art */}
            <div className="w-64 h-64 sm:w-96 sm:h-96">
              <img
                src={currentSong.imageUrl}
                alt={currentSong.title}
                className="w-full h-full object-cover rounded-lg shadow-2xl"
              />
            </div>

            {/* Song Info */}
            <div className="w-full max-w-2xl px-2">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-3 line-clamp-2">
                  {currentSong.title}
                </h2>
                <p className="text-lg sm:text-xl text-white/60 line-clamp-1">
                  {currentSong.artist}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 mb-6 sm:mb-8">
                <div className="relative w-full h-1 bg-white/10 rounded-full">
                  <Slider
                    value={[progress]}
                    max={duration || 100}
                    step={1}
                    className="absolute inset-0 w-full touch-none"
                    onValueChange={handleSeek}
                  />
                </div>
                <div className="flex justify-between text-sm text-white/60">
                  <span>{formatTime(progress)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex flex-col items-center gap-4 sm:gap-6">
                <div className="flex items-center justify-center gap-4 sm:gap-8">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    <Shuffle className="h-5 w-5 sm:h-6 sm:w-6" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white/60 hover:text-white transition-colors"
                    onClick={playPrevious}
                  >
                    <SkipBack className="h-5 w-5 sm:h-6 sm:w-6" />
                  </Button>

                  <Button
                    size="icon"
                    onClick={togglePlay}
                    className="bg-white hover:bg-white/90 text-black rounded-full h-14 w-14 sm:h-16 sm:w-16 flex items-center justify-center"
                  >
                    {isPlaying ? (
                      <Pause className="h-7 w-7 sm:h-8 sm:w-8" />
                    ) : (
                      <Play className="h-7 w-7 sm:h-8 sm:w-8" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white/60 hover:text-white transition-colors"
                    onClick={playNext}
                  >
                    <SkipForward className="h-5 w-5 sm:h-6 sm:w-6" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    <Repeat className="h-5 w-5 sm:h-6 sm:w-6" />
                  </Button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-4">
                  <Volume1 className="h-4 w-4 sm:h-5 sm:w-5 text-white/60" />
                  <div className="relative w-24 sm:w-32 h-1 bg-white/10 rounded-full">
                    <Slider
                      value={[volume]}
                      max={100}
                      step={1}
                      className="absolute inset-0 w-full touch-none"
                      onValueChange={(value) => {
                        setVolume(value[0]);
                        const audio = document.querySelector('audio');
                        if (audio) audio.volume = value[0] / 100;
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 flex justify-center gap-6 p-4 sm:p-8">
            <Button
              onClick={() => toggleLike(currentSong._id)}
              variant="ghost"
              size="icon"
              className={cn(
                "hover:text-white transition-colors",
                isLiked ? "text-green-500" : "text-white/60"
              )}
            >
              <Heart className={cn("h-5 w-5 sm:h-6 sm:w-6", isLiked && "fill-current")} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-white/60 hover:text-white transition-colors"
            >
              <Share2 className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 