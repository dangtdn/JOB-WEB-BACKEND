import { getUser } from "../Middlewares/auth.js";
import NotificationModel from "../Models/notificationModel.js";

const NotificationController = {
  getNotification: async (req, res, next) => {
    try {
      const user = await getUser(accessToken);
      const userID = user == null ? void 0 : user.id;
      // short by recent array elemnt within notification object
      const notifications = await NotificationModel.findOne(
        {
          user: userID,
        }, // limit to 8 notifications
        {
          notification: {
            $slice: 8.0,
          },
        }
      );
      return res.status(201).json(notifications);
    } catch (e) {
      throw e;
    }
  },
  updateNotification: async (req, res, next) => {
    //   const { accessToken, notificationId, status } = reqQuery;
    const user = await getUser(req, next);
    const userId = user._id;
    const notificationID = req.body.notificationId;
    const notificationStatus = req.body.status;
    try {
      const updatedNotification = await updateNotificationService(
        userId,
        notificationID,
        notificationStatus
      );
      return updatedNotification;
    } catch (e) {
      throw e;
    }
  },
};

export default NotificationController;
