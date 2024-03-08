import express from "express";
import JobAlertsController from "../Controllers/jobAlertsController.js";

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

// /api/job/alert/create
router.post("/jobs/alerts/create", createJobAlerts);
// /api/job/alert/id
router.get("/jobs/alert/:id", getSingleJobAlert);
// /api/job/alert/update/job_id
router.put("/jobs/alert/:id/update", updateJobAlert);
// /api/job/alert/update/job_id
router.patch("/jobs/alert/status/:id", updateJobAlertStatus);
// /api/jobs/alerts
router.get("/job-alerts", getJobAlerts);
// /api/jobs/alert/:id/delete
router.delete("/jobs/alert/:id/delete", deleteJobAlert);

export default router;
