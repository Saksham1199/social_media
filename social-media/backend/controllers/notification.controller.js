import Notification from "../models/notification.model.js";

export const getAllNotifications = async (req, res) => {
  try {
      const userId = req.user._id;
      const notification = await Notification.find({ to: userId }).populate({
          path: "from",
          select: "username profileImg"
      })
      await Notification.updateMany({ to: userId }, { read: true });

      res.status(200).json(notification);
  } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Error fetching notifications" });
  }
};



export const deleteNotification = async (req, res) => {
    try {
        const notificationId = req.user._id;

        await Notification.deleteMany({ to: notificationId });

        res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
        console.error("Error deleting notification:", error);
        res.status(500).json({ message: "Error deleting notification" });
    }
}


export const deleteOneNotification = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const userId = req.user._id;

        const notification = await Notification.findByIdAndDelete(notificationId);
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        if (notification.to.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this notification" });
        }
        await Notification.findByIdAndDelete(notificationId);

        res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
        console.error("Error deleting notification:", error);
        res.status(500).json({ message: "Error deleting notification" });
    }
}