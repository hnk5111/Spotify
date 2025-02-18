import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player/youtube";

const AudioPlayer = () => {
	const playerRef = useRef<ReactPlayer>(null);
	const audioRef = useRef<HTMLAudioElement>(null);
	const { currentSong, isPlaying, playNext, togglePlay } = usePlayerStore();
	const [, setProgress] = useState(0);
	const [, setDuration] = useState(0);
	
	useEffect(() => {
		if (!currentSong) return;
		
		// Reset states when song changes
		setProgress(0);
		setDuration(0);
		
		// Reset audio/video when song changes
		if (audioRef.current) {
			audioRef.current.currentTime = 0;
		}
		if (playerRef.current) {
			playerRef.current.seekTo(0);
		}

		// Expose player instance for external control
		if (currentSong.audioUrl?.includes('youtube.com') || currentSong.audioUrl?.includes('youtu.be')) {
			(window as any).player = playerRef.current?.getInternalPlayer();
		} else {
			(window as any).player = null;
		}
	}, [currentSong]);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio || !currentSong) return;

		// Only handle audio element if not a YouTube source
		if (currentSong.audioUrl?.includes('youtube.com') || currentSong.audioUrl?.includes('youtu.be')) {
			return;
		}

		// Update play/pause state
		if (isPlaying) {
			const playPromise = audio.play();
			if (playPromise !== undefined) {
				playPromise.catch(error => {
					console.error('Error playing audio:', error);
					togglePlay();
				});
			}
		} else {
			audio.pause();
		}

		// Event listeners for audio element
		const handleTimeUpdate = () => {
			setProgress(audio.currentTime);
		};

		const handleDurationChange = () => {
			setDuration(audio.duration);
		};

		const handleEnded = () => {
			playNext();
		};

		audio.addEventListener('timeupdate', handleTimeUpdate);
		audio.addEventListener('durationchange', handleDurationChange);
		audio.addEventListener('ended', handleEnded);

		return () => {
			audio.removeEventListener('timeupdate', handleTimeUpdate);
			audio.removeEventListener('durationchange', handleDurationChange);
			audio.removeEventListener('ended', handleEnded);
		};
	}, [isPlaying, playNext, togglePlay, currentSong]);

	// Handle YouTube progress
	const handleYouTubeProgress = (state: { played: number; playedSeconds: number }) => {
		setProgress(state.playedSeconds);
	};

	const handleYouTubeDuration = (duration: number) => {
		setDuration(duration);
	};

	const handleYouTubeReady = () => {
		// Update the window.player reference when YouTube player is ready
		if (playerRef.current) {
			(window as any).player = playerRef.current.getInternalPlayer();
		}
	};

	if (!currentSong) return null;

	// Check if the source is a YouTube URL
	const isYouTubeSource = currentSong.audioUrl?.includes('youtube.com') || currentSong.audioUrl?.includes('youtu.be');

	if (isYouTubeSource) {
		return (
			<ReactPlayer
				ref={playerRef}
				url={currentSong.audioUrl}
				playing={isPlaying}
				width="0"
				height="0"
				style={{ display: 'none' }}
				onEnded={playNext}
				onProgress={handleYouTubeProgress}
				onDuration={handleYouTubeDuration}
				onReady={handleYouTubeReady}
				controls={false}
				config={{
					playerVars: {
						autoplay: 1,
						controls: 0,
						disablekb: 1,
						fs: 0,
						modestbranding: 1,
						iv_load_policy: 3,
						rel: 0
					}
				}}
			/>
		);
	}

	// For non-YouTube sources (Local/Saavn)
	return (
		<audio
			ref={audioRef}
			src={currentSong.audioUrl}
			preload="auto"
			onError={(e) => {
				console.error('Audio playback error:', e);
				togglePlay();
			}}
		/>
	);
};

export default AudioPlayer;
