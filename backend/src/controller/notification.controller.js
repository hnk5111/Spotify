import { Notification } from "../models/notification.model.js";

export const getNotifications = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);
    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    await Notification.findByIdAndUpdate(notificationId, { read: true });
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    await Notification.updateMany({ userId }, { read: true });
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    await Notification.findByIdAndDelete(notificationId);
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const clearAllNotifications = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    await Notification.deleteMany({ userId });
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
}; 