const SectionGridSkeleton = () => {
  return (
    <div className="mb-8">
      <div className="h-8 w-48 bg-secondary/60 rounded-lg mb-4 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-card/50 p-4 rounded-lg animate-pulse
								 border border-border/50 shadow-sm"
          >
            <div className="aspect-square rounded-lg bg-secondary/60 mb-4 shadow-sm" />
            <div className="h-4 bg-secondary/60 rounded-lg w-3/4 mb-2" />
            <div className="h-4 bg-secondary/60 rounded-lg w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
};
export default SectionGridSkeleton;
