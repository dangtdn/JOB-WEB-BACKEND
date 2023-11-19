import express from "express";
import { isAuthenticated, isAdmin } from "../Middlewares/auth.js";
import categoryController from "../Controllers/categoryController.js";

const { createCategory, allCategories, updateCategory, deleteCategory } =
  categoryController;
const router = express.Router();

//job type routes

// /api/type/create
router.post("/type/create", isAuthenticated, isAdmin, createCategory);
// /api/type/jobs
router.get("/type/jobs", allCategories);
// /api/type/update/type_id
router.put("/type/update/:type_id", isAuthenticated, isAdmin, updateCategory);
// /api/type/delete/type_id
router.delete(
  "/type/delete/:type_id",
  isAuthenticated,
  isAdmin,
  deleteCategory
);

export default router;
