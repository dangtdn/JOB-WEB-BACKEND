import express from "express";
import userController from "../Controllers/userController.js";
import { isAdmin, isAuthenticated } from "../Middlewares/auth.js";

const { allUsers, singleUser, editUser, deleteUser, createUserJobsHistory } =
  userController;
const router = express.Router();

//user routes
// /api/allusers
router.get("/admin/users", isAuthenticated, allUsers);
// /api/user/id
router.get("/user/:id", isAuthenticated, singleUser);
// /api/user/update/id
router.put("/admin/user/update/:id", isAuthenticated, isAdmin, editUser);
// /api/admin/user/delete/id
router.delete("/admin/user/delete/:id", isAuthenticated, isAdmin, deleteUser);
// /api/user/jobhistory
router.post("/user/job-histories", isAuthenticated, createUserJobsHistory);

export default router;
