import express from "express";
import jobController from "../Controllers/jobController.js";
import upload from "../utils/multer.js";

const {
  createJob,
  singleJob,
  updateJob,
  getJobs,
  deleteJobs,
  getJobsPrivate,
  updateStatusJob,
  getSearchJobs,
  getTotalCount,
} = jobController;

const router = express.Router();
//jobs routes

// /api/job/create
router.post("/admin/job/create", upload.single("headerImage"), createJob);
// /api/job/id
router.get("/jobs/:id", singleJob);
// /api/job/update/job_id
router.put("/admin/job/update/:id", updateJob);
// /api//admin/jobs/status/:id
router.put("/admin/jobs/status/:id", updateStatusJob);
// /api/jobs
router.get("/jobs", getJobs);
// /api/jobs/search
router.get("/jobs-search", getSearchJobs);
// /api/jobs-count
router.get("/jobs-count", getTotalCount);
// /api/jobs
router.get("/admin/jobs/private", getJobsPrivate);
// /api/jobs
router.delete("/jobs/:id", deleteJobs);

export default router;
