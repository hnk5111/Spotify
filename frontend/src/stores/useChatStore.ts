import { axiosInstance } from "@/lib/axios";
import { Message, User } from "@/types";
import { create } from "zustand";
import { io } from "socket.io-client";
import { useNotificationStore } from "./useNotificationStore";

interface ChatStore {
	users: User[];
	isLoading: boolean;
	error: string | null;
	socket: any;
	isConnected: boolean;
	onlineUsers: Set<string>;
	userActivities: Map<string, string>;
	messages: Message[];
	selectedUser: User | null;

	fetchUsers: () => Promise<void>;
	initSocket: (userId: string) => void;
	disconnectSocket: () => void;
	sendMessage: (receiverId: string, content: string) => void;
	fetchMessages: (userId: string) => Promise<void>;
	setSelectedUser: (user: User | null) => void;
}

const baseURL = import.meta.env.MODE === "development" 
	? "http://localhost:5000" 
	: "https://spotify-backend-3idi.onrender.com";  // Replace with your actual backend URL

const socket = io(baseURL, {
	autoConnect: false,
	withCredentials: true,
	transports: ['websocket', 'polling'],  // Add fallback to polling if websocket fails
	reconnection: true,
	reconnectionAttempts: 5,
	reconnectionDelay: 1000,
});

// Add error handling for socket connection
socket.on('connect_error', (error) => {
	console.error('Socket connection error:', error);
});

export const useChatStore = create<ChatStore>((set, get) => ({
	users: [],
	isLoading: false,
	error: null,
	socket: socket,
	isConnected: false,
	onlineUsers: new Set(),
	userActivities: new Map(),
	messages: [],
	selectedUser: null,

	setSelectedUser: (user) => set({ selectedUser: user }),

	fetchUsers: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/users");
			set({ users: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	initSocket: (userId) => {
		if (!get().isConnected) {
			socket.auth = { userId };
			socket.connect();

			socket.emit("user_connected", userId);

			socket.on("users_online", (users: string[]) => {
				set({ onlineUsers: new Set(users) });
			});

			socket.on("activities", (activities: [string, string][]) => {
				set({ userActivities: new Map(activities) });
			});

			socket.on("user_connected", (userId: string) => {
				set((state) => ({
					onlineUsers: new Set([...state.onlineUsers, userId]),
				}));
			});

			socket.on("user_disconnected", (userId: string) => {
				set((state) => {
					const newOnlineUsers = new Set(state.onlineUsers);
					newOnlineUsers.delete(userId);
					return { onlineUsers: newOnlineUsers };
				});
			});

			socket.on("messageUpdate", (data: { message: Message, notification?: any }) => {
				set((state) => ({
					messages: [...state.messages, data.message],
				}));

				// Add notification if message is from someone other than selected user
				if (data.message.senderId !== get().selectedUser?.clerkId) {
					const sender = get().users.find(u => u.clerkId === data.message.senderId);
					if (sender) {
						useNotificationStore.getState().addNotification({
							message: `New message from ${sender.fullName}`,
							type: "message",
							read: false,
							data: { message: data.message, sender }
						});
					}
				}
			});

			socket.on("messageError", (error: { message: string }) => {
				console.error("Message error:", error.message);
				// You can add toast notification here if needed
			});

			set({ isConnected: true });
		}
	},

	disconnectSocket: () => {
		if (get().isConnected) {
			socket.disconnect();
			set({ isConnected: false });
		}
	},

	sendMessage: async (receiverId, content) => {
		const socket = get().socket;
		if (!socket) return;

		socket.emit("sendMessage", { receiverId, content });
	},

	fetchMessages: async (userId: string) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get(`/users/messages/${userId}`);
			set({ messages: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},
}));
