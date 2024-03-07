<<<<<<< HEAD
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
=======
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
>>>>>>> 665abd5e0b0aabe0c044757701071e51f30ec5df
