import { requireAdmin } from "../Middlewares/auth.js";
import CategoryModel from "../Models/CategoryModel.js";
import {
  createCategoryService,
  deleteCategoryService,
  getCategories,
} from "../services/categoryService.js";
import ErrorResponse from "../utils/errorResponse.js";

const categoryController = {
  //create job category
  createCategory: async (req, res, next) => {
    try {
      const { headers, file } = req;
      const accessToken = headers.authorization?.split(" ")[1];
      const imagePath = file?.path;
      const reqData = {
        categoryTitle: req.body.categoryTitle,
        subCategory: req.body.subCategory.split(","),
        imagePath,
        accessToken,
      };
      const jobAlert = await createCategory(reqData);
      res.status(200).send({
        message: "Category created successfully",
      });
    } catch (e) {
      res.status(500).send({
        message: "Server Error",
        error: e.message,
      });
    }
  },

  //all jobs category
  allCategories: async (req, res, next) => {
    try {
      const categories = await getCategories();

      res.status(200).send({
        message: "Successfully fetched all categories",
        data: categories,
      });
    } catch (e) {
      res.status(500).send({
        message: "Server Error",
        error: e.message,
      });
    }
  },

  //get category
  getCategory: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { headers } = req;
      const accessToken = headers.authorization?.split(" ")[1];
      await requireAdmin(accessToken);
      const category = await CategoryModel.findById(id).lean(true);
      if (!category) {
        throw new Error("Category Not Found");
      }

      res.status(200).send({
        message: "Successfully fetched category",
        data: category,
      });
    } catch (e) {
      res.status(500).send({
        message: "Server Error",
        error: e.message,
      });
    }
  },

  //delete job category
  deleteCategory: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { headers } = req;
      const accessToken = headers.authorization?.split(" ")[1];
      const reqQuery = {
        accessToken,
        categoryId: id,
      };
      const category = await deleteCategory(reqQuery);

      res.status(200).send({
        message: "Successfully deleted category",
      });
    } catch (e) {
      res.status(500).send({
        message: "Server Error",
        error: e.message,
      });
    }
  },
};

export default categoryController;

// create category handller
export async function createCategory(reqData) {
  try {
    const user = await requireAdmin(reqData.accessToken);
    const categoryData = {
      // replace forward slash and (* ), comma with dash to create slug
      categoryTitle: reqData.categoryTitle,
      subCategory: reqData.subCategory,
    };
    const imagePath = reqData.imagePath;
    // const imagePath = null;
    const category = await createCategoryService(categoryData, imagePath);
    return category;
  } catch (e) {
    throw e;
  }
}

// delete category handller
export async function deleteCategory(reqQuery) {
  try {
    await requireAdmin(reqQuery.accessToken);
    const categoryID = reqQuery.categoryId;
    console.log("categoryID: ", categoryID);
    const category = await deleteCategoryService(categoryID);
    if (!category) {
      throw new Error("Category Not Found");
    }
    return category;
  } catch (e) {
    throw e;
  }
}
