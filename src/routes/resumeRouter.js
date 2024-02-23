import express from "express";
import ResumeController from "../Controllers/resumeController.js";
import { isAuthenticated } from "../Middlewares/auth.js";

const { getResumePrivate, createResume } = ResumeController;
const router = express.Router();
//resumes routes

// /api/resumes
router.get("/resumes", getResumePrivate);

// /api/resumes/create
router.post("/resumes/create", isAuthenticated, createResume);

export default router;
