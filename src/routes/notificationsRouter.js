import express from "express";
import NotificationController from "../Controllers/notificationController.js";

const { getNotification, updateNotification } = NotificationController;
const router = express.Router();

//notifications type routes

// /api/notifications
router.get("/notifications", getNotification);
// /api/notifications/:id/update
router.put("/notifications/:id/update", updateNotification);

export default router;
