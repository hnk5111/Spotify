import { Server } from "socket.io";
import { Message } from "../models/message.model.js";
import { Notification } from "../models/notification.model.js";
import { User } from "../models/user.model.js";
import { FriendRequest } from "../models/friendRequest.model.js";

const userSockets = new Map();

export const initializeSocket = (server) => {
	const io = new Server(server, {
		cors: {
			origin: [
				"http://localhost:3000",
				"https://spotify-hdw7.onrender.com",  // Your frontend URL
				process.env.FRONTEND_URL // Add this for flexibility
			],
			methods: ["GET", "POST"],
			credentials: true,
			allowedHeaders: ["Content-Type", "Authorization"],
		},
		// Add these connection settings
		pingTimeout: 60000,
		pingInterval: 25000,
		reconnection: true,
		reconnectionAttempts: 5,
		reconnectionDelay: 1000,
		reconnectionDelayMax: 5000,
		randomizationFactor: 0.5,
		transports: ['websocket', 'polling']
	});

	io.use(async (socket, next) => {
		const userId = socket.handshake.auth.userId;
		if (!userId) {
			return next(new Error("Authentication error"));
		}
		
		try {
			const user = await User.findOne({ clerkId: userId }).select('clerkId fullName');
			if (!user) {
				return next(new Error("User not found"));
			}
			socket.user = user;
			next();
		} catch (error) {
			next(new Error("Authentication failed"));
		}
	});

	io.on("connection", (socket) => {
		const userId = socket.user.clerkId;
		userSockets.set(userId, socket.id);

		// Emit connection status with online users in a single event
		io.emit("user_status_update", {
			userId,
			action: "connected",
			onlineUsers: Array.from(userSockets.keys())
		});

		socket.on("sendMessage", async (data) => {
			try {
				const { receiverId, content } = data;
				const trimmedContent = content?.trim();
				
				if (!trimmedContent) {
					throw new Error("Message cannot be empty");
				}

				// Check friendship status
				const friendshipStatus = await FriendRequest.findOne({
					$or: [
						{ senderId: userId, receiverId },
						{ senderId: receiverId, receiverId: userId }
					],
					status: "accepted"
				});

				if (!friendshipStatus) {
					throw new Error("You can only message users who have accepted your friend request");
				}

				const message = await Message.create({
					senderId: userId,
					receiverId,
					content: trimmedContent,
				});

				// Bundle message and notification for the receiver
				const messagePayload = {
					message,
					notification: {
						userId: receiverId,
						message: `New message from ${socket.user.fullName}`,
						type: 'message',
						messageId: message._id
					}
				};

				// Create notification asynchronously
				Notification.create(messagePayload.notification).catch(console.error);

				// Send to receiver if online
				const receiverSocketId = userSockets.get(receiverId);
				if (receiverSocketId) {
					io.to(receiverSocketId).emit("messageUpdate", messagePayload);
				}

				// Send confirmation to sender
				socket.emit("messageUpdate", { message });

			} catch (error) {
				socket.emit("messageError", { 
					message: error.message || "Failed to send message" 
				});
			}
		});

		socket.on("disconnect", () => {
			userSockets.delete(userId);
			io.emit("user_status_update", {
				userId,
				action: "disconnected",
				onlineUsers: Array.from(userSockets.keys())
			});
		});
	});

	return io;
};
