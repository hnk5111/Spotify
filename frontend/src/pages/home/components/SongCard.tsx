import { usePlayerStore } from "@/stores/usePlayerStore";
import { Play } from "lucide-react";
import { Song } from "@/types";

interface SongCardProps {
  song: Song;
}

const SongCard = ({ song }: SongCardProps) => {
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayerStore();

  const isCurrentSong = currentSong?._id === song._id;

  const handlePlay = () => {
    if (isCurrentSong) {
      togglePlay();
    } else {
      playSong(song);
    }
  };

  return (
    <div className="group relative bg-zinc-800/40 rounded-lg p-4 hover:bg-zinc-800/60 transition-all duration-200">
      <div className="relative aspect-square mb-4">
        <img
          src={song.imageUrl}
          alt={song.title}
          className="w-full h-full object-cover rounded-md"
        />
        <button
          onClick={handlePlay}
          className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-105 hover:bg-green-400"
        >
          <Play className="h-5 w-5 text-black" />
        </button>
      </div>
      <div>
        <h3 className="font-semibold text-white truncate">{song.title}</h3>
        <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
      </div>
    </div>
  );
};

export default SongCard; 