import express from "express";
import companyController from "../Controllers/companyController.js";
import upload from "../utils/multer.js";

const {
  createCampany,
  showCompanies,
  getSingleCompany,
  updateCompany,
  deleteCompany,
  getCompaniesPrivate,
  updateStatusCompany,
} = companyController;
const router = express.Router();
//company routes

// /api/company/create
router.post(
  "/admin/company/create",
  upload.fields([
    { name: "logoImage", maxCount: 1 },
    { name: "headerImage", maxCount: 1 },
  ]),
  createCampany
);
// /api/company/id
router.get("/company/:id", getSingleCompany);
// /api/company/update/company_id
router.put(
  "/admin/company/:id/update",
  upload.fields([
    { name: "logoImage", maxCount: 1 },
    { name: "headerImage", maxCount: 1 },
  ]),
  updateCompany
);
// /api/companies
router.get("/companies", showCompanies);
// /api/companies/private
router.get("/companies/private", getCompaniesPrivate);
// /api/company/delete/company_id
router.delete("/admin/company/:id/delete", deleteCompany);
// /api/company/delete/company_id
router.put("/admin/companies/status/:id", updateStatusCompany);

export default router;
