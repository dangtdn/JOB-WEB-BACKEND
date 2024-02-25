import express from "express";
import ResumeController from "../Controllers/resumeController.js";

const { getResumePrivate, createResume } = ResumeController;
const router = express.Router();
//resumes routes

// /api/resumes
router.get("/resumes", getResumePrivate);

// /api/resumes/create
router.post("/resumes/create", createResume);

export default router;
