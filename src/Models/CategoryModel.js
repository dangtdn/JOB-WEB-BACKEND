import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      trim: true,
      required: [true, "CategoryName is required"],
      maxlength: 70,
    },
    logo: { type: String, default: "" },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Category = mongoose.model("Category", CategorySchema);
