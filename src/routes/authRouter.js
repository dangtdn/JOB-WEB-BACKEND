import express from "express";
import authController from "../Controllers/authController.js";

const { signup, signin, logout, userProfile } = authController;
const router = express.Router();

//auth routes
// /api/signup
router.post("/signup", signup);
// /api/signin
router.post("/signin", signin);
// /api/logout
router.get("/logout", logout);
// // /api/user-profile
router.get("/user-profile", userProfile);

export default router;
