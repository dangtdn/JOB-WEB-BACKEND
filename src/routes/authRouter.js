import express from "express";
import authController from "../Controllers/authController.js";

const { signup, signin } = authController;
const router = express.Router();

//auth routes
// /api/signup
router.post("/signup", signup);
// /api/signin
router.post("/signin", signin);
export default router;
