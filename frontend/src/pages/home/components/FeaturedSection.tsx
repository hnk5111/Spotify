import { useMusicStore } from "@/stores/useMusicStore";
import FeaturedGridSkeleton from "@/components/skeletons/FeaturedGridSkeleton";
import PlayButton from "./PlayButton";
import { motion } from "framer-motion";

const FeaturedSection = () => {
  const { isLoading, featuredSongs, error } = useMusicStore();

  if (isLoading) return <FeaturedGridSkeleton />;

  if (error) return <p className="text-destructive mb-4 text-lg">{error}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {featuredSongs.map((song, index) => (
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
          className="flex items-center bg-card/50 rounded-md overflow-hidden
                   hover:bg-secondary/50 transition-all duration-200 group cursor-pointer relative
                   border border-border/50 shadow-sm hover:shadow-md"
        >
          <img
            src={song.imageUrl}
            alt={song.title}
            className="w-16 sm:w-20 h-16 sm:h-20 object-cover flex-shrink-0"
          />
          <div className="flex-1 p-4">
            <p className="font-medium truncate text-foreground">{song.title}</p>
            <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
          </div>
          <PlayButton song={song} />
        </motion.div>
      ))}
    </div>
  );
};
export default FeaturedSection;
