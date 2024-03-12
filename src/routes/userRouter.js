import express from "express";
import userController from "../Controllers/userController.js";
import multer from "multer";
import Cloud from "../utils/cloudinary.js";

const {
  allUsers,
  singleUser,
  updateUser,
  deleteUser,
  createUserJobsHistory,
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
router.put("/admin/user/update/:id", updateUser);
// /api/user/update/id
router.put("/users/password/reset", updatePassword);
// /api/admin/user/delete/id
router.delete("/admin/user/delete/:id", deleteUser);
// /api/user/jobhistory
router.post("/user/job-histories", createUserJobsHistory);

export default router;
