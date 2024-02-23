import { requireUser } from "../Middlewares/auth.js";
import NotificationModel from "../Models/notificationModel.js";

// create notification service
export async function createNotification(input) {
  const notification = await NotificationModel.create(input);
  return notification;
}
export async function getNotification(accessToken) {
  try {
    const user = await requireUser(accessToken);
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
    return notifications;
  } catch (e) {
    throw e;
  }
}
// sent notification to user
export async function sendNotification(query, input) {
  try {
    // check if Notifiction Collection model is exist in databaseName
    const notificationResult = await NotificationModel.findOne({
      user: query,
    });
    if (!notificationResult) {
      const newNotification = await createNotification(input);
      return newNotification;
    }
    // if notification is exist
    const newNotification1 = await NotificationModel.findOneAndUpdate(
      {
        user: query,
      },
      {
        $push: {
          notification: {
            $each: input.notification,
            $position: 0,
          },
        },
      },
      {
        new: true,
      }
    );
    return newNotification1;
  } catch (error) {
    throw error;
  }
}
export async function updateNotificationService(
  userId,
  notificationId,
  notificationStatus
) {
  try {
    const notification = await NotificationModel.findOneAndUpdate(
      {
        user: userId,
        "notification._id": notificationId,
      },
      {
        $set: {
          //  change status of notification array
          "notification.$.status": notificationStatus,
        },
      },
      {
        new: true,
      }
    );
    return notification;
  } catch (e) {
    throw e;
  }
}
