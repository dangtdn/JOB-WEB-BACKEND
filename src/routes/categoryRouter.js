import express from "express";
import { isAuthenticated, isAdmin } from "../Middlewares/auth.js";
import categoryController from "../Controllers/categoryController.js";

const { createCategory, allCategories, updateCategory, deleteCategory } =
  categoryController;
const router = express.Router();

//job type routes

// /api/type/create
router.post("/admin/category/create", isAuthenticated, isAdmin, createCategory);
// /api/category/jobs
router.get("/categories", allCategories);
// /api/category/update/category_id
router.put(
  "/admin/category/update/:id",
  isAuthenticated,
  isAdmin,
  updateCategory
);
// /api/category/delete/category_id
router.delete(
  "/admin/category/delete/:id",
  isAuthenticated,
  isAdmin,
  deleteCategory
);

export default router;
