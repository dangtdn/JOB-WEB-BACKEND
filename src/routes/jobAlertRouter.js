import express from "express";
import JobAlertsController from "../Controllers/jobAlertsController";

const {
  getJobAlerts,
  getSingleJobAlert,
  createJobAlerts,
  updateJobAlert,
  updateJobAlertStatus,
  deleteJobAlert,
} = JobAlertsController;

const router = express.Router();
//jobs routes

// /api/job/create
router.post("/jobs/alerts/create", createJob);
// /api/job/id
router.get("/jobs/alert/:id", singleJob);
// /api/job/update/job_id
router.put("/jobs/alert/:id/update", updateJob);
// /api/job/update/job_id
router.put("/jobs/alert/:id/update", updateJob);
// /api/jobs
router.get("/jobs/alerts", getJobs);
// /api/jobs/alert/:id/delete
router.delete("/jobs/alert/:id/delete", deleteJobs);

export default router;
