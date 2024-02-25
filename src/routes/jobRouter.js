import express from "express";
import jobController from "../Controllers/jobController.js";

const { createJob, singleJob, updateJob, getJobs, deleteJobs, getJobsPrivate } =
  jobController;

const router = express.Router();
//jobs routes

// /api/job/create
router.post("/admin/job/create", createJob);
// /api/job/id
router.get("/jobs/:id", singleJob);
// /api/job/update/job_id
router.put("/admin/job/update/:id", updateJob);
// /api/jobs
router.get("/jobs", getJobs);
// /api/jobs
router.get("/admin/jobs/private", getJobsPrivate);
// /api/jobs
router.delete("/jobs/:id", deleteJobs);

export default router;
