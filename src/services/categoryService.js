import CategoryModel from "../Models/CategoryModel.js";
import { Job } from "../Models/JobModel.js";
import Cloud from "../utils/cloudinary.js";

// create a category service
export async function createCategoryService(categoryData, imagePath) {
  try {
    let categoryInput;
    if (imagePath) {
      // Upload image to cloudinary
      const imageData = await Cloud.uploader.upload(imagePath);
      categoryInput = {
        ...categoryData,
        avatar: imageData.secure_url,
        iconUrl: imageData.public_id,
      };
    } else {
      categoryInput = {
        ...categoryData,
      };
    }
    // console.log('CategoryInput from servoce', categoryInput)
    const category = await CategoryModel.create(categoryInput);
    return category;
  } catch (e) {
    //console.log(e)
    throw e.code;
  }
}
export async function getCategories() {
  try {
    const categories = await CategoryModel.find().lean(true);
    // get the list of categoryTitle
    const categoryTitle = categories.map((category) => category.categoryTitle);
    //   count the aggregate category
    const count = await Job.aggregate([
      {
        $group: {
          _id: "$category",
          count: {
            $sum: 1,
          },
        },
      },
    ]);
    const result = categories.map((category) => {
      const categoryCount = count.find(
        (count) => count._id === category.categoryTitle
      );
      return {
        ...category,
        count: categoryCount ? categoryCount.count : 0,
      };
    });
    return result;
  } catch (e) {
    throw e;
  }
}
// delete a category service
export async function deleteCategoryService(categoryID) {
  try {
    // Delete image from cloudinary
    const categoryPrevData = await CategoryModel.findById(categoryID);
    // if (categoryPrevData.iconUrl) {
    //   await cloudinary.uploader.destroy(categoryPrevData.iconUrl);
    // }
    const category = await CategoryModel.findByIdAndDelete(categoryID);
    return category;
  } catch (e) {
    throw e;
  }
}
