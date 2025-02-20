import { Server } from "socket.io";
import { Message } from "../models/message.model.js";
import { Notification } from "../models/notification.model.js";
import { User } from "../models/user.model.js";
import { FriendRequest } from "../models/friendRequest.model.js";

const userSockets = new Map();
const isDevelopment = process.env.NODE_ENV !== 'production';

// Define allowed origins for development
const ALLOWED_ORIGINS = isDevelopment 
	? ['http://localhost:3000', 'http://localhost:5173']
	: true; // In production, allow all origins since we're serving frontend from same server

export const initializeSocket = (server) => {
	const io = new Server(server, {
		cors: {
			origin: [
				"http://localhost:3000",
				"https://spotify-hdw7.onrender.com"
			],
			methods: ["GET", "POST", "PUT", "DELETE"],
			credentials: true,
			allowedHeaders: ["Authorization"]
		},
		transports: ["polling"],
		allowEIO3: true,
		pingTimeout: 60000,
		pingInterval: 25000,
		maxHttpBufferSize: 1e8,
		agent: undefined,
		rejectUnauthorized: undefined,
		perMessageDeflate: undefined,
	});

	io.engine.on("connection_error", (err) => {
		console.error("Connection error:", err);
	});

	io.use(async (socket, next) => {
		const userId = socket.handshake.auth.userId;
		if (!userId) {
			return next(new Error("Authentication error: No user ID provided"));
		}
		
		try {
			const user = await User.findOne({ clerkId: userId }).select('clerkId fullName');
			if (!user) {
				return next(new Error("Authentication error: User not found"));
			}
			socket.user = user;
			next();
		} catch (error) {
			console.error("Authentication error:", error);
			next(new Error("Authentication failed: " + error.message));
		}
	});

	io.on("connection", (socket) => {
		const userId = socket.user.clerkId;
		userSockets.set(userId, socket.id);

		console.log(`🟢 User ${userId} connected with socket ${socket.id}`);

		// Emit connection status with online users
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

				// Bundle message and notification
				const messagePayload = {
					message,
					notification: {
						userId: receiverId,
						message: `New message from ${socket.user.fullName}`,
						type: 'message',
						messageId: message._id
					}
				};

				// Create notification
				await Notification.create(messagePayload.notification);

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
			console.log(`🔴 User ${userId} disconnected`);
			
			io.emit("user_status_update", {
				userId,
				action: "disconnected",
				onlineUsers: Array.from(userSockets.keys())
			});
		});
	});

	return io;
};
