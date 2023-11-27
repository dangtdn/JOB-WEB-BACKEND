import express from "express";
import authController from "../Controllers/authController.js";
import { isAuthenticated } from "../Middlewares/auth.js";

const { signup, signin, logout, userProfile } = authController;
const router = express.Router();

//auth routes
// /api/signup
router.post("/register", signup);
// /api/signin
router.post("/login", signin);
// /api/logout
router.get("/logout", logout);
// // /api/me
router.get("/userprofile", isAuthenticated, userProfile);

export default router;
