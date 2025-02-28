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
  ArrowLeft,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { TherapyAIChat } from "./TherapyAIChat";

interface Song {
  _id: string;
  title: string;
  artist: string;
  imageUrl: string;
  audioUrl: string;
  albumId: string | null;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

type Mood = "happy" | "sad" | "romantic" | "party" | null;

const moods = [
  { 
    id: "happy", 
    icon: Smile, 
    label: "Happy", 
    color: "from-yellow-500/80 via-yellow-400/80 to-yellow-300/80",
    bgColor: "bg-yellow-500",
    description: "Upbeat and cheerful tunes to lift your spirits"
  },
  { 
    id: "sad", 
    icon: Frown, 
    label: "Sad", 
    color: "from-blue-500/80 via-blue-400/80 to-blue-300/80",
    bgColor: "bg-blue-500",
    description: "Melancholic melodies for emotional moments"
  },
  { 
    id: "romantic", 
    icon: Heart, 
    label: "Romantic", 
    color: "from-red-500/80 via-red-400/80 to-red-300/80",
    bgColor: "bg-red-500",
    description: "Love songs and romantic ballads"
  },
  { 
    id: "party", 
    icon: PartyPopper, 
    label: "Party", 
    color: "from-purple-500/80 via-purple-400/80 to-purple-300/80",
    bgColor: "bg-purple-500",
    description: "High-energy tracks to get the party started"
  },
];

const MoodPlaylist = () => {
  const [selectedMood, setSelectedMood] = useState<Mood>(null);
  const [, setShowMoodSelector] = useState(true);
  const [showChatDialog, setShowChatDialog] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showAIButton, setShowAIButton] = useState(false);
  const [hasSeenChatDialog, setHasSeenChatDialog] = useState(false);
  const [, setIsAnimating] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();

  // Fisher-Yates shuffle algorithm
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    // Initial analyzing animation
    const analyzeTimer = setTimeout(() => {
      setIsAnalyzing(false);
    }, 3000);

