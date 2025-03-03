import { Song } from "@/types";
import SectionGridSkeleton from "./SectionGridSkeleton";
import { Button } from "@/components/ui/button";
import PlayButton from "./PlayButton";
import { motion } from "framer-motion";

type SectionGridProps = {
  title: string;
  songs: Song[];
  isLoading: boolean;
};

const SectionGrid = ({ songs, title, isLoading }: SectionGridProps) => {
  if (isLoading) return <SectionGridSkeleton />;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
          {title}
        </h2>
        <Button
          variant="link"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Show all
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {songs.map((song, index) => (
          <motion.div
            key={song._id}
            initial={{ opacity: 0 }}
            whileInView={{ 
              opacity: 1,
              transition: {
                duration: 0.5,
                delay: window.innerWidth > 768 ? index * 0.1 : 0
              }
            }}
            viewport={{ once: true, amount: 0.3 }}
            className="bg-card/50 p-4 rounded-lg hover:bg-secondary/50 
                     transition-all duration-200 group cursor-pointer
                     border border-border/50 shadow-sm hover:shadow-md"
          >
            <div className="relative mb-4">
              <div className="aspect-square rounded-lg shadow-lg overflow-hidden bg-background">
                <img
                  src={song.imageUrl}
                  alt={song.title}
                  className="w-full h-full object-cover transition-transform duration-300 
                           group-hover:scale-105"
                />
              </div>
              <PlayButton song={song} />
            </div>
            <h3 className="font-medium mb-2 truncate text-foreground">
              {song.title}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {song.artist}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SectionGrid;
