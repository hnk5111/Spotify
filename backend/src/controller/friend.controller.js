import { FriendRequest } from "../models/friendRequest.model.js";
import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";

export const sendFriendRequest = async (req, res, next) => {
  try {
    const senderId = req.auth.userId;
    const { receiverId } = req.body;

    console.log("Sending friend request:", { senderId, receiverId });

    // Check if request already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    });

    if (existingRequest) {
      console.log("Existing request found:", existingRequest);
      return res.status(400).json({ 
        message: existingRequest.status === 'pending' 
          ? "Friend request already sent" 
          : "You are already friends" 
      });
    }

    // Get sender details for the notification
    const sender = await User.findOne({ clerkId: senderId });
    if (!sender) {
      console.log("Sender not found:", senderId);
      return res.status(404).json({ message: "Sender not found" });
    }

    console.log("Sender found:", sender);

    // Create friend request
    const request = await FriendRequest.create({
      senderId,
      receiverId
    });

    console.log("Friend request created:", request);

    // Create notification with enhanced metadata
    const notification = await Notification.create({
      userId: receiverId,
      message: "sent you a friend request",
      type: 'friend_request',
      metadata: {
        requestId: request._id,
        senderId: sender.clerkId,
        senderName: sender.fullName,
        senderImage: sender.imageUrl
      }
    });

    console.log("Notification created:", notification);

    // Emit socket event for real-time notification
    const io = req.app.get('io');
    if (io) {
      io.to(receiverId).emit('new_notification');
    }

    res.status(201).json(request);
  } catch (error) {
    console.error("Error in sendFriendRequest:", error);
    next(error);
  }
};

export const respondToFriendRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    const request = await FriendRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Get responder details for the notification
    const responder = await User.findOne({ clerkId: req.auth.userId });
    if (!responder) {
      return res.status(404).json({ message: "Responder not found" });
    }

    // Update request status
    request.status = status;
    await request.save();

    // Create notification for the original sender
    await Notification.create({
      userId: request.senderId,
      message: status === 'accepted' 
        ? "accepted your friend request. You can now chat with each other!" 
        : "declined your friend request",
      type: 'friend_request_response',
      metadata: {
        senderId: responder.clerkId,
        senderName: responder.fullName,
        senderImage: responder.imageUrl
      }
    });

    // Emit socket event for real-time notification
    const io = req.app.get('io');
    if (io) {
      io.to(request.senderId).emit('new_notification');
    }

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