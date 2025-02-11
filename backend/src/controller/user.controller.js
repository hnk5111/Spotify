import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";

export const getAllUsers = async (req, res, next) => {
	try {
		const currentUserId = req.auth.userId;
		const users = await User.find({ clerkId: { $ne: currentUserId } });
		res.status(200).json(users);
	} catch (error) {
		next(error);
	}
};

export const getMessages = async (req, res, next) => {
	try {
		const myId = req.auth.userId;
		const { userId } = req.params;

		const messages = await Message.find({
			$or: [
				{ senderId: userId, receiverId: myId },
				{ senderId: myId, receiverId: userId },
			],
		}).sort({ createdAt: 1 });

		res.status(200).json(messages);
	} catch (error) {
		next(error);
	}
};

export const searchUsers = async (req, res, next) => {
	try {
		const { q } = req.query;
		const currentUserId = req.auth.userId;

		if (!q) {
			return res.status(200).json([]);
		}

		const users = await User.find({
			clerkId: { $ne: currentUserId },
			fullName: { $regex: q, $options: 'i' }
		}).select('clerkId fullName imageUrl');

		res.status(200).json(users);
	} catch (error) {
		console.error("Search users error:", error);
		next(error);
	}
};

export const updateUserProfile = async (req, res) => {
	try {
		const { clerkId } = req.params;
		const { fullName, username, bio, imageUrl } = req.body;

		const user = await User.findOne({ clerkId });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Update user fields
		if (fullName) user.fullName = fullName;
		if (username) user.username = username;
		if (bio !== undefined) user.bio = bio;
		if (imageUrl) user.imageUrl = imageUrl;

		await user.save();

		res.status(200).json({
			message: "Profile updated successfully",
			user
		});
	} catch (error) {
		console.error("Error updating profile:", error);
		res.status(500).json({ error: "Error updating profile" });
	}
};

export const getUserProfile = async (req, res) => {
	try {
		const { clerkId } = req.params;
		const user = await User.findOne({ clerkId });

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		res.status(200).json(user);
	} catch (error) {
		console.error("Error fetching profile:", error);
		res.status(500).json({ error: "Error fetching profile" });
	}
};
