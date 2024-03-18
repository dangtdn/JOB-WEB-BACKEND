import express from "express";
import JobApplyController from "../Controllers/jobApplyController.js";
import upload from "../utils/multer.js";

const {
  createJobApply,
  getUserApplication,
  getJobApplication,
  updateApplyStatus,
  deleteUserApplication,
  getApplications,
} = JobApplyController;
const router = express.Router();
//job-apply routes

// /api/job-apply/create
router.post("/job-apply/create", upload.single("cvFile"), createJobApply);
// /api/applications
router.get("/applications", getApplications);
// /api/users/:id/job-apply
router.get("/users/:id/job-apply", getUserApplication);
// /api/jobs/:id/job-apply
router.get("/jobs/:id/job-apply", getJobApplication);
// /api/jobs/:id/job-apply/update
router.put("/jobs/:id/job-apply/update", updateApplyStatus);
// /api/job-apply/:id/update
router.delete("/users/:id/delete", deleteUserApplication);

export default router;
