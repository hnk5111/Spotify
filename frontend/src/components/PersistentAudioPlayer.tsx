import { useAudioStore } from "@/stores/useAudioStore";
import { Music } from "lucide-react";
import AudioPlayer from "./AudioPlayer";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

const PersistentAudioPlayer = () => {
  const { currentSong, isPlaying, setIsPlaying, setCurrentSong } = useAudioStore();

  const handlePlayError = () => {
    console.error('Playback error for song:', currentSong);
    setIsPlaying(false);
    setCurrentSong(null);
    toast.error("Unable to play this song. Please try another one.");
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border/10 z-50">
      <div className="flex flex-col gap-2 p-4 max-w-screen-lg mx-auto">
        {/* Song Info */}
        <div className="flex items-center gap-3 px-2">
          <div className="relative w-10 h-10 rounded overflow-hidden bg-accent/30">
            {currentSong.image ? (
              <img
                src={currentSong.image}
                alt={currentSong.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Music className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate text-sm">
              {currentSong.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {currentSong.primaryArtists}
            </p>
          </div>
        </div>

        {/* Audio Player */}
        <AudioPlayer
          url={currentSong.url}
          isPlaying={isPlaying}
          onError={handlePlayError}
          setIsPlaying={setIsPlaying}
        />
      </div>
    </div>
  );
};

export default PersistentAudioPlayer; 