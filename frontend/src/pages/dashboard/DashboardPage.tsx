import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Music2, Heart } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from "@clerk/clerk-react";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useMusicStore } from "@/stores/useMusicStore";

interface DashboardStats {
  hoursListened: number;
  totalSongsPlayed: number;
  favoriteSongs: number;
}

const DashboardPage = () => {
  const { user } = useUser();
  const currentSong = usePlayerStore((state) => state.currentSong);
  const playedSongs = usePlayerStore((state) => state.playedSongs);
  const { songs, fetchSongs } = useMusicStore();
  const [stats, setStats] = useState<DashboardStats>({
    hoursListened: 0,
    totalSongsPlayed: 0,
    favoriteSongs: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const likedSongs = songs.filter(song => song.isLiked === true);

  // Fetch songs initially and set up interval for real-time updates
  useEffect(() => {
    const fetchData = async () => {
      await fetchSongs();
      setIsLoading(false);
    };

    fetchData();

    // Set up interval for real-time updates
    const interval = setInterval(() => {
      fetchSongs();
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [fetchSongs]);

  // Update stats whenever songs or playedSongs change
  useEffect(() => {
    const updateDashboardData = () => {
      try {
        // Calculate real stats based on played songs
        const totalPlayedDuration = playedSongs.reduce((acc, song) => acc + (song.duration || 0), 0);
        const hoursListened = Math.round((totalPlayedDuration / 3600) * 10) / 10; // Convert seconds to hours with 1 decimal

        setStats({
          hoursListened,
          totalSongsPlayed: playedSongs.length,
          favoriteSongs: likedSongs.length,
        });
      } catch (error) {
        console.error("Error updating dashboard data:", error);
      }
    };

    updateDashboardData();
  }, [playedSongs, songs, likedSongs.length]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.fullName}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Hours Listened</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.hoursListened}h</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Songs Played</CardTitle>
              <Music2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSongsPlayed}</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Favorite Songs</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.favoriteSongs}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recently Played */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-xl">Recently Played</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {playedSongs.slice(-5).reverse().map((song) => (
                  <div
                    key={song._id}
                    className="flex items-center gap-4 p-2 rounded-lg hover:bg-secondary/80 transition-colors"
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
                {playedSongs.length === 0 && (
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
                    className="flex items-center gap-4 p-2 rounded-lg hover:bg-secondary/80 transition-colors"
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
                <img
                  src={currentSong.imageUrl}
                  alt={currentSong.title}
                  className="h-16 w-16 rounded object-cover"
                />
                <div className="flex-1">
                  <p className="text-lg font-medium">{currentSong.title}</p>
                  <p className="text-muted-foreground">{currentSong.artist}</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDuration(currentSong.duration)}
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