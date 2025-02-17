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
import AudioPlayer from "./AudioPlayer";
import { toast } from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";
import { AxiosError } from 'axios';

interface Song {
  id: string;
  name: string;
  url: string;
  image: string;
  duration: string;
  primaryArtists: string;
  language: string;
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
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const { data: songs, isLoading, error } = useQuery({
    queryKey: ["mood-songs", selectedMood],
    queryFn: async () => {
      if (!selectedMood) return [];

      try {
        console.log('Fetching songs for mood:', selectedMood);
        const response = await axiosInstance.get(`/songs/mood/${selectedMood}`);
        console.log('Full API Response:', response);
        
        const { data } = response;
        console.log('Received songs data:', data);
        
        if (!Array.isArray(data)) {
          console.error('Invalid response format. Expected array, got:', typeof data, data);
          throw new Error('Invalid response format from server');
        }

        if (data.length === 0) {
          console.log('No songs returned from API');
          toast.error('No songs found for this mood. Please try another mood.');
          return [];
        }

        // Validate song objects
        const validSongs = data.filter(song => {
          const isValid = song && song.id && song.name && song.url;
          if (!isValid) {
            console.error('Invalid song object:', song);
          }
          return isValid;
        });

        console.log('Valid songs:', validSongs);
        return validSongs;
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error('API Error Details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            headers: error.response?.headers
          });
          const errorMessage = error.response?.data?.message || 'Failed to fetch songs';
          toast.error(errorMessage);
        } else {
          console.error('Unexpected error:', error);
          toast.error('An unexpected error occurred');
        }
        throw error;
      }
    },
    enabled: !!selectedMood,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handlePlayPause = async (song: Song) => {
    try {
      if (!song.url) {
        toast.error("No playable source found for this song");
        return;
      }

      // Check if the URL is accessible
      const response = await fetch(song.url, { method: 'HEAD' });
      if (!response.ok) {
        toast.error("This song is currently not available for playback");
        return;
      }

      if (currentSong?.id === song.id) {
        setIsPlaying(!isPlaying);
      } else {
        setCurrentSong(song);
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing song:', error);
      toast.error("Unable to play this song. Please try another.");
    }
  };

  const handlePlayError = () => {
    setIsPlaying(false);
    setCurrentSong(null);
    toast.error("Playback failed. This song might not be available in your region.");
  };

  return (
    <div className="flex flex-col h-full">
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
            ) : (
              <div className="space-y-2">
                {songs?.map((song: Song) => (
                  <div
                    key={song.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors group"
                  >
                    <div 
                      className="relative w-12 h-12 rounded-md overflow-hidden cursor-pointer"
                      onClick={() => handlePlayPause(song)}
                    >
                      <img
                        src={song.image}
                        alt={song.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        {currentSong?.id === song.id && isPlaying ? (
                          <Pause className="h-6 w-6 text-white" />
                        ) : (
                          <Play className="h-6 w-6 text-white" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "font-medium truncate",
                        currentSong?.id === song.id && "text-primary"
                      )}>
                        {song.name}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {song.primaryArtists}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {Math.floor(parseInt(song.duration) / 60)}:
                        {(parseInt(song.duration) % 60).toString().padStart(2, "0")}
                      </span>
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

      {currentSong && (
        <AudioPlayer
          url={currentSong.url}
          isPlaying={isPlaying}
          onError={handlePlayError}
        />
      )}
    </div>
  );
};

export default MoodPlaylist; 