import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Heart,
  Share2,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  MoreVertical,
  MessageCircle,
  Instagram,
  Share,
  Plus,
  ChevronLeft,
  Download,
  ListMusic,
  Mic2,
  X,
} from "lucide-react";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useMusicStore } from "@/stores/useMusicStore";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Slider } from "./ui/slider";
import { useEffect, useState, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "./ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "react-hot-toast";
import { useLyricsStore } from "@/stores/useLyricsStore";

interface SongDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SongDetailsModal = ({
  isOpen,
  onClose,
}: SongDetailsModalProps) => {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    playNext,
    playPrevious,
    progress,
    duration,
    setProgress,
    setDuration,
    queue,
    setQueue,
    removeFromQueue,
  } = usePlayerStore();
  const toggleLike = useMusicStore((state) => state.toggleLike);
  const songs = useMusicStore((state) => state.songs);
  const [volume] = useState(75);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const {
    lyrics,
    isLoading: isLoadingLyrics,
    error: lyricsError,
    fetchLyrics,
  } = useLyricsStore();
  const [isDownloading, setIsDownloading] = useState(false);

  // Add audio ref to prevent repeated querySelector calls
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isLiked = currentSong
    ? songs.find((s) => s._id === currentSong._id)?.isLiked
    : false;

  useEffect(() => {
    // Get audio element only once and store in ref
    audioRef.current = document.querySelector("audio");

    const audio = audioRef.current;
    if (!audio || !isOpen) return;

    const updateProgress = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    // Set initial volume
    audio.volume = volume / 100;

    // Update progress more frequently for smoother updates
    progressInterval.current = setInterval(updateProgress, 100);

    // Add event listeners
    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateProgress);
    audio.addEventListener("seeking", updateProgress);
    audio.addEventListener("seeked", updateProgress);

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      // Clean up event listeners
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateProgress);
      audio.removeEventListener("seeking", updateProgress);
      audio.removeEventListener("seeked", updateProgress);
    };
  }, [isOpen]); // Only run when modal opens/closes

  // Update video playback effect with improved error handling
  useEffect(() => {
    if (!videoRef.current || !currentSong?.videoUrl || !isOpen) return;

    const video = videoRef.current;
    video.load(); // Force reload video source

    if (isPlaying) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setVideoError(false);
            setIsVideoLoaded(true);
          })
          .catch((error) => {
            console.error("Video playback failed:", error);
            setVideoError(true);
          });
      }
    } else {
      video.pause();
    }

    return () => {
      video.pause();
    };
  }, [isPlaying, currentSong?.videoUrl, isOpen]);

  // Update the lyrics effect to add debug logging
  useEffect(() => {
    if (currentSong?._id && showLyrics) {
      console.log("Fetching lyrics for song:", currentSong._id);
      fetchLyrics(currentSong._id);
    }
  }, [currentSong?._id, showLyrics, fetchLyrics]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleSeek = (value: number[]) => {
    const time = value[0];
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
      setProgress(time);
    }
  };

  const handleShare = async (platform: string) => {
    if (!currentSong) return;

    const shareData = {
      title: currentSong.title,
      text: `Check out ${currentSong.title} by ${currentSong.artist}`,
      url: window.location.href,
    };

    try {
      switch (platform) {
        case "whatsapp":
          window.open(
            `https://wa.me/?text=${encodeURIComponent(
              shareData.text + " " + shareData.url
            )}`,
            "_blank"
          );
          break;
        case "instagram":
          // Since Instagram doesn't have a direct share URL, we'll copy to clipboard
          await navigator.clipboard.writeText(
            shareData.text + " " + shareData.url
          );
          alert("Link copied! You can now share it on Instagram");
          break;
        case "message":
          await navigator.clipboard.writeText(
            shareData.text + " " + shareData.url
          );
          alert("Link copied! You can now share it via message");
          break;
        case "others":
          if (navigator.share) {
            await navigator.share(shareData);
          } else {
            await navigator.clipboard.writeText(
              shareData.text + " " + shareData.url
            );
            alert("Link copied to clipboard!");
          }
          break;
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleDownload = async () => {
    if (!currentSong?.audioUrl) return;

    try {
      setIsDownloading(true);

      // Use audioUrl for download
      const response = await fetch(currentSong.audioUrl);
      const blob = await response.blob();

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${currentSong.title} - ${currentSong.artist}.mp3`;

      // Trigger download
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Download started!");
    } catch (error) {
      console.error("Error downloading song:", error);
      toast.error("Failed to download song. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!currentSong) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-full w-full h-[100dvh] p-0 overflow-hidden bg-gradient-to-b from-black/95 to-zinc-900/95 border-none">
          <DialogTitle className="sr-only">
            Now Playing: {currentSong.title} by {currentSong.artist}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Music player controls and song details for {currentSong.title}
          </DialogDescription>
          <div className="relative h-full flex flex-col">
            {/* Video Background */}
            {currentSong?.videoUrl && !videoError && (
              <div className="absolute inset-0 bg-black">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover opacity-50"
                  playsInline
                  loop
                  muted
                  poster={currentSong.imageUrl}
                  onLoadedData={() => setIsVideoLoaded(true)}
                  onError={() => setVideoError(true)}
                  style={{
                    filter: "blur(10px) brightness(0.4)",
                    transform: "scale(1.1)",
                  }}
                >
                  <source src={currentSong.videoUrl} type="video/mp4" />
                  <source src={currentSong.videoUrl} type="video/webm" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

            {/* Fallback Background for when there's no video */}
            {(!currentSong?.videoUrl || !isVideoLoaded) && (
              <div
                className="absolute inset-0 bg-cover bg-center opacity-50"
                style={{
                  backgroundImage: `url(${currentSong?.imageUrl})`,
                  filter: "blur(80px) brightness(0.3)",
                }}
              />
            )}

            {/* Header - Updated with queue functionality */}
            <div className="relative z-10 flex items-center justify-between px-4 py-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white/60 hover:text-white"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <span className="text-white/80 font-medium">Now Playing</span>
              <Button
                variant="ghost"
                size="icon"
                className="text-white/60 hover:text-white"
                onClick={() => setShowQueue(true)}
              >
                <ListMusic className="h-6 w-6" />
              </Button>
            </div>

            {/* Main Content - Updated for mobile */}
            <div className="relative z-10 flex-1 flex flex-col items-center px-4 pt-8 pb-4">
              {/* Circular Album Art */}
              <div className="w-[75vw] h-[75vw] max-w-[320px] max-h-[320px] rounded-full overflow-hidden ring-2 ring-white/10 shadow-2xl mb-8">
                {currentSong?.videoUrl && !videoError ? (
                  <video
                    className="w-full h-full object-cover"
                    playsInline
                    loop
                    muted
                    autoPlay={isPlaying}
                    poster={currentSong.imageUrl}
                    onError={() => setVideoError(true)}
                  >
                    <source src={currentSong.videoUrl} type="video/mp4" />
                    <source src={currentSong.videoUrl} type="video/webm" />
                  </video>
                ) : (
                  <img
                    src={currentSong.imageUrl}
                    alt={currentSong.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Song Info */}
              <div className="w-full text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2 line-clamp-1">
                  {currentSong.title}
                </h2>
                <p className="text-base text-white/60">{currentSong.artist}</p>
              </div>

              {/* Progress Bar */}
              <div className="w-full space-y-1 mb-6">
                <div className="relative h-1 bg-white/10 rounded-full overflow-hidden">
                  <Slider
                    value={[progress]}
                    max={duration || 100}
                    step={1}
                    className="absolute inset-0 w-full touch-none"
                    onValueChange={handleSeek}
                  />
                </div>
                <div className="flex justify-between text-sm text-white/60 px-1">
                  <span>{formatTime(progress)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="w-full flex items-center justify-center gap-8 mb-8">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white/60 hover:text-white"
                >
                  <Shuffle className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={playPrevious}
                  className="text-white/60 hover:text-white"
                >
                  <SkipBack className="h-6 w-6" />
                </Button>
                <Button
                  size="icon"
                  onClick={togglePlay}
                  className="bg-white hover:bg-white/90 text-black rounded-full h-14 w-14 flex items-center justify-center shadow-lg"
                >
                  {isPlaying ? (
                    <Pause className="h-7 w-7" />
                  ) : (
                    <Play className="h-7 w-7" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={playNext}
                  className="text-white/60 hover:text-white"
                >
                  <SkipForward className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white/60 hover:text-white"
                >
                  <Repeat className="h-5 w-5" />
                </Button>
              </div>

              {/* Action Buttons - Updated with loading state */}
              <div className="w-full flex items-center justify-center gap-4">
                <Button
                  onClick={() => toggleLike(currentSong._id)}
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "hover:text-white transition-colors",
                    isLiked ? "text-green-500" : "text-white/60"
                  )}
                >
                  <Heart className={cn("h-6 w-6", isLiked && "fill-current")} />
                </Button>

                <Button
                  variant="outline"
                  className="rounded-full px-6 py-2 text-white border-white/20 hover:bg-white/10 disabled:opacity-50"
                  onClick={handleDownload}
                  disabled={isDownloading}
                >
                  <Download
                    className={cn(
                      "h-5 w-5 mr-2",
                      isDownloading && "animate-bounce"
                    )}
                  />
                  {isDownloading ? "Downloading..." : "Download Song"}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white/60 hover:text-white"
                    >
                      <MoreVertical className="h-6 w-6" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-zinc-900/95 text-white border-zinc-800 backdrop-blur-lg">
                    <DropdownMenuItem
                      className="cursor-pointer hover:bg-white/10 transition-colors"
                      onClick={() => toggleLike(currentSong._id)}
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      <span>Add to Liked Songs</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer hover:bg-white/10 transition-colors">
                      <Plus className="mr-2 h-4 w-4" />
                      <span>Add to Playlist</span>
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="cursor-pointer hover:bg-white/10 transition-colors">
                        <Share2 className="mr-2 h-4 w-4" />
                        <span>Share</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent className="bg-zinc-900/95 text-white border-zinc-800 backdrop-blur-lg">
                          <DropdownMenuItem
                            className="cursor-pointer hover:bg-white/10 transition-colors"
                            onClick={() => handleShare("whatsapp")}
                          >
                            <MessageCircle className="mr-2 h-4 w-4" />
                            <span>WhatsApp</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer hover:bg-white/10 transition-colors"
                            onClick={() => handleShare("instagram")}
                          >
                            <Instagram className="mr-2 h-4 w-4" />
                            <span>Instagram</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer hover:bg-white/10 transition-colors"
                            onClick={() => handleShare("message")}
                          >
                            <MessageCircle className="mr-2 h-4 w-4" />
                            <span>Message</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer hover:bg-white/10 transition-colors"
                            onClick={() => handleShare("others")}
                          >
                            <Share className="mr-2 h-4 w-4" />
                            <span>Others</span>
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Lyrics Button - Updated with active state */}
              <Button
                variant="ghost"
                className={cn(
                  "mt-auto text-white/60 hover:text-white gap-2",
                  showLyrics && "text-white bg-white/10"
                )}
                onClick={() => setShowLyrics(!showLyrics)}
              >
                <Mic2 className="h-5 w-5" />
                Lyrics
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Lyrics Sheet */}
      <Sheet open={showLyrics} onOpenChange={setShowLyrics}>
        <SheetContent
          side="bottom"
          className="h-[70vh] bg-zinc-900/95 border-zinc-800 text-white"
        >
          <SheetHeader className="relative">
            <SheetTitle className="text-white text-center">
              {currentSong?.title} - Lyrics
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-0 text-white/60 hover:text-white"
              onClick={() => setShowLyrics(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </SheetHeader>
          <ScrollArea className="h-full mt-4 px-4">
            {isLoadingLyrics ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
              </div>
            ) : lyricsError ? (
              <div className="text-center text-white/60 py-8">
                <p className="mb-2">Failed to load lyrics</p>
                <p className="text-sm text-white/40 mb-4">{lyricsError}</p>
                <Button
                  variant="outline"
                  onClick={() => currentSong && fetchLyrics(currentSong._id)}
                  className="text-sm"
                >
                  Try Again
                </Button>
              </div>
            ) : lyrics ? (
              <div className="whitespace-pre-line text-white/90 text-center text-lg leading-relaxed tracking-wide py-4">
                {lyrics.split("\n").map((line, index) => (
                  <p
                    key={index}
                    className={cn(
                      "my-2",
                      line.trim() === "" && "my-6" // Add more spacing for empty lines
                    )}
                  >
                    {line || "\u00A0"}
                  </p>
                ))}
              </div>
            ) : (
              <div className="text-center text-white/60 py-8">
                <p className="text-lg mb-2">No lyrics available</p>
                <p className="text-sm text-white/40 mb-4">
                  We couldn't find lyrics for this song
                </p>
                <Button
                  variant="outline"
                  onClick={() => currentSong && fetchLyrics(currentSong._id)}
                  className="text-sm"
                >
                  Try Again
                </Button>
              </div>
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Queue Sheet */}
      <Sheet open={showQueue} onOpenChange={setShowQueue}>
        <SheetContent
          side="right"
          className="w-full sm:w-[400px] bg-zinc-900/95 border-zinc-800 text-white"
        >
          <SheetHeader>
            <SheetTitle className="text-white">Queue</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-5rem)] mt-4">
            {queue.length > 0 ? (
              <div className="space-y-4">
                {queue.map((song, index) => (
                  <div
                    key={song._id}
                    className="flex items-center gap-3 group hover:bg-white/5 p-2 rounded-lg"
                  >
                    <img
                      src={song.imageUrl}
                      alt={song.title}
                      className="w-12 h-12 rounded-md object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {song.title}
                      </p>
                      <p className="text-xs text-white/60 truncate">
                        {song.artist}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 text-white/60 hover:text-white"
                      onClick={() => removeFromQueue(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-white/60 mt-8">
                No songs in queue
              </div>
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
};
