import { Category } from "../Models/CategoryModel.js";
import ErrorResponse from "../utils/errorResponse.js";

const categoryController = {
  //create job category
  createCategory: async (req, res, next) => {
    try {
      const job = await Category.create({
        categoryName: req.body.categoryName,
        user: req.user.id,
      });
      res.status(201).json({
        success: true,
        job,
      });
    } catch (error) {
      next(error);
    }
  },

  //all jobs category
  allCategories: async (req, res, next) => {
    try {
      const job = await Category.find();
      res.status(200).json({
        success: true,
        job,
      });
    } catch (error) {
      next(error);
    }
  },

  //update job category
  updateCategory: async (req, res, next) => {
    try {
      const job = await Category.findByIdAndUpdate(
        req.params.type_id,
        req.body,
        {
          new: true,
        }
      );
      res.status(200).json({
        success: true,
        job,
      });
    } catch (error) {
      next(error);
    }
  },

  //delete job category
  deleteCategory: async (req, res, next) => {
    try {
      const job = await Category.findByIdAndRemove(req.params.type_id);
      res.status(200).json({
        success: true,
        message: "Job category deleted",
      });
    } catch (error) {
      next(new ErrorResponse("server error", 500));
    }
  },
};

export default categoryController;
