import express from "express";
import { isAuthenticated, isAdmin } from "../Middlewares/auth.js";
import JobApplyController from "../Controllers/jobApplyController.js";

const {
  createJobApply,
  getUserApplication,
  getJobApplication,
  updateApplyStatus,
} = JobApplyController;
const router = express.Router();
//job-apply routes

// /api/job-apply/create
router.post("/job-apply/create", isAuthenticated, createJobApply);
// /api/users/:id/job-apply
router.get("/users/:id/job-apply", isAuthenticated, getUserApplication);
// /api/jobs/:id/job-apply
router.get("/jobs/:id/job-apply", isAuthenticated, getJobApplication);
// /api/job-apply/:id/update
router.put(
  "/job-apply/:id/update",
  isAuthenticated,
  isAdmin,
  updateApplyStatus
);

export default router;
