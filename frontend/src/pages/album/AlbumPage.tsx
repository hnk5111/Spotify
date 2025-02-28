import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Clock, Pause, Play } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export const formatDuration = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const AlbumPage = () => {
	const { albumId } = useParams();
	const { fetchAlbumById, currentAlbum, isLoading } = useMusicStore();
	const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();

	useEffect(() => {
		if (albumId) fetchAlbumById(albumId);
	}, [fetchAlbumById, albumId]);

	if (isLoading) return null;

	const handlePlayAlbum = () => {
		if (!currentAlbum) return;

		const isCurrentAlbumPlaying = currentAlbum?.songs.some((song) => song._id === currentSong?._id);
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

	return (
		<div className='h-full'>
			<ScrollArea className='h-full rounded-md'>
				{/* Main Content */}
				<div className='relative min-h-full'>
					{/* bg gradient */}
					<div
						className='absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background pointer-events-none'
						aria-hidden='true'
					/>

					{/* Content */}
					<div className='relative z-10'>
						<div className='flex flex-col md:flex-row p-4 md:p-6 gap-6 pb-8'>
							<img
								src={currentAlbum?.imageUrl}
								alt={currentAlbum?.title}
								className='w-[200px] md:w-[240px] h-[200px] md:h-[240px] shadow-xl rounded mx-auto md:mx-0'
							/>
							<div className='flex flex-col justify-end text-center md:text-left'>
								<p className='text-sm font-medium text-muted-foreground'>Album</p>
								<h1 className='text-4xl md:text-7xl font-bold my-4 text-foreground'>{currentAlbum?.title}</h1>
								<div className='flex flex-col md:flex-row items-center gap-2 text-sm text-muted-foreground'>
									<span className='font-medium text-foreground'>{currentAlbum?.artist}</span>
									<span className='hidden md:inline'>•</span>
									<span>{currentAlbum?.songs.length} songs</span>
									<span className='hidden md:inline'>•</span>
									<span>{currentAlbum?.releaseYear}</span>
								</div>
							</div>
						</div>

						{/* play button */}
						<div className='px-4 md:px-6 pb-4 flex items-center justify-center md:justify-start gap-6'>
							<Button
								onClick={handlePlayAlbum}
								size='icon'
								className='w-14 h-14 rounded-full bg-primary hover:bg-primary/90 
                hover:scale-105 transition-all shadow-lg'
							>
								{isPlaying && currentAlbum?.songs.some((song) => song._id === currentSong?._id) ? (
									<Pause className='h-7 w-7 text-primary-foreground' />
								) : (
									<Play className='h-7 w-7 text-primary-foreground' />
								)}
							</Button>
						</div>

						{/* Table Section */}
						<div className='bg-card/20 backdrop-blur-sm'>
							{/* table header */}
							<div
								className='grid grid-cols-[16px_1fr_2fr_1fr] md:grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 md:px-10 py-2 text-sm 
                text-muted-foreground border-b border-border'
							>
								<div>#</div>
								<div>Title</div>
								<div className='hidden md:block'>Released Date</div>
								<div>
									<Clock className='h-4 w-4' />
								</div>
							</div>

							{/* songs list */}
							<div className='px-2 md:px-6'>
								<div className='space-y-2 py-4'>
									{currentAlbum?.songs.map((song, index) => {
										const isCurrentSong = currentSong?._id === song._id;
										return (
											<div
												key={song._id}
												onClick={() => handlePlaySong(index)}
												className={`grid grid-cols-[16px_1fr_2fr_1fr] md:grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm 
                          text-muted-foreground hover:bg-secondary/20 rounded-md group cursor-pointer
                          ${isCurrentSong ? 'bg-secondary/30' : ''}`}
											>
												<div className='flex items-center justify-center'>
													{isCurrentSong && isPlaying ? (
														<div className='size-4 text-primary'>♫</div>
													) : (
														<span className='group-hover:hidden'>{index + 1}</span>
													)}
													{!isCurrentSong && (
														<Play className='h-4 w-4 hidden group-hover:block text-foreground' />
													)}
												</div>

												<div className='flex items-center gap-3 min-w-0'>
													<img src={song.imageUrl} alt={song.title} className='size-10 rounded' />
													<div className='min-w-0'>
														<div className={`font-medium text-foreground truncate`}>{song.title}</div>
														<div className='truncate'>{song.artist}</div>
													</div>
												</div>
												<div className='hidden md:flex items-center'>{song.createdAt.split("T")[0]}</div>
												<div className='flex items-center'>{formatDuration(song.duration)}</div>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					</div>
				</div>
			</ScrollArea>
		</div>
	);
};
export default AlbumPage;
