import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { usePlayerStore } from "@/stores/usePlayerStore";
import {
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume1,
  MoreHorizontal,
  Heart,
  ListPlus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SongDetailsModal } from "@/components/SongDetailsModal";

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const PlaybackControls = () => {
  const { currentSong, isPlaying, togglePlay, playNext, playPrevious } = usePlayerStore();
  const { playlists, createPlaylist, addSongToPlaylist } = usePlaylistStore();
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(75);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSongDetailsOpen, setIsSongDetailsOpen] = useState(false);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Clear existing interval when song changes
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }

    // Reset progress when song changes
    setProgress(0);
    setDuration(0);

    const isYouTubeSource = currentSong?.audioUrl?.includes('youtube.com') || currentSong?.audioUrl?.includes('youtu.be');
    const audio = document.querySelector('audio');

    if (!currentSong) return;

    if (isYouTubeSource) {
      // For YouTube sources, update progress every 100ms
      if (isPlaying) {
        progressInterval.current = setInterval(() => {
          const player = (window as any).player;
          if (player && typeof player.getCurrentTime === 'function') {
            const currentTime = player.getCurrentTime();
            const videoDuration = player.getDuration();
            setProgress(currentTime);
            setDuration(videoDuration);
          }
        }, 100);
      }
    } else if (audio) {
      // For audio sources
      const updateProgress = () => {
        setProgress(audio.currentTime);
        setDuration(audio.duration || 0);
      };

      audio.addEventListener('timeupdate', updateProgress);
      audio.addEventListener('loadedmetadata', updateProgress);
      audio.volume = volume / 100;

      return () => {
        audio.removeEventListener('timeupdate', updateProgress);
        audio.removeEventListener('loadedmetadata', updateProgress);
      };
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [currentSong, isPlaying, volume]);

  const handleSeek = (value: number[]) => {
    const time = value[0];
    const isYouTubeSource = currentSong?.audioUrl?.includes('youtube.com') || currentSong?.audioUrl?.includes('youtu.be');
    
    if (isYouTubeSource) {
      const player = (window as any).player;
      if (player && typeof player.seekTo === 'function') {
        player.seekTo(time);
      }
    } else {
      const audio = document.querySelector('audio');
      if (audio) {
        audio.currentTime = time;
      }
    }
    setProgress(time);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    const isYouTubeSource = currentSong?.audioUrl?.includes('youtube.com') || currentSong?.audioUrl?.includes('youtu.be');
    if (isYouTubeSource) {
      const player = (window as any).player;
      if (player && typeof player.setVolume === 'function') {
        player.setVolume(newVolume);
      }
    } else {
      const audio = document.querySelector('audio');
      if (audio) {
        audio.volume = newVolume / 100;
      }
    }
  };

  const handleAddToLikedSongs = () => {
    if (!currentSong) return;
    useMusicStore.getState().toggleLike(currentSong._id);
  };

  const handleCreateAndAddToPlaylist = () => {
    if (newPlaylistName.trim() && currentSong) {
      createPlaylist(newPlaylistName.trim(), currentSong._id);
      setNewPlaylistName("");
      setIsDialogOpen(false);
      toast.success("Created playlist and added song");
    }
  };

  const handleAddToPlaylist = (playlistId: string) => {
    if (!currentSong) return;
    addSongToPlaylist(playlistId, currentSong);
    toast.success("Added to playlist");
  };

  return (
    <>
      <footer className="h-auto sm:h-24 bg-black/90 border-t border-white/10 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center h-full max-w-[1800px] mx-auto">
          {/* Mobile Song Details and Controls */}
          {currentSong && (
            <div className="w-full sm:hidden py-2 px-2">
              <div className="flex items-center gap-3">
                <img
                  src={currentSong.imageUrl}
                  alt={currentSong.title}
                  className="w-12 h-12 object-cover rounded-md shadow-md"
                />
                <div className="flex-1 min-w-0">
                  <div 
                    className="font-medium truncate text-white hover:underline cursor-pointer"
                    onClick={() => setIsSongDetailsOpen(true)}
                  >
                    {currentSong.title}
                  </div>
                  <div className="text-sm text-white/60 truncate">
                    {currentSong.artist}
                  </div>
                </div>
              </div>

              {/* Mobile Slider */}
              <div className="mt-3 flex flex-col w-full px-1">
                <div className="relative w-full h-1 bg-white/10 rounded-full">
                  <Slider
                    value={[progress]}
                    max={duration || 100}
                    step={1}
                    className="absolute inset-0 w-full hover:cursor-grab active:cursor-grabbing"
                    onValueChange={handleSeek}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <div className="text-xs text-white/60">
                    {formatTime(progress)}
                  </div>
                  <div className="text-xs text-white/60">
                    {formatTime(duration)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Song Details */}
          <div className="hidden sm:flex items-center gap-4 min-w-[180px] w-[30%]">
            {currentSong && (
              <>
                <img
                  src={currentSong.imageUrl}
                  alt={currentSong.title}
                  className="w-14 h-14 object-cover rounded-md shadow-md"
                />
                <div className="flex-1 min-w-0">
                  <div 
                    className="font-medium truncate hover:underline cursor-pointer text-white"
                    onClick={() => setIsSongDetailsOpen(true)}
                  >
                    {currentSong.title}
                  </div>
                  <div className="text-sm text-white/60 truncate hover:underline cursor-pointer">
                    {currentSong.artist}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Player Controls */}
          <div className="flex flex-col items-center gap-2 flex-1 max-w-full sm:max-w-[45%] py-2">
            <div className="flex items-center gap-4 sm:gap-6">
              <Button
                size="icon"
                variant="ghost"
                className="text-white/60 hover:text-white transition-colors"
              >
                <Shuffle className="h-4 w-4" />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="text-white/60 hover:text-white transition-colors"
                onClick={playPrevious}
                disabled={!currentSong}
              >
                <SkipBack className="h-4 w-4" />
              </Button>

              <Button
                size="icon"
                className="bg-white hover:bg-white/90 text-black rounded-full h-8 w-8 transition-all duration-200 shadow-md flex items-center justify-center"
                onClick={togglePlay}
                disabled={!currentSong}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="text-white/60 hover:text-white transition-colors"
                onClick={playNext}
                disabled={!currentSong}
              >
                <SkipForward className="h-4 w-4" />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="text-white/60 hover:text-white transition-colors"
              >
                <Repeat className="h-4 w-4" />
              </Button>
            </div>

            <div className="hidden sm:flex items-center gap-2 w-full">
              <div className="text-xs text-white/60">
                {formatTime(progress)}
              </div>
              <div className="relative flex-1 h-1 bg-white/10 rounded-full">
                <Slider
                  value={[progress]}
                  max={duration || 100}
                  step={1}
                  className="absolute inset-0 w-full hover:cursor-grab active:cursor-grabbing"
                  onValueChange={handleSeek}
                />
              </div>
              <div className="text-xs text-white/60">{formatTime(duration)}</div>
            </div>
          </div>

          {/* Volume Controls */}
          <div className="hidden sm:flex items-center gap-4 min-w-[180px] w-[30%] justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white/60 hover:text-white transition-colors"
                  disabled={!currentSong}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-zinc-900 border-white/10">
                <DropdownMenuItem 
                  onClick={handleAddToLikedSongs}
                  className="text-white/80 focus:text-white focus:bg-white/10"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Add to Liked Songs
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="text-white/80 focus:text-white focus:bg-white/10">
                    <ListPlus className="h-4 w-4 mr-2" />
                    Add to Playlist
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="bg-zinc-900 border-white/10">
                    {playlists.map((playlist) => (
                      <DropdownMenuItem
                        key={playlist.id}
                        onClick={() => handleAddToPlaylist(playlist.id)}
                        className="text-white/80 focus:text-white focus:bg-white/10"
                      >
                        {playlist.name}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator className="bg-white/10" />
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <DropdownMenuItem 
                          onSelect={(e) => e.preventDefault()}
                          className="text-white/80 focus:text-white focus:bg-white/10"
                        >
                          Create New Playlist
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent className="bg-zinc-900 border-white/10">
                        <DialogHeader>
                          <DialogTitle className="text-white">Create New Playlist</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <Label htmlFor="new-playlist-name" className="text-white/80">Playlist Name</Label>
                            <Input
                              id="new-playlist-name"
                              placeholder="Enter playlist name"
                              value={newPlaylistName}
                              onChange={(e) => setNewPlaylistName(e.target.value)}
                              className="bg-white/5 border-white/10 text-white"
                            />
                          </div>
                          <Button
                            onClick={handleCreateAndAddToPlaylist}
                            className="w-full bg-white text-black hover:bg-white/90"
                          >
                            Create and Add Song
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="text-white/60 hover:text-white transition-colors"
              >
                <Volume1 className="h-4 w-4" />
              </Button>

              <div className="relative w-24 h-1 bg-white/10 rounded-full">
                <Slider
                  value={[volume]}
                  max={100}
                  step={1}
                  className="absolute inset-0 w-full hover:cursor-grab active:cursor-grabbing"
                  onValueChange={handleVolumeChange}
                />
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Song Details Modal */}
      <SongDetailsModal 
        isOpen={isSongDetailsOpen} 
        onClose={() => setIsSongDetailsOpen(false)} 
      />
    </>
  );
};
