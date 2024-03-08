import express from "express";
import ResumeController from "../Controllers/resumeController.js";

const {
  getResumePrivate,
  createResume,
  updateResume,
  deleteResume,
  getSingleResume,
  updateStattusResume,
} = ResumeController;
const router = express.Router();
//resumes routes

// /api/resumes
router.get("/resumes", getResumePrivate);

// /api/resumes/:id
router.get("/resumes/:id", getSingleResume);

// /api/resumes/create
router.post("/resumes/create", createResume);

// /api/resumes/:id/update
router.put("/resumes/:id/update", updateResume);

// /api//admin/resumes/status/:id
router.put("/admin/resumes/status/:id", updateStattusResume);

// /api/resumes/:id/delete
router.delete("/resumes/:id/delete", deleteResume);

export default router;
