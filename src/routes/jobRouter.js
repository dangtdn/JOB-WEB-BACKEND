import express from "express";
import { isAuthenticated, isAdmin } from "../Middlewares/auth.js";
import jobController from "../Controllers/jobController.js";

const { createJob, singleJob, updateJob, showJobs } = jobController;
const router = express.Router();
//jobs routes

// /api/job/create
router.post("/job/create", isAuthenticated, isAdmin, createJob);
// /api/job/id
router.get("/job/:id", singleJob);
// /api/job/update/job_id
router.put("/job/update/:job_id", isAuthenticated, isAdmin, updateJob);
// /api/jobs/show
router.get("/jobs/show", showJobs);

export default router;
