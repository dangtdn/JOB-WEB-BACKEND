import express from "express";
import categoryController from "../Controllers/categoryController.js";
import upload from "../utils/multer.js";

const { createCategory, allCategories, deleteCategory, getCategory } =
  categoryController;
const router = express.Router();

//category type routes

// /api/type/create
router.post(
  "/admin/category/create",
  upload.single("categoryIcon"),
  createCategory
);
// /api/categories
router.get("/categories/:id", getCategory);
// /api/categories
router.get("/categories", allCategories);
// /api/category/delete/category_id
router.delete("/admin/category/delete/:id", deleteCategory);

export default router;
