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
    } catch (e) {
      res.status(500).send({
        message: "Server Error",
        error: e.message,
      });
    }
  },
  updateNotification: async (req, res, next) => {
    try {
      const { id } = req.query;
      const status = req.body.status;

      const { headers } = req;
      const accessToken = headers.authorization?.substring(
        7,
        headers.authorization.length
      );

      const reqQuery = { accessToken, notificationId: id, status };

      const notifications = await updateNotification(reqQuery);

      res.status(200).send({
        message: "Successfully updated notofication status",
      });
    } catch (e) {
      res.status(500).send({
        message: "Server Error",
        error: e.message,
      });
    }
  },
};

export default NotificationController;

// controller
// update notification status
export async function updateNotification(reqQuery) {
  const { accessToken, notificationId, status } = reqQuery;
  await connectDB();
  const user = await requireUser(accessToken);
  const userId = user._id;
  const notificationID = notificationId;
  const notificationStatus = status;
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
}
