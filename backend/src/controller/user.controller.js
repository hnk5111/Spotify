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
