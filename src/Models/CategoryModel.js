import mongoose from "mongoose";
const categorySchema = new mongoose.Schema({
  status: {
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  categoryTitle: {
    type: String,
    required: true,
    unique: true,
  },
  subCategory: [
    {
      type: String,
    },
  ],
  avatar: {
    type: String,
    default: "",
  },
  iconUrl: {
    type: String,
    default: "",
  },
});
const CategoryModel =
  mongoose.model("Category", categorySchema) || mongoose.models.Category;
export default CategoryModel;
