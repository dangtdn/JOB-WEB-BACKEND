import { sendNotification } from "../services/notificationService.js";

export async function sendNotificationEmail(input) {
  try {
    switch (input.emailData.emailType) {
      case "CONFIRMATION_EMAIL": {
        const userId = input == null ? void 0 : input.userId;
        const notificationInput = {
          user: input == null ? void 0 : input.userId,
          notification: [
            {
              message: `${input.emailData.subject}`,
              timestamp: new Date().toISOString(),
              event: input == null ? void 0 : input.emailType,
              status: "UNREAD",
            },
          ],
        };
        if (input.userId && input.emailType) {
          sendNotification(userId, notificationInput);
        }
        break;
      }
      case "JOB_PUBLISHED": {
        const userId = input == null ? void 0 : input.userId;
        const notificationInput = {
          user: input == null ? void 0 : input.userId,
          notification: [
            {
              message: `${input.emailData.subject}`,
              timestamp: new Date().toISOString(),
              event: input == null ? void 0 : input.emailType,
              status: "UNREAD",
            },
          ],
        };
        if (input.userId && input.emailType) {
          sendNotification(userId, notificationInput);
        }
        break;
      }
      case "JOB_DELETED": {
        const userId = input == null ? void 0 : input.userId;
        const notificationInput = {
          user: input == null ? void 0 : input.userId,
          notification: [
            {
              message: `${input.emailData.subject}`,
              timestamp: new Date().toISOString(),
              event: input == null ? void 0 : input.emailType,
              status: "UNREAD",
            },
          ],
        };
        if (input.userId && input.emailType) {
          sendNotification(userId, notificationInput);
        }
        break;
      }
      case "JOB_ALERT": {
        const userId = input == null ? void 0 : input.userId;
        const notificationInput = {
          user: input == null ? void 0 : input.userId,
          notification: [
            {
              message: `${input.emailData.subject}`,
              timestamp: new Date().toISOString(),
              event: input == null ? void 0 : input.emailType,
              status: "UNREAD",
            },
          ],
        };
        if (input.userId && input.emailType) {
          sendNotification(userId, notificationInput);
        }
        break;
      }
      default: {
        const userId = input == null ? void 0 : input.userId;
        const notificationInput = {
          user: input == null ? void 0 : input.userId,
          notification: [
            {
              message: `${input.emailData.subject}`,
              timestamp: new Date().toISOString(),
              event: input == null ? void 0 : input.emailType,
              status: "UNREAD",
            },
          ],
        };
        if (input.userId && input.emailType) {
          sendNotification(userId, notificationInput);
        }
        break;
      }
    }
  } catch (e) {
    throw e;
  }
}
