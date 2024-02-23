import { getUser } from "../Middlewares/auth.js";
import {
  getNotification,
  updateNotificationService,
} from "../services/notificationService.js";

const NotificationController = {
  getNotification: async (req, res, next) => {
    try {
      const { headers } = req;
      const accessToken = headers.authorization?.split(" ")[1];

      const notifications = await getNotification(accessToken);
      res.status(200).send({
        message: "Successfully fetched recent activities",
        data: notifications,
      });
      next();
    } catch (e) {
      res.status(500).send({
        message: "Server Error",
        error: e.message,
      });
      next(e);
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
