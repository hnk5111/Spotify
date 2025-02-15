import { FriendRequest } from "../models/friendRequest.model.js";
import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";

export const sendFriendRequest = async (req, res, next) => {
  try {
    const senderId = req.auth.userId;
    const { receiverId } = req.body;

    // Check if request already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    });

    if (existingRequest) {
      return res.status(400).json({ 
        message: existingRequest.status === 'pending' 
          ? "Friend request already sent" 
          : "You are already friends" 
      });
    }

    const request = await FriendRequest.create({
      senderId,
      receiverId
    });

    // Create notification for receiver
    await Notification.create({
      userId: receiverId,
      message: `You have a new friend request`,
      type: 'friend_request',
      metadata: { requestId: request._id }
    });

    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
};

export const respondToFriendRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    const request = await FriendRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Create notification for sender
    await Notification.create({
      userId: request.senderId,
      message: `Your friend request was ${status}`,
      type: 'friend_request_response'
    });

    res.status(200).json(request);
  } catch (error) {
    next(error);
  }
};

export const getFriends = async (req, res, next) => {
  try {
    const userId = req.auth.userId;

    const acceptedRequests = await FriendRequest.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
      status: "accepted"
    });

    const friendIds = acceptedRequests.map(request => 
      request.senderId === userId ? request.receiverId : request.senderId
    );

    const friends = await User.find({
      clerkId: { $in: friendIds }
    }).select('clerkId fullName imageUrl');

    res.status(200).json(friends);
  } catch (error) {
    next(error);
  }
};

export const getPendingRequests = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    
    const pendingRequests = await FriendRequest.find({
      receiverId: userId,
      status: "pending"
    }).populate({
      path: 'senderId',
      model: 'User',
      select: 'fullName imageUrl'
    });

    res.status(200).json(pendingRequests);
  } catch (error) {
    next(error);
  }
};

export const getFriendshipStatus = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const { targetUserId } = req.params;

    const request = await FriendRequest.findOne({
      $or: [
        { senderId: userId, receiverId: targetUserId },
        { senderId: targetUserId, receiverId: userId }
      ]
    });

    res.status(200).json({
      status: request ? request.status : 'none',
      requestId: request?._id,
      receiverId: request?.receiverId
    });
  } catch (error) {
    next(error);
  }
}; 