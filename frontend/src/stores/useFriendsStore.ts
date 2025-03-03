import { create } from 'zustand';
import { Friend, UserLocation } from '@/types';
import { axiosInstance } from '@/lib/axios';

interface FriendsStore {
  friends: Friend[];
  friendLocations: UserLocation[];
  isLoading: boolean;
  error: string | null;
  
  // Friends management
  getFriends: () => Promise<void>;
  sendFriendRequest: (friendId: string) => Promise<void>;
  acceptFriendRequest: (requestId: string) => Promise<void>;
  rejectFriendRequest: (requestId: string) => Promise<void>;
  
  // Location management
  updateLocation: (latitude: number, longitude: number) => Promise<void>;
  getFriendLocations: () => Promise<void>;
}

export const useFriendsStore = create<FriendsStore>((set, get) => ({
  friends: [],
  friendLocations: [],
  isLoading: false,
  error: null,

  getFriends: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.get('/api/friends');
      set({ friends: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  sendFriendRequest: async (friendId: string) => {
    try {
      set({ isLoading: true, error: null });
      await axiosInstance.post('/api/friends/request', { friendId });
      await get().getFriends();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  acceptFriendRequest: async (requestId: string) => {
    try {
      set({ isLoading: true, error: null });
      await axiosInstance.post(`/api/friends/accept/${requestId}`);
      await get().getFriends();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  rejectFriendRequest: async (requestId: string) => {
    try {
      set({ isLoading: true, error: null });
      await axiosInstance.post(`/api/friends/reject/${requestId}`);
      await get().getFriends();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateLocation: async (latitude: number, longitude: number) => {
    try {
      await axiosInstance.post('/api/location/update', {
        latitude,
        longitude,
      });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  getFriendLocations: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.get('/api/location/friends');
      set({ friendLocations: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
})); 