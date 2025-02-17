import { ScrollArea } from "./ui/scroll-area";
import { ListMusic, Play, Pause, Shuffle , MoreVertical } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import AudioPlayer from "./AudioPlayer";
import { cn } from "@/lib/utils";

interface PlaylistMobileViewProps {
  playlist: {
    _id: string;
    title: string;
    imageUrl: string;
    songs: any[];
  };
  onPlaySong: (songId: string) => void;
}

const PlaylistMobileView = ({
  playlist,
  onPlaySong,
}: PlaylistMobileViewProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongId, setCurrentSongId] = useState<string | null>(null);
  const [currentSongUrl, setCurrentSongUrl] = useState<string | null>(null);

  const handlePlayPause = async (songId: string, audioUrl: string) => {
    try {
      if (!audioUrl) {
        console.error("No audio URL provided");
        return;
      }

      // Add audio format check
      if (!audioUrl.includes('.mp3')) {
        console.warn("Audio format may not be supported");
      }

      // Check if the audio URL is valid
      const response = await fetch(audioUrl, { method: "HEAD" });
      if (!response.ok) {
        console.error("Audio source not found or invalid");
        return;
      }

      if (currentSongId === songId) {
        setIsPlaying(!isPlaying);
      } else {
        setCurrentSongId(songId);
        setCurrentSongUrl(audioUrl);
        setIsPlaying(true);
        onPlaySong(songId);
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlaying(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative bg-gradient-to-b from-background/80 to-background">
      {/* Playlist Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/20 to-background z-0" />
        <div className="relative z-10 p-6 pb-8">
          <div className="w-48 h-48 mx-auto mb-6 relative">
            <img
              src={playlist.imageUrl}
              alt={playlist.title}
              className="w-full h-full object-cover rounded-lg shadow-xl ring-1 ring-white/10"
            />
            <div className="absolute inset-0 bg-black/20 rounded-lg" />
          </div>
          <h1 className="text-2xl font-bold mb-2 text-center">{playlist.title}</h1>
          <p className="text-sm text-muted-foreground text-center">
            {playlist.songs.length} songs
          </p>
        </div>
      </div>

      {/* Sticky Play Controls */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="default"
            size="lg"
            className={cn(
              "bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-12 h-12",
              "flex items-center justify-center shadow-lg transition-all duration-200",
              "hover:scale-105 active:scale-95"
            )}
            onClick={() =>
              handlePlayPause(
                playlist.songs[0]?._id,
                playlist.songs[0]?.audioUrl || ""
              )
            }
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-1" />
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-accent/50"
          >
            <Shuffle className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {currentSongUrl && (
        <AudioPlayer
          url={currentSongUrl}
          isPlaying={isPlaying}
          onError={() => {
            setIsPlaying(false);
            setCurrentSongUrl(null);
            setCurrentSongId(null);
            console.error("Failed to play audio");
          } } setIsPlaying={function (): void {
            throw new Error("Function not implemented.");
          } }        />
      )}

      {/* Songs List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {playlist.songs.map((song, index) => (
            <Button
              key={song._id}
              variant="ghost"
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-lg",
                "hover:bg-accent/50 transition-all duration-200",
                currentSongId === song._id ? "bg-accent text-primary" : "",
                "group"
              )}
              onClick={() => handlePlayPause(song._id, song.audioUrl)}
            >
              <div className="flex items-center gap-4">
                <div className="w-4 text-sm text-muted-foreground">
                  {index + 1}
                </div>
                <div className="relative">
                  {currentSongId === song._id ? (
                    isPlaying ? (
                      <Pause className="h-5 w-5 text-primary" />
                    ) : (
                      <Play className="h-5 w-5 text-primary" />
                    )
                  ) : (
                    <ListMusic className="h-5 w-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
                <div className="text-left min-w-0">
                  <p
                    className={cn(
                      "font-medium truncate",
                      currentSongId === song._id ? "text-primary" : ""
                    )}
                  >
                    {song.title}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {song.artist}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {song.duration || "3:30"}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PlaylistMobileView;
