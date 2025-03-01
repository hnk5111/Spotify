import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Music2, Heart, Play, Calendar } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from "@clerk/clerk-react";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useMusicStore } from "@/stores/useMusicStore";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface DashboardStats {
  hoursListened: number;
  favoriteSongs: number;
  dailyStreak: number;
}

const DashboardPage = () => {
  const { user } = useUser();
  const currentSong = usePlayerStore((state) => state.currentSong);
  const playedSongs = usePlayerStore((state) => state.playedSongs);
  const { songs, fetchSongs, fetchLikedSongs, likedSongs } = useMusicStore();
  const [stats, setStats] = useState<DashboardStats>({
    hoursListened: 0,
    favoriteSongs: 0,
    dailyStreak: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Filter songs for the current user
  const userSongs = songs.filter(song => song.userId === user?.id);
  const userPlayedSongs = playedSongs.filter(song => song.userId === user?.id);

  // Calculate user's daily streak
  const calculateDailyStreak = () => {
    try {
      const today = new Date();
      let streak = 0;
      let currentDate = today;

      while (true) {
        const songsPlayedOnDate = userPlayedSongs.filter(song => {
          if (!song.playedAt) return false;
          const playedDate = new Date(song.playedAt);
          return (
            playedDate.getDate() === currentDate.getDate() &&
            playedDate.getMonth() === currentDate.getMonth() &&
            playedDate.getFullYear() === currentDate.getFullYear()
          );
        });

        if (songsPlayedOnDate.length === 0) break;
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      }

      return streak;
    } catch (error) {
      console.error("Error calculating daily streak:", error);
      return 0;
    }
  };

  // Fetch songs initially and set up interval for real-time updates
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchSongs(),
          fetchLikedSongs()
        ]);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();

    // Set up polling interval for real-time updates
    const interval = setInterval(() => {
      fetchData();
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [fetchSongs, fetchLikedSongs]);

  // Update stats whenever relevant data changes
  useEffect(() => {
    if (!user?.id) return; // Don't update stats if user is not logged in

    const updateDashboardData = () => {
      try {
        // Calculate total played duration with error handling
        const totalPlayedDuration = userPlayedSongs.reduce(
          (acc, song) => acc + (song.duration || 0),
          0
        );
        const hoursListened = Math.round((totalPlayedDuration / 3600) * 10) / 10;

        // Update stats with safe values
        setStats({
          hoursListened: hoursListened || 0,
          favoriteSongs: likedSongs.length || 0,
          dailyStreak: calculateDailyStreak(),
        });
      } catch (error) {
        console.error("Error updating dashboard data:", error);
        // Set safe default values on error
        setStats({
          hoursListened: 0,
          favoriteSongs: 0,
          dailyStreak: 0,
        });
      }
    };

    updateDashboardData();
  }, [user?.id, userPlayedSongs, userSongs, likedSongs.length]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-foreground">Loading your dashboard...</div>
      </div>
    );
  }

  // Handle no user state
  if (!user?.id) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="text-foreground text-xl">Please sign in to view your dashboard</div>
        <Button onClick={() => window.location.href = '/auth'}>Sign In</Button>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4">
          <div className="text-center sm:text-left w-full sm:w-auto">
            <h1 className="text-3xl font-bold text-foreground">Your Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back, {user?.fullName}</p>
          </div>
          <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{stats.dailyStreak} Day Streak!</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Hours Listened</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.hoursListened}h</div>
              <Progress value={Math.min((stats.hoursListened / 24) * 100, 100)} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Daily Streak</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.dailyStreak} days</div>
              <Progress value={Math.min((stats.dailyStreak / 7) * 100, 100)} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Favorite Songs</CardTitle>
              <Heart className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.favoriteSongs}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round((stats.favoriteSongs / userSongs.length) * 100)}% of your library
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recently Played */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-xl">Recently Played</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userPlayedSongs.slice(-5).reverse().map((song) => (
                  <div
                    key={song._id}
                    className="flex items-center gap-4 p-2 rounded-lg hover:bg-secondary/80 transition-colors cursor-pointer"
                    onClick={() => usePlayerStore.getState().setCurrentSong(song)}
                  >
                    <img
                      src={song.imageUrl}
                      alt={song.title}
                      className="h-12 w-12 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{song.title}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {song.artist}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDuration(song.duration)}
                    </div>
                  </div>
                ))}
                {userPlayedSongs.length === 0 && (
                  <div className="text-muted-foreground text-center py-4">
                    No songs played yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Liked Songs */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Liked Songs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {likedSongs.slice(0, 5).map((song) => (
                  <div
                    key={song._id}
                    className="flex items-center gap-4 p-2 rounded-lg hover:bg-secondary/80 transition-colors cursor-pointer group"
                    onClick={() => usePlayerStore.getState().setCurrentSong(song)}
                  >
                    <div className="relative">
                      <img
                        src={song.imageUrl}
                        alt={song.title}
                        className="h-12 w-12 rounded object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Play className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{song.title}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {song.artist}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-muted-foreground">
                        {formatDuration(song.duration)}
                      </div>
                      <Heart 
                        className="h-4 w-4 text-primary fill-primary" 
                        onClick={(e) => {
                          e.stopPropagation();
                          useMusicStore.getState().toggleLike(song._id);
                        }}
                      />
                    </div>
                  </div>
                ))}
                {likedSongs.length === 0 && (
                  <div className="text-muted-foreground text-center py-4">
                    No liked songs yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Currently Playing */}
        {currentSong && (
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-xl">Now Playing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-2">
                {currentSong.imageUrl && (
                  <img
                    src={currentSong.imageUrl}
                    alt={currentSong.title}
                    className="h-16 w-16 rounded object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="text-lg font-medium">{currentSong.title}</p>
                  <p className="text-muted-foreground">{currentSong.artist}</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDuration(currentSong.duration || 0)}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ScrollArea>
  );
};

export default DashboardPage; 