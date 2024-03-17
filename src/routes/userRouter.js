import express from "express";
import userController from "../Controllers/userController.js";
import multer from "multer";
import Cloud from "../utils/cloudinary.js";
import upload from "../utils/multer.js";

const {
  allUsers,
  singleUser,
  updateUser,
  deleteUser,
  getDashboardStat,
  updatePassword,
} = userController;
const router = express.Router();

//user routes
// /api/allusers
router.get("/admin/users", allUsers);
// /api/user/id
router.get("/current-user", singleUser);
// /api/user/statistics
router.get("/statistics", getDashboardStat);
// /api/user/update/id
router.put("/admin/user/update/:id", upload.single("profileImage"), updateUser);
// /api/users/password/reset
router.put("/users/password/reset", updatePassword);
// /api/admin/user/delete/id
router.delete("/admin/user/delete/:id", deleteUser);

export default router;
