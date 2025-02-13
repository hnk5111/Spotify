import { Server } from "socket.io";
import { Message } from "../models/message.model.js";
import { Notification } from "../models/notification.model.js";
import { User } from "../models/user.model.js";
import { FriendRequest } from "../models/friendRequest.model.js";

const userSockets = new Map();

export const initializeSocket = (server) => {
	const io = new Server(server, {
		cors: {
			origin: "http://localhost:3000",
			methods: ["GET", "POST"],
			credentials: true,
			allowedHeaders: ["Content-Type", "Authorization"],
		},
	});

	const userActivities = new Map(); // {userId: activity}

	io.use(async (socket, next) => {
		const userId = socket.handshake.auth.userId;
		if (!userId) {
			return next(new Error("Authentication error"));
		}
		
		try {
			const user = await User.findOne({ clerkId: userId });
			if (!user) {
				return next(new Error("User not found"));
			}
			socket.user = user;
			next();
		} catch (error) {
			next(error);
		}
	});

	io.on("connection", (socket) => {
		const userId = socket.user.clerkId;
		userSockets.set(userId, socket.id);
		userActivities.set(userId, "Online");

		// broadcast to all connected sockets that this user just logged in
		io.emit("user_connected", userId);

		io.emit("users_online", Array.from(userSockets.keys()));

		io.emit("activities", Array.from(userActivities.entries()));

		socket.on("update_activity", ({ userId, activity }) => {
			console.log("activity updated", userId, activity);
			userActivities.set(userId, activity);
			io.emit("activity_updated", { userId, activity });
		});

		socket.on("sendMessage", async (data) => {
			try {
				const { receiverId, content } = data;
				if (!content.trim()) {
					throw new Error("Message cannot be empty");
				}

				// Add friendship check
				const friendshipStatus = await FriendRequest.findOne({
					$or: [
						{ senderId: socket.user.clerkId, receiverId },
						{ senderId: receiverId, receiverId: socket.user.clerkId }
					],
					status: "accepted"
				});

				if (!friendshipStatus) {
					socket.emit("messageError", { 
						message: "You can only message users who have accepted your friend request" 
					});
					return;
				}

				// Check if receiver exists
				const receiver = await User.findOne({ clerkId: receiverId });
				if (!receiver) {
					throw new Error("Recipient not found");
				}

				const message = await Message.create({
					senderId: socket.user.clerkId,
					receiverId,
					content: content.trim(),
				});

				// Create notification
				await Notification.create({
					userId: receiverId,
					message: `New message from ${socket.user.fullName}`,
					type: 'message',
					metadata: { messageId: message._id }
				});

				// Send to receiver
				const receiverSocketId = userSockets.get(receiverId);
				if (receiverSocketId) {
					io.to(receiverSocketId).emit("receiveMessage", message);
					io.to(receiverSocketId).emit("new_notification");
				}

				// Send back to sender
				socket.emit("receiveMessage", message);
			} catch (error) {
				console.error("Error sending message:", error);
				socket.emit("messageError", { 
					message: error.message || "Failed to send message" 
				});
			}
		});

		socket.on("disconnect", () => {
			userSockets.delete(userId);
			userActivities.delete(userId);
			io.emit("user_disconnected", userId);
		});
	});

	return io;
};
