import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		clerkId: {
			type: String,
			required: true,
			unique: true,
		},
		username: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		fullName: {
			type: String,
			required: true,
			trim: true,
		},
		imageUrl: {
			type: String,
			default: "",
		},
		isOnline: {
			type: Boolean,
			default: false,
		},
		lastSeen: {
			type: Date,
			default: Date.now,
		},
		friends: [{
			type: String, // clerkId of friends
			ref: 'User'
		}],
		blockedUsers: [{
			type: String, // clerkId of blocked users
			ref: 'User'
		}]
	},
	{
		timestamps: true,
	}
);

// Pre-save middleware to update lastSeen
userSchema.pre('save', function(next) {
	if (this.isModified('isOnline') && this.isOnline === false) {
		this.lastSeen = new Date();
	}
	next();
});

// Create text index for search functionality
userSchema.index({ fullName: 'text' });

export const User = mongoose.model("User", userSchema);
