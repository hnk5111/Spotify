import { useState, useEffect } from "react";
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
  { 
    id: "happy", 
    icon: Smile, 
    label: "Happy", 
    color: "from-yellow-500/80 via-yellow-400/80",
    liquidClass: "animate-flow-1"
  },
  { 
    id: "sad", 
    icon: Frown, 
    label: "Sad", 
    color: "from-blue-500/80 via-blue-400/80",
    liquidClass: "animate-flow-2"
  },
  { 
    id: "romantic", 
    icon: Heart, 
    label: "Romantic", 
    color: "from-red-500/80 via-red-400/80",
    liquidClass: "animate-flow-3"
  },
  { 
    id: "party", 
    icon: PartyPopper, 
    label: "Party", 
    color: "from-purple-500/80 via-purple-400/80",
    liquidClass: "animate-flow-4"
  },
];

const MoodPlaylist = () => {
  const [selectedMood, setSelectedMood] = useState<Mood>(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);
  const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (selectedMood) {
      const timer = setTimeout(() => {
        setIsExpanded(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setIsExpanded(true);
    }
  }, [selectedMood]);

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
  };



  const { data: songs = [], isLoading, error } = useQuery({
    queryKey: ["mood-songs", selectedMood],
    queryFn: async () => {
      if (!selectedMood) return [];
      try {
        const { data } = await axiosInstance.get(`/songs/mood/${selectedMood}`);
        return data
          .filter((song: any) => {
            const videoId = song.url.split('v=')[1];
            return videoId && videoId.length > 0;
          })
          .map((song: any) => ({
            _id: song.id,
            title: song.name,
            artist: song.primaryArtists,
            imageUrl: song.image,
            audioUrl: song.url.includes('youtube.com') ? song.url : `https://www.youtube.com/watch?v=${song.url}`,
            albumId: null,
            duration: parseInt(song.duration.split(':')[0]) * 60 + parseInt(song.duration.split(':')[1]),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }));
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
      const videoId = song.audioUrl.split('v=')[1];
      if (!videoId) {
        toast.error("Invalid video URL. Please try another song.");
        return;
      }

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
    <div className="flex flex-col h-full">
      <div className="relative p-6">
        <div className={cn(
          "grid transition-all duration-500 gap-8",
          selectedMood && !isExpanded ? "md:grid-cols-[400px,1fr] grid-cols-1" : "grid-cols-1"
        )}>
          {/* Mood Selection Container */}
          <div className={cn(
            "transition-all duration-500",
            isExpanded ? "max-w-2xl mx-auto w-full" : "w-full",
            !isExpanded && "md:max-w-none"
          )}>
            <h2 className={cn(
              "text-4xl font-bold text-center mb-8",
              !isExpanded && "text-2xl mb-4",
              "md:text-4xl text-3xl"
            )}>
              How are you feeling today?
            </h2>

            <div className={cn(
              "relative rounded-2xl overflow-hidden backdrop-blur-sm border border-white/10",
              "transition-all duration-500",
              isExpanded ? "h-[32rem]" : "h-[28rem]",
              "md:h-[32rem] h-[24rem]"
            )}
            style={{
              background: "linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)"
            }}>
              {/* Liquid Layers */}
              {moods.map((mood, index) => (
                <div
                  key={mood.id}
                  className={cn(
                    "absolute inset-x-0 bottom-0",
                    "transition-all duration-1000",
                    "bg-gradient-to-t",
                    mood.color,
                    mood.liquidClass,
                    isAnimating ? "h-0" : "h-full"
                  )}
                  style={{
                    transitionDelay: `${index * 200}ms`,
                    transform: "translateZ(0)",
                    willChange: "transform",
                    zIndex: index + 1,
                    mixBlendMode: "soft-light",
                    opacity: selectedMood === mood.id ? 1 : 0.5
                  }}
                >
                  <div className="absolute inset-0">
                    <div className={cn(
                      "absolute inset-0 animate-wave",
                      "opacity-50"
                    )} />
                    <div className={cn(
                      "absolute inset-0 animate-wave2",
                      "opacity-30"
                    )} style={{ animationDelay: `-${index * 1.5}s` }} />
                  </div>
                </div>
              ))}

              {/* Mood Buttons */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8 z-50">
                {moods.map((mood) => {
                  const Icon = mood.icon;
                  const isSelected = selectedMood === mood.id;
                  return (
                    <Button
                      key={mood.id}
                      variant="ghost"
                      className={cn(
                        "w-full flex items-center gap-4 p-6",
                        "backdrop-blur-sm border border-white/20",
                        "transition-all duration-300",
                        "hover:bg-white/10",
                        "md:text-lg text-base",
                        "md:p-6 p-4",
                        isSelected && "bg-white/20 border-white/40 shadow-lg"
                      )}
                      onClick={() => handleMoodSelect(mood.id as Mood)}
                    >
                      <Icon className={cn(
                        "md:h-6 md:w-6 h-5 w-5 transition-transform duration-300",
                        isSelected && "scale-110"
                      )} />
                      <span className="font-medium">{mood.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Songs List */}
          {selectedMood && !isExpanded && (
            <div className={cn(
              "transition-all duration-500",
              "opacity-0 translate-y-10 md:translate-y-0 md:translate-x-10",
              !isExpanded && "opacity-100 translate-y-0 md:translate-x-0",
              "mt-0"
            )}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={cn(
                  "font-bold",
                  "md:text-3xl text-2xl"
                )}>
                  {selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)} Songs
                </h3>
                <Button variant="ghost" size="lg" className="md:text-lg text-base">
                  <Music className="h-5 w-5 mr-2" />
                  {songs?.length || 0} songs
                </Button>
              </div>

              <ScrollArea className={cn(
                "pr-4",
                "md:h-[28rem] h-[24rem]"
              )}>
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
                            "font-medium truncate md:text-base text-sm",
                            currentSong?._id === song._id && "text-primary"
                          )}>
                            {song.title}
                          </p>
                          <p className="text-sm text-muted-foreground truncate md:text-sm text-xs">
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
              </ScrollArea>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodPlaylist; 