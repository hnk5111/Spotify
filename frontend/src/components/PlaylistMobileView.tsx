import { ScrollArea } from "./ui/scroll-area";
import { ListMusic, Play, Pause, Shuffle } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import AudioPlayer from "./AudioPlayer";

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
    <div className="flex flex-col h-full relative">
      {/* Playlist Header */}
      <div className="p-4 text-center">
        <div className="w-40 h-40 mx-auto mb-4">
          <img
            src={playlist.imageUrl}
            alt={playlist.title}
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
        </div>
        <h1 className="text-xl font-bold mb-2">{playlist.title}</h1>
        <p className="text-sm text-zinc-400">{playlist.songs.length} songs</p>
      </div>

      {/* Sticky Play Controls */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-zinc-800 p-4 flex items-center justify-between">
        <Button
          variant="default"
          size="lg"
          className="bg-green-500 hover:bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center"
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
        <Button variant="ghost" size="icon" className="rounded-full">
          <Shuffle className="h-5 w-5" />
        </Button>
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
          }}
        />
      )}

      {/* Songs List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {playlist.songs.map((song) => (
            <Button
              key={song._id}
              variant="ghost"
              className={`w-full flex items-center justify-between p-3 hover:bg-accent/50 transition-colors ${
                currentSongId === song._id ? "bg-accent text-green-500" : ""
              }`}
              onClick={() => handlePlayPause(song._id, song.audioUrl)}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  {currentSongId === song._id ? (
                    isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )
                  ) : (
                    <ListMusic className="h-5 w-5" />
                  )}
                </div>
                <div className="text-left">
                  <p
                    className={`font-medium ${
                      currentSongId === song._id ? "text-green-500" : ""
                    }`}
                  >
                    {song.title}
                  </p>
                  <p className="text-sm text-zinc-400">{song.artist}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-400">
                  {song.duration || "3:30"}
                </span>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PlaylistMobileView;
