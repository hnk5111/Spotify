import { Song } from "../models/song.model.js";
import { getMoodBasedSongs } from '../services/mood.service.js';

export const getAllSongs = async (req, res, next) => {
	try {
		// -1 = Descending => newest -> oldest
		// 1 = Ascending => oldest -> newest
		const songs = await Song.find().select('title artist imageUrl audioUrl duration albumId isLiked createdAt updatedAt').sort({ createdAt: -1 });
		res.json(songs);
	} catch (error) {
		next(error);
	}
};

export const getFeaturedSongs = async (req, res, next) => {
	try {
		// fetch 6 random songs using mongodb's aggregation pipeline
		const songs = await Song.aggregate([
			{
				$sample: { size: 6 },
			},
			{
				$project: {
					_id: 1,
					title: 1,
					artist: 1,
					imageUrl: 1,
					audioUrl: 1,
				},
			},
		]);

		res.json(songs);
	} catch (error) {
		next(error);
	}
};

export const getMadeForYouSongs = async (req, res, next) => {
	try {
		const songs = await Song.aggregate([
			{
				$sample: { size: 4 },
			},
			{
				$project: {
					_id: 1,
					title: 1,
					artist: 1,
					imageUrl: 1,
					audioUrl: 1,
				},
			},
		]);

		res.json(songs);
	} catch (error) {
		next(error);
	}
};

export const getTrendingSongs = async (req, res, next) => {
	try {
		const songs = await Song.aggregate([
			{
				$sample: { size: 4 },
			},
			{
				$project: {
					_id: 1,
					title: 1,
					artist: 1,
					imageUrl: 1,
					audioUrl: 1,
				},
			},
		]);

		res.json(songs);
	} catch (error) {
		next(error);
	}
};

export const getMoodSongs = async (req, res) => {
	try {
		const { mood } = req.params;
		
		if (!['happy', 'sad', 'romantic', 'party'].includes(mood)) {
			return res.status(400).json({ message: 'Invalid mood' });
		}

		const songs = await getMoodBasedSongs(mood);
		res.json(songs);
	} catch (error) {
		console.error('Error in getMoodSongs:', error);
		res.status(500).json({ message: 'Failed to fetch mood-based songs' });
	}
};

export const toggleLike = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.auth?.userId; // Get the user ID from the auth object

		if (!userId) {
			return res.status(401).json({ message: 'Unauthorized - you must be logged in' });
		}

		const song = await Song.findById(id);
		
		if (!song) {
			return res.status(404).json({ message: 'Song not found' });
		}

		// Toggle like status and update userId
		song.isLiked = !song.isLiked;
		song.userId = song.isLiked ? userId : undefined; // Set or remove userId based on like status

		await song.save();

		res.json({
			...song.toJSON(),
			isLiked: song.isLiked,
			userId: song.userId
		});
	} catch (error) {
		console.error('Error in toggleLike:', error);
		res.status(500).json({ message: 'Failed to toggle like status' });
	}
};

export const getLikedSongs = async (req, res) => {
	try {
		const userId = req.auth?.userId;

		if (!userId) {
			return res.status(401).json({ message: 'Unauthorized - you must be logged in' });
		}

		const likedSongs = await Song.find({ 
			isLiked: true,
			userId: userId 
		}).select('title artist imageUrl audioUrl duration isLiked userId');

		res.json(likedSongs);
	} catch (error) {
		console.error('Error in getLikedSongs:', error);
		res.status(500).json({ message: 'Failed to fetch liked songs' });
	}
};
