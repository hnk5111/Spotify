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
		const page = parseInt(req.query.page) || 1;
		const limit = 20;

		const totalMessages = await Message.countDocuments({
			$or: [
				{ senderId: userId, receiverId: myId },
				{ senderId: myId, receiverId: userId },
			],
		});

		const messages = await Message.find({
			$or: [
				{ senderId: userId, receiverId: myId },
				{ senderId: myId, receiverId: userId },
			],
		})
			.sort({ createdAt: -1 })
			.skip((page - 1) * limit)
			.limit(limit)
			.lean();

		const hasNextPage = totalMessages > page * limit;

		res.status(200).json({
			messages: messages.reverse(),
			nextPage: hasNextPage ? page + 1 : undefined,
			totalPages: Math.ceil(totalMessages / limit),
		});
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

export const updateUserProfile = async (req, res, next) => {
	try {
		const { clerkId } = req.params;
		const { fullName, username, bio, imageUrl, email } = req.body;

		const user = await User.findOne({ clerkId });
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Update user fields
		if (fullName) user.fullName = fullName;
		if (username) user.username = username;
		if (bio !== undefined) user.bio = bio;
		if (imageUrl) user.imageUrl = imageUrl;
		if (email) user.email = email;

		await user.save();

		res.status(200).json({
			message: "Profile updated successfully",
			user
		});
	} catch (error) {
		next(error);
	}
};

export const getUserProfile = async (req, res, next) => {
	try {
		const { userId } = req.params;
		const user = await User.findOne({ clerkId: userId }).select('clerkId fullName username imageUrl bio email');
		
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.status(200).json(user);
	} catch (error) {
		next(error);
	}
};

export const updateProfile = async (req, res, next) => {
	try {
		const userId = req.auth.userId;
		const { fullName, username, bio } = req.body;

		const user = await User.findOneAndUpdate(
			{ clerkId: userId },
			{ fullName, username, bio },
			{ new: true }
		);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.status(200).json(user);
	} catch (error) {
		next(error);
	}
};
