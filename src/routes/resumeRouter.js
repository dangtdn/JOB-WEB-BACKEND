import express from "express";
import ResumeController from "../Controllers/resumeController.js";

const { getResumePrivate, createResume, updateResume, deleteResume } =
  ResumeController;
const router = express.Router();
//resumes routes

// /api/resumes
router.get("/resumes", getResumePrivate);

// /api/resumes/create
router.post("/resumes/create", createResume);

// /api/resumes/:id/update
router.post("/resumes/:id/update", updateResume);

// /api/resumes/:id/delete
router.post("/resumes/:id/delete", deleteResume);

export default router;
