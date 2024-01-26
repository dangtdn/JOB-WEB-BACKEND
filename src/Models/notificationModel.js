import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  notification: {
    type: [
      {
        message: String,
        timestamp: String,
        event: String,
        status: String,
      },
    ],
  },
});

const NotificationModel = mongoose.model(
  "NotificationModel",
  notificationSchema
);
export default NotificationModel;
