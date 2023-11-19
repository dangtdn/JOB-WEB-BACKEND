import express from "express";
import { isAuthenticated, isAdmin } from "../Middlewares/auth.js";
import companyController from "../Controllers/companyController.js";

const { createCampany, showCompanies } = companyController;
const router = express.Router();
//jobs routes

// /api/company/create
router.post("/company/create", isAuthenticated, isAdmin, createCampany);
// // /api/job/id
// router.get("/job/:id", singleJob);
// // /api/job/update/job_id
// router.put("/job/update/:job_id", isAuthenticated, isAdmin, updateJob);
// // /api/jobs/show
router.get("/companies/show", showCompanies);

export default router;
