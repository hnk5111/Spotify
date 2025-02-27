import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Music2, Heart, Plus, ListMusic, Calendar, Headphones, BarChart2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from "@clerk/clerk-react";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

interface DashboardStats {
  hoursListened: number;
  totalSongsPlayed: number;
  favoriteSongs: number;
  dailyStreak: number;
  topGenres: { name: string; count: number }[];
  listeningHistory: { date: string; hours: number }[];
}

const DashboardPage = () => {
  const { user } = useUser();
  const currentSong = usePlayerStore((state) => state.currentSong);
  const playedSongs = usePlayerStore((state) => state.playedSongs);
  const { songs, fetchSongs } = useMusicStore();
  const { playlists, createPlaylist } = usePlaylistStore();
  const [stats, setStats] = useState<DashboardStats>({
    hoursListened: 0,
    totalSongsPlayed: 0,
    favoriteSongs: 0,
    dailyStreak: 0,
    topGenres: [],
    listeningHistory: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter songs for the current user
  const userSongs = songs.filter(song => song.userId === user?.id);
  const likedSongs = userSongs.filter(song => song.isLiked === true);
  const userPlaylists = playlists.filter(playlist => playlist.userId === user?.id);
  const userPlayedSongs = playedSongs.filter(song => song.userId === user?.id);

  // Calculate user's daily streak
  const calculateDailyStreak = () => {
    const today = new Date();
    let streak = 0;
    let currentDate = today;

    while (true) {
      const songsPlayedOnDate = userPlayedSongs.filter(song => {
        const playedDate = new Date(song.playedAt || '');
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
  };

  // Calculate top genres
  const calculateTopGenres = () => {
    const genreCounts: { [key: string]: number } = {};
    userPlayedSongs.forEach(song => {
      if (song.genre) {
        genreCounts[song.genre] = (genreCounts[song.genre] || 0) + 1;
      }
    });

    return Object.entries(genreCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  };

  // Calculate listening history for the last 7 days
  const calculateListeningHistory = () => {
    const history: { date: string; hours: number }[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const songsPlayedOnDate = userPlayedSongs.filter(song => {
        const playedDate = new Date(song.playedAt || '');
        return (
          playedDate.getDate() === date.getDate() &&
          playedDate.getMonth() === date.getMonth() &&
          playedDate.getFullYear() === date.getFullYear()
        );
      });

      const hoursListened = songsPlayedOnDate.reduce(
        (acc, song) => acc + (song.duration || 0) / 3600,
        0
      );

      history.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        hours: Math.round(hoursListened * 10) / 10,
      });
    }

    return history;
  };

  // Fetch songs initially and set up interval for real-time updates
  useEffect(() => {
    const fetchData = async () => {
      await fetchSongs();
      setIsLoading(false);
    };

    fetchData();

    const interval = setInterval(() => {
      fetchSongs();
    }, 2000);

    return () => clearInterval(interval);
  }, [fetchSongs]);

  // Update stats whenever relevant data changes
  useEffect(() => {
    const updateDashboardData = () => {
      try {
        const totalPlayedDuration = userPlayedSongs.reduce(
          (acc, song) => acc + (song.duration || 0),
          0
        );
        const hoursListened = Math.round((totalPlayedDuration / 3600) * 10) / 10;

        setStats({
          hoursListened,
          totalSongsPlayed: userPlayedSongs.length,
          favoriteSongs: likedSongs.length,
          dailyStreak: calculateDailyStreak(),
          topGenres: calculateTopGenres(),
          listeningHistory: calculateListeningHistory(),
        });
      } catch (error) {
        console.error("Error updating dashboard data:", error);
      }
    };

    updateDashboardData();
  }, [userPlayedSongs, userSongs, likedSongs.length]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim() && user?.id) {
      createPlaylist(newPlaylistName.trim(), user.id);
      setNewPlaylistName("");
      setIsDialogOpen(false);
    }
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
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Your Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back, {user?.fullName}</p>
          </div>
          <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{stats.dailyStreak} Day Streak!</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <CardTitle className="text-sm font-medium">Songs Played</CardTitle>
              <Music2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSongsPlayed}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round((stats.totalSongsPlayed / userSongs.length) * 100)}% of your library
              </p>
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

          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Daily Activity</CardTitle>
              <Headphones className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1">
                {stats.listeningHistory.map((day, _index) => (
                  <div
                    key={day.date}
                    className="flex-1 flex flex-col items-center gap-1"
                    title={`${day.hours}h on ${day.date}`}
                  >
                    <div className="w-full bg-secondary/30 rounded-sm overflow-hidden">
                      <div
                        className="bg-primary/50 h-12 transition-all"
                        style={{
                          height: `${Math.min((day.hours / 24) * 48, 48)}px`,
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {day.date}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Genres */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-primary" />
              Your Top Genres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topGenres.map((genre) => (
                <div key={genre.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium capitalize">{genre.name}</span>
                    <span className="text-muted-foreground">
                      {Math.round((genre.count / userPlayedSongs.length) * 100)}%
                    </span>
                  </div>
                  <Progress
                    value={(genre.count / userPlayedSongs.length) * 100}
                    className="h-2"
                  />
                </div>
              ))}
              {stats.topGenres.length === 0 && (
                <div className="text-muted-foreground text-center py-4">
                  No genre data available yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>

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
                {likedSongs.length === 0 && (
                  <div className="text-muted-foreground text-center py-4">
                    No liked songs yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Playlists Section */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <ListMusic className="h-5 w-5 text-primary" />
              Your Playlists
            </CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Playlist
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Playlist</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="playlist-name">Playlist Name</Label>
                    <Input
                      id="playlist-name"
                      placeholder="Enter playlist name"
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleCreatePlaylist} className="w-full">
                    Create Playlist
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userPlaylists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="flex items-center gap-4 p-2 rounded-lg hover:bg-secondary/80 transition-colors cursor-pointer"
                  onClick={() => {
                    if (playlist.songs.length > 0) {
                      usePlayerStore.getState().playAlbum(playlist.songs);
                    }
                  }}
                >
                  <div className="h-12 w-12 rounded bg-secondary flex items-center justify-center">
                    <ListMusic className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{playlist.name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {playlist.songs.length} songs
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(playlist.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {userPlaylists.length === 0 && (
                <div className="text-muted-foreground text-center py-4">
                  No playlists created yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Currently Playing */}
        {currentSong && currentSong.userId === user?.id && (
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