import { ReactNode } from "react";

export interface Song {
	videoUrl: string | null;
	genre: string;
	playedAt: string;
	userId: string | undefined;
	_id: string;
	title: string;
	artist: string;
	albumId?: string;
	imageUrl: string;
	audioUrl: string;
	url?: string;
	duration: number;
	isLiked?: boolean;
	lyrics?: string;
	createdAt: string;
	updatedAt: string;
}

export interface Album {
	releaseYear: ReactNode;
	_id: string;
	title: string;
	artist: string;
	imageUrl: string;
	songs: Song[];
	createdAt: string;
	updatedAt: string;
}

export interface Stats {
	totalSongs: number;
	totalAlbums: number;
	totalUsers: number;
	totalArtists: number;
}

export interface Message {
	_id: string;
	senderId: string;
	receiverId: string;
	content: string;
	createdAt: string;
	updatedAt: string;
}

export interface User {
	_id: string;
	clerkId: string;
	fullName: string;
	imageUrl: string;
}

export interface Location {
	userId: string;
	latitude: number;
	longitude: number;
	lastUpdated: Date;
}

export interface Friend {
	_id: string;
	userId: string;
	friendId: string;
	status: 'pending' | 'accepted' | 'rejected';
	createdAt: Date;
	updatedAt: Date;
}

export interface UserLocation {
	user: {
		_id: string;
		name: string;
		image?: string;
	};
	location: Location;
}
