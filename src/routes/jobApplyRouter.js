import express from "express";
import JobApplyController from "../Controllers/jobApplyController.js";

const {
  createJobApply,
  getUserApplication,
  getJobApplication,
  updateApplyStatus,
  deleteUserApplication,
} = JobApplyController;
const router = express.Router();
//job-apply routes

// /api/job-apply/create
router.post("/job-apply/create", createJobApply);
// /api/users/:id/job-apply
router.get("/users/:id/job-apply", getUserApplication);
// /api/jobs/:id/job-apply
router.get("/jobs/:id/job-apply", getJobApplication);
// /api/job-apply/:id/update
router.put("/job-apply/:id/update", updateApplyStatus);
// /api/job-apply/:id/update
router.delete("/users/:id/delete", deleteUserApplication);

export default router;
