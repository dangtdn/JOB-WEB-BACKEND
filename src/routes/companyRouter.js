import express from "express";
import { isAuthenticated, isAdmin } from "../Middlewares/auth.js";
import companyController from "../Controllers/companyController.js";

const {
  createCampany,
  showCompanies,
  singleCompany,
  updateCompany,
  deleteCompany,
} = companyController;
const router = express.Router();
//company routes

// /api/company/create
router.post("/company/create", isAuthenticated, isAdmin, createCampany);
// /api/company/id
router.get("/company/:id", singleCompany);
// /api/company/update/company_id
router.put(
  "/company/update/:company_id",
  isAuthenticated,
  isAdmin,
  updateCompany
);
// /api/companies
router.get("/companies", showCompanies);
// /api/company/delete/company_id
router.delete(
  "/company/delete/:company_id",
  isAuthenticated,
  isAdmin,
  deleteCompany
);

export default router;
