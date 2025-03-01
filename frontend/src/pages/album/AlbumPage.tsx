import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import {
  Clock,
  Heart,
  Pause,
  Play,
  MoreVertical,
  Download,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Song } from "@/types";
import { toast } from "react-hot-toast";

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const AlbumPage = () => {
  const { albumId } = useParams();
  const { fetchAlbumById, currentAlbum, isLoading, toggleLike } =
    useMusicStore();
  const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  useEffect(() => {
    if (albumId) fetchAlbumById(albumId);
  }, [fetchAlbumById, albumId]);

  if (isLoading || !currentAlbum)
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white"></div>
      </div>
    );

  const handlePlayAlbum = () => {
    if (!currentAlbum) return;

    const isCurrentAlbumPlaying = currentAlbum?.songs.some(
      (song) => song._id === currentSong?._id
    );
    if (isCurrentAlbumPlaying) togglePlay();
    else {
      // start playing the album from the beginning
      playAlbum(currentAlbum?.songs, 0);
    }
  };

  const handlePlaySong = (index: number) => {
    if (!currentAlbum) return;

    playAlbum(currentAlbum?.songs, index);
  };

  const handleDownload = async (song: Song) => {
    if (!song?.audioUrl) return;

    try {
      setIsDownloading(song._id);

      // Use audioUrl for download
      const response = await fetch(song.audioUrl);
      const blob = await response.blob();

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${song.title} - ${song.artist}.mp3`;

      // Trigger download
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Download started!");
    } catch (error) {
      console.error("Error downloading song:", error);
      toast.error("Failed to download song. Please try again.");
    } finally {
      setIsDownloading(null);
    }
  };

  return (
    <div className="h-full">
      <ScrollArea className="h-full rounded-md">
        {/* Main Content */}
        <div className="relative min-h-full">
          {/* Background with gradient overlay */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={currentAlbum?.imageUrl}
              alt={currentAlbum?.title}
              className="w-full h-full object-cover opacity-20 blur-3xl"
            />
            <div
              className="absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/90
							to-zinc-900 pointer-events-none"
              aria-hidden="true"
            />
          </div>

          {/* Content */}
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row p-4 md:p-6 gap-4 md:gap-6 pb-4 md:pb-8">
              {/* Album Cover with shadow and hover effect */}
              <div className="relative group mx-auto md:mx-0">
                <img
                  src={currentAlbum?.imageUrl}
                  alt={currentAlbum?.title}
                  className="w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] md:w-[240px] md:h-[240px] shadow-2xl rounded-lg 
									transition-transform duration-300 group-hover:scale-[1.02] object-cover"
                />
                <div
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 
								transition-opacity duration-300 rounded-lg flex items-center justify-center"
                >
                  <Button
                    onClick={handlePlayAlbum}
                    size="icon"
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-fuchsia-600 to-purple-700 hover:from-fuchsia-500 hover:to-purple-600
										text-white shadow-lg transform scale-90 group-hover:scale-100 transition-all border-none"
                  >
                    {isPlaying &&
                    currentAlbum?.songs.some(
                      (song) => song._id === currentSong?._id
                    ) ? (
                      <Pause className="h-6 w-6 md:h-7 md:w-7" />
                    ) : (
                      <Play className="h-6 w-6 md:h-7 md:w-7 ml-1" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex flex-col justify-end text-center md:text-left mt-4 md:mt-0">
                <p className="text-xs md:text-sm font-medium text-white/70">
                  Album
                </p>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold my-2 md:my-3 lg:my-4 text-white">
                  {currentAlbum?.title}
                </h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs md:text-sm text-zinc-300">
                  <span className="font-medium text-white">
                    {currentAlbum?.artist}
                  </span>
                  <span>• {currentAlbum?.songs.length} songs</span>
                  <span>• {currentAlbum?.releaseYear}</span>
                </div>
              </div>
            </div>

            {/* Play button and actions */}
            <div className="px-4 md:px-6 pb-4 md:pb-6 flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4">
              <Button
                onClick={handlePlayAlbum}
                className="rounded-full px-6 md:px-8 py-5 md:py-6 bg-gradient-to-r from-fuchsia-600 to-purple-700 hover:from-fuchsia-500 hover:to-purple-600
                border-none shadow-md hover:shadow-lg hover:scale-[1.02] transition-all text-white text-sm md:text-base font-medium"
              >
                {isPlaying &&
                currentAlbum?.songs.some(
                  (song) => song._id === currentSong?._id
                ) ? (
                  <>
                    <Pause className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 md:h-5 md:w-5 mr-2 ml-1" />
                    Play
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                className="rounded-full px-4 md:px-6 py-5 md:py-6 border border-white/20 bg-black/20 hover:bg-white/10
                text-white text-sm md:text-base font-medium transition-all hover:scale-[1.02]"
                onClick={() => {
                  if (currentAlbum?.songs[0]) {
                    handleDownload(currentAlbum.songs[0]);
                  }
                }}
                disabled={isDownloading !== null}
              >
                <Download
                  className={cn(
                    "h-4 w-4 md:h-5 md:w-5 mr-2",
                    isDownloading && "animate-bounce"
                  )}
                />
                {isDownloading ? "Downloading..." : "Download"}
              </Button>
            </div>

            {/* Table Section */}
            <div className="bg-black/20 backdrop-blur-sm rounded-t-xl">
              {/* table header */}
              <div
                className="grid grid-cols-[16px_4fr_1fr_80px] md:grid-cols-[16px_4fr_2fr_1fr_80px] gap-2 md:gap-4 px-3 md:px-6 py-2 md:py-3 text-xs md:text-sm 
								text-zinc-400 border-b border-white/5"
              >
                <div>#</div>
                <div>Title</div>
                <div className="hidden md:block">Released Date</div>
                <div>
                  <Clock className="h-3 w-3 md:h-4 md:w-4" />
                </div>
                <div></div> {/* Actions column */}
              </div>

              {/* songs list */}
              <div className="px-2 md:px-4">
                <div className="space-y-1 py-2">
                  {currentAlbum?.songs.map((song, index) => {
                    const isCurrentSong = currentSong?._id === song._id;
                    return (
                      <div
                        key={song._id}
                        className={cn(
                          `grid grid-cols-[16px_4fr_1fr_80px] md:grid-cols-[16px_4fr_2fr_1fr_80px] gap-2 md:gap-4 px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm 
													text-zinc-400 hover:bg-white/10 rounded-md group cursor-pointer transition-colors`,
                          isCurrentSong && "bg-white/5"
                        )}
                      >
                        <div
                          className="flex items-center justify-center"
                          onClick={() => handlePlaySong(index)}
                        >
                          {isCurrentSong && isPlaying ? (
                            <div className="size-3 md:size-4 text-fuchsia-500 animate-pulse">
                              ♫
                            </div>
                          ) : (
                            <span className="group-hover:hidden">
                              {index + 1}
                            </span>
                          )}
                          {!isCurrentSong && (
                            <Play className="h-3 w-3 md:h-4 md:w-4 hidden group-hover:block text-white" />
                          )}
                        </div>

                        <div
                          className="flex items-center gap-2 md:gap-3"
                          onClick={() => handlePlaySong(index)}
                        >
                          <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-md overflow-hidden">
                            <img
                              src={song.imageUrl}
                              alt={song.title}
                              className="w-full h-full object-cover"
                            />
                            {isCurrentSong && isPlaying && (
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full animate-ping"></div>
                              </div>
                            )}
                          </div>

                          <div>
                            <div
                              className={cn(
                                `font-medium truncate max-w-[120px] sm:max-w-[180px] md:max-w-[300px]`,
                                isCurrentSong
                                  ? "text-fuchsia-500"
                                  : "text-white"
                              )}
                            >
                              {song.title}
                            </div>
                            <div className="truncate max-w-[120px] sm:max-w-[180px] md:max-w-[300px]">
                              {song.artist}
                            </div>
                          </div>
                        </div>

                        <div
                          className="hidden md:flex items-center"
                          onClick={() => handlePlaySong(index)}
                        >
                          {song.createdAt.split("T")[0]}
                        </div>

                        <div
                          className="flex items-center"
                          onClick={() => handlePlaySong(index)}
                        >
                          {formatDuration(song.duration)}
                        </div>

                        <div className="flex items-center justify-end gap-1 md:gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 md:h-8 md:w-8 opacity-0 group-hover:opacity-100 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLike(song._id);
                            }}
                          >
                            <Heart
                              className={cn(
                                "h-3 w-3 md:h-4 md:w-4",
                                song.isLiked &&
                                  "fill-fuchsia-500 text-fuchsia-500"
                              )}
                            />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 md:h-8 md:w-8 opacity-0 group-hover:opacity-100 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(song);
                            }}
                            disabled={isDownloading === song._id}
                          >
                            <Download
                              className={cn(
                                "h-3 w-3 md:h-4 md:w-4",
                                isDownloading === song._id && "animate-bounce"
                              )}
                            />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 md:h-8 md:w-8 opacity-0 group-hover:opacity-100 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all"
                          >
                            <MoreVertical className="h-3 w-3 md:h-4 md:w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Album info footer */}
              <div className="px-4 md:px-6 py-6 md:py-8 text-xs md:text-sm text-zinc-400">
                <p>Released: {currentAlbum?.releaseYear}</p>
                <p className="mt-1">© {currentAlbum?.artist}</p>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
export default AlbumPage;
