import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import {
  Heart,
  Frown,
  Smile,
  Music,
  Loader2,
  Play,
  ListMusic,
  PartyPopper,
  Pause,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";
import { usePlayerStore } from "@/stores/usePlayerStore";

interface Song {
  _id: string;
  title: string;
  artist: string;
  imageUrl: string;
  audioUrl: string;
}

type Mood = "happy" | "sad" | "romantic" | "party" | null;

const moods = [
  { id: "happy", icon: Smile, label: "Happy", color: "text-yellow-500" },
  { id: "sad", icon: Frown, label: "Sad", color: "text-blue-500" },
  { id: "romantic", icon: Heart, label: "Romantic", color: "text-red-500" },
  { id: "party", icon: PartyPopper, label: "Party", color: "text-purple-500" },
];

const MoodPlaylist = () => {
  const [selectedMood, setSelectedMood] = useState<Mood>(null);
  const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();

  const { data: songs = [], isLoading, error } = useQuery({
    queryKey: ["mood-songs", selectedMood],
    queryFn: async () => {
      if (!selectedMood) return [];

      try {
        console.log('Fetching songs for mood:', selectedMood);
        const { data } = await axiosInstance.get(`/songs/mood/${selectedMood}`);
        // Transform the data to match the Song interface
        const transformedSongs = data.map((song: any) => {
          // Extract video ID from YouTube URL
          const videoId = song.url.split('v=')[1];
          return {
            _id: song.id,
            title: song.name,
            artist: song.primaryArtists,
            imageUrl: song.image,
            audioUrl: `https://www.youtube.com/watch?v=${videoId}`,
            albumId: null,
            duration: parseInt(song.duration.split(':')[0]) * 60 + parseInt(song.duration.split(':')[1]),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
        });
        console.log('Received songs:', transformedSongs);
        return transformedSongs;
      } catch (error) {
        console.error('Error fetching songs:', error);
        toast.error('Failed to fetch songs. Please try again.');
        throw error;
      }
    },
    enabled: !!selectedMood,
  });

  const handlePlayPause = async (song: Song) => {
    try {
      if (!song.audioUrl) {
        toast.error("This song is currently not available for playback");
        return;
      }

      console.log('Playing song:', song.title);
      console.log('URL:', song.audioUrl);

      if (currentSong?._id === song._id) {
        togglePlay();
      } else {
        const songIndex = songs.findIndex((s: Song) => s._id === song._id);
        playAlbum(songs, songIndex);
      }
    } catch (error) {
      console.error('Error playing song:', error);
      toast.error("Unable to play this song. Please try another.");
    }
  };

  return (
    <div className="flex flex-col h-full pb-40">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/20 to-background z-0" />
        <div className="relative z-10 p-6 pb-8">
          <h2 className="text-2xl font-bold text-center mb-6">
            How are you feeling today?
          </h2>
          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
            {moods.map((mood) => {
              const Icon = mood.icon;
              return (
                <Button
                  key={mood.id}
                  variant={selectedMood === mood.id ? "default" : "outline"}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 h-auto",
                    selectedMood === mood.id ? "bg-primary" : "hover:bg-accent/50",
                  )}
                  onClick={() => setSelectedMood(mood.id as Mood)}
                >
                  <Icon className={cn("h-8 w-8", mood.color)} />
                  <span className="text-sm font-medium">{mood.label}</span>
                </Button>
              )}
            )}
          </div>
        </div>
      </div>

      {selectedMood && (
        <ScrollArea className="flex-1 px-4">
          <div className="py-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)} Songs
              </h3>
              <Button variant="ghost" size="sm" className="text-xs">
                <Music className="h-4 w-4 mr-2" />
                {songs?.length || 0} songs
              </Button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-12 text-muted-foreground">
                Failed to load songs. Please try again.
              </div>
            ) : songs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No songs found for this mood.
              </div>
            ) : (
              <div className="space-y-2">
                {songs.map((song: Song) => (
                  <div
                    key={song._id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors group"
                  >
                    <div 
                      className="relative w-12 h-12 rounded-md overflow-hidden cursor-pointer bg-accent/30"
                      onClick={() => handlePlayPause(song)}
                    >
                      {song.imageUrl ? (
                        <img
                          src={song.imageUrl}
                          alt={song.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Music className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        {currentSong?._id === song._id && isPlaying ? (
                          <Pause className="h-6 w-6 text-white" />
                        ) : (
                          <Play className="h-6 w-6 text-white" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "font-medium truncate",
                        currentSong?._id === song._id && "text-primary"
                      )}>
                        {song.title}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {song.artist}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ListMusic className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default MoodPlaylist; 