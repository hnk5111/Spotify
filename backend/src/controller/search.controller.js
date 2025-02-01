import { Song } from "../models/song.model.js";

export const searchSongs = async (req, res, next) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(200).json([]);
        }

        const songs = await Song.find({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { artist: { $regex: q, $options: 'i' } }
            ]
        }).populate('albumId');

        const formattedSongs = songs.map(song => ({
            id: song._id,
            title: song.title,
            artist: song.artist,
            albumId: song.albumId?._id || null,
            duration: song.duration,
            url: song.audioUrl,
            imageUrl: song.imageUrl
        }));

        res.status(200).json(formattedSongs);
    } catch (error) {
        console.error("Search error:", error);
        next(error);
    }
}; 