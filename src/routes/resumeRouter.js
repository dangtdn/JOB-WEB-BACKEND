import express from "express";
import ResumeController from "../Controllers/resumeController.js";

const { getResumePrivate } = ResumeController;
const router = express.Router();
//resumes routes

// /api/resumes
router.get("/resumes", getResumePrivate);

export default router;
