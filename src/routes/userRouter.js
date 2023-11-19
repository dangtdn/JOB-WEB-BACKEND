import express from "express";
import userController from "../Controllers/userController.js";
import { isAdmin, isAuthenticated } from "../Middlewares/auth.js";

const { allUsers, singleUser, editUser, deleteUser, createUserJobsHistory } =
  userController;
const router = express.Router();

//user routes
// /api/allusers
router.get("/allusers", isAuthenticated, isAdmin, allUsers);
// /api/user/id
router.get("/user/:id", isAuthenticated, singleUser);
// /api/user/edit/id
router.put("/user/edit/:id", isAuthenticated, editUser);
// /api/admin/user/delete/id
router.delete("/admin/user/delete/:id", isAuthenticated, isAdmin, deleteUser);
// /api/user/jobhistory
router.post("/user/jobhistory", isAuthenticated, createUserJobsHistory);

export default router;