    return () => {
      clearTimeout(analyzeTimer);
    };
  }, []);

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
    setShowMoodSelector(false);
    if (mood === "sad" && !hasSeenChatDialog) {
      setShowChatDialog(true);
      setHasSeenChatDialog(true);
    } else if (mood === "sad" && hasSeenChatDialog) {
      // If they've seen the dialog before, just show the AI button
      setShowAIButton(true);
    }
  };

  const handleChangeMood = () => {
    setIsExpanded(true);
    setSelectedMood(null);
  };

  const { data: songs = [], isLoading, error } = useQuery({
    queryKey: ["mood-songs", selectedMood],
    queryFn: async () => {
      if (!selectedMood) return [];
      try {
        const { data } = await axiosInstance.get(`/songs/mood/${selectedMood}`);
        
        // Create a Map to track unique songs by their ID
        const uniqueSongs = new Map<string, boolean>();
        
        const processedSongs = (data as any[])
          .filter((song: any) => {
            const videoId = song.url.split('v=')[1];
            // Basic validation
            if (!videoId || !song.name || !song.primaryArtists) {
              return false;
            }
            
            // Check if we've already seen this song
            if (uniqueSongs.has(song.id)) {
              return false;
            }
            
            // Add to our tracking Map
            uniqueSongs.set(song.id, true);
            return true;
          })
          .map((song: any): Song => ({
            _id: song.id,
            title: song.name.trim(),
            artist: song.primaryArtists.trim(),
            imageUrl: song.image,
            audioUrl: song.url.includes('youtube.com') ? song.url : `https://www.youtube.com/watch?v=${song.url}`,
            albumId: null,
            duration: song.duration ? parseInt(song.duration.split(':')[0]) * 60 + parseInt(song.duration.split(':')[1]) : 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }))
          .filter((song: Song) => {
            // Additional validation for mapped data
            return (
              song.title && 
              song.artist && 
              song.audioUrl && 
              song._id
            );
          });

        const shuffledSongs = shuffleArray(processedSongs);
        return shuffledSongs;
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
        const songIndex = songs.findIndex((s) => s._id === song._id);
        playAlbum(songs.map(s => ({
          ...s,
          albumId: s.albumId || undefined,
          genre: '',
          playedAt: new Date().toISOString(),
          userId: '',
          videoUrl: s.audioUrl // Add videoUrl field to match Song type
        })), songIndex);
      }
    } catch (error) {
      console.error('Error playing song:', error);
      toast.error("Unable to play this song. Please try another.");
    }
  };

  return (
    <div className="relative w-full h-full">
      <div className="flex flex-col h-full bg-gradient-to-b from-background/80 to-background">
        <div className="relative p-2 md:p-8 h-[calc(100vh-64px)]">
          <AnimatePresence mode="wait">
            {isAnalyzing ? (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center gap-6"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360] 
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative"
                >
                  <Sparkles className="h-16 w-16 text-primary" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-center"
                >
                  <h2 className="text-2xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
                    Analyzing Your Mood
                  </h2>
                  <p className="text-muted-foreground">
                    Finding the perfect playlist for your current vibe...
                  </p>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={cn(
                  "grid h-full transition-all duration-500 gap-2 md:gap-8",
                  selectedMood ? "md:grid-cols-[380px,1fr] grid-cols-1" : "grid-cols-1"
                )}
              >
                {/* Mood Selection Container */}
                <div className={cn(
                  "transition-all duration-500",
                  isExpanded ? "max-w-4xl mx-auto w-full" : "w-full",
                  selectedMood && "h-fit"
                )}>
                  <motion.div 
                    className="flex items-center gap-2 md:gap-4 mb-3 md:mb-8 bg-background/80 backdrop-blur-md p-2 md:p-4 relative"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {selectedMood && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleChangeMood}
                        className="absolute left-2 md:left-4 rounded-full hover:bg-accent/50 h-8 w-8 md:h-10 md:w-10 hidden md:flex"
                      >
                        <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
                      </Button>
                    )}
                    <div className="flex items-center justify-between w-full">
                      <div className="flex-1 flex justify-center">
                        <h2 className={cn(
                          "font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50 text-center",
                          !isExpanded ? "text-lg md:text-2xl" : "text-xl md:text-4xl lg:text-5xl",
                          selectedMood ? "md:ml-16" : ""
                        )}>
                          {selectedMood ? "Your Mood Playlist" : "How are you feeling today?"}
                        </h2>
                      </div>
                      {showAIButton && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="ml-2 md:ml-4"
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowChat(true)}
                            className="rounded-full hover:bg-accent/50 h-8 w-8 md:h-10 md:w-10 relative group"
                          >
                            <MessageSquare className="h-4 w-4 md:h-5 md:w-5" />
                            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-background border px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                              Talk to AI Assistant
                            </span>
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>

                  <div className={cn(
                    "grid gap-2 md:gap-6 px-2",
                    isExpanded ? "grid-cols-2 md:grid-cols-2" : "grid-cols-1",
                    selectedMood && "md:max-h-[calc(100vh-250px)]"
                  )}>
                    {moods.map((mood, index) => {
                      const Icon = mood.icon;
                      const isSelected = selectedMood === mood.id;
                      return (
                        <motion.div
                          key={mood.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                            delay: 0.5 + (index * 0.1),
                            duration: 0.3
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <button
                            onClick={() => handleMoodSelect(mood.id as Mood)}
                            className={cn(
                              "w-full text-left",
                              "rounded-lg md:rounded-2xl p-3 md:p-6",
                              "transition-all duration-300",
                              "bg-gradient-to-br",
                              mood.color,
                              "hover:shadow-xl hover:shadow-accent/20",
                              "group relative overflow-hidden",
                              isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                              !isExpanded && "p-2 md:p-4"
                            )}
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-transparent opacity-20" />
                            <div className="relative z-10">
                              <div className={cn(
                                "rounded-full flex items-center justify-center",
                                "bg-white/10 backdrop-blur-sm",
                                "transition-transform duration-300",
                                "group-hover:scale-110",
                                isExpanded ? "w-8 h-8 md:w-12 md:h-12 mb-2 md:mb-4" : "w-6 h-6 md:w-10 md:h-10 mb-1.5 md:mb-3"
                              )}>
                                <Icon className={cn(
                                  "text-white",
                                  isExpanded ? "h-4 w-4 md:h-6 md:w-6" : "h-3 w-3 md:h-5 md:w-5"
                                )} />
                              </div>
                              <h3 className={cn(
                                "font-semibold text-white",
                                isExpanded ? "text-base md:text-2xl mb-0.5 md:mb-2" : "text-sm md:text-lg mb-0.5"
                              )}>
                                {mood.label}
                              </h3>
                              {isExpanded && (
                                <p className="text-white/80 text-xs md:text-sm line-clamp-2 hidden md:block">
                                  {mood.description}
                                </p>
                              )}
                            </div>
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Songs List */}
                {selectedMood && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-accent/20 rounded-xl md:rounded-2xl backdrop-blur-sm flex flex-col h-[calc(100vh-100px)] md:h-full overflow-hidden"
                  >
                    <div className="flex items-center justify-between p-4 md:p-6 bg-background/80 backdrop-blur-md sticky top-0 z-10">
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold mb-1">
                          {selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)} Playlist
                        </h3>
                        <p className="text-sm md:text-base text-muted-foreground">
                          {songs?.length || 0} curated songs for your mood
                        </p>
                      </div>
                    </div>

                    <ScrollArea className="flex-1">
                      <div className="p-4 md:p-6 space-y-2">
                        {isLoading ? (
                          <div className="flex flex-col items-center justify-center py-12 gap-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-muted-foreground">Loading your mood playlist...</p>
                          </div>
                        ) : error ? (
                          <div className="text-center py-12 space-y-2">
                            <Frown className="h-12 w-12 mx-auto text-muted-foreground" />
                            <p className="text-muted-foreground">Failed to load songs. Please try again.</p>
                          </div>
                        ) : songs.length === 0 ? (
                          <div className="text-center py-12 space-y-2">
                            <Music className="h-12 w-12 mx-auto text-muted-foreground" />
                            <p className="text-muted-foreground">No songs found for this mood.</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {songs.map((song: Song, index: number) => (
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ 
                                  opacity: 1, 
                                  y: 0,
                                  transition: { delay: index * 0.05 }
                                }}
                                key={song._id}
                                className={cn(
                                  "flex items-center gap-3 md:gap-4 p-2 md:p-3 rounded-lg md:rounded-xl",
                                  "hover:bg-white/5 transition-colors group",
                                  "border border-transparent hover:border-accent",
                                  currentSong?._id === song._id && "bg-accent/30 border-accent"
                                )}
                              >
                                <div 
                                  className="relative w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden cursor-pointer group"
                                  onClick={() => handlePlayPause(song)}
                                >
                                  {song.imageUrl ? (
                                    <img
                                      src={song.imageUrl}
                                      alt={song.title}
                                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-accent">
                                      <Music className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground" />
                                    </div>
                                  )}
                                  <div className={cn(
                                    "absolute inset-0 bg-black/60",
                                    "flex items-center justify-center",
                                    "transition-opacity",
                                    currentSong?._id === song._id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                  )}>
                                    {currentSong?._id === song._id && isPlaying ? (
                                      <Pause className="h-4 w-4 md:h-5 md:w-5 text-white" />
                                    ) : (
                                      <Play className="h-4 w-4 md:h-5 md:w-5 text-white" />
                                    )}
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={cn(
                                    "font-medium truncate text-sm md:text-base",
                                    currentSong?._id === song._id && "text-primary"
                                  )}>
                                    {song.title}
                                  </p>
                                  <p className="text-xs md:text-sm text-muted-foreground truncate">
                                    {song.artist}
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={cn(
                                    "h-7 w-7 md:h-8 md:w-8 rounded-full",
                                    "opacity-0 group-hover:opacity-100 transition-opacity"
                                  )}
                                >
                                  <ListMusic className="h-3 w-3 md:h-4 md:w-4" />
                                </Button>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Dialog open={showChatDialog} onOpenChange={setShowChatDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Would you like to talk about why you're feeling this way?</DialogTitle>
            <DialogDescription>
              Vent to us instead of venting to a human who isn't as smart as us. xD
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowChatDialog(false);
                setShowAIButton(true);
              }}
            >
              Not now
            </Button>
            <Button
              onClick={() => {
                setShowChat(true);
                setShowChatDialog(false);
                setShowAIButton(true);
              }}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Talk to AI Assistant
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {showChat && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
        >
          <div className="container flex items-center justify-center h-full max-w-4xl mx-auto p-4">
            <div className="relative w-full bg-background rounded-lg shadow-lg">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">AI Therapy Assistant</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowChat(false)}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </div>
              <div className="p-4">
                <TherapyAIChat />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MoodPlaylist; 