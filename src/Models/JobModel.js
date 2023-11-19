import mongoose from "mongoose";

const JobSchema = mongoose.Schema(
  {
    title: { type: String, required: [true, "Title can not empty!!!"] },
    description: {
      type: String,
      trim: true,
      required: [true, "Description is required"],
    },
    location: { type: String, default: "", required: false },
    salaryRange: {
      maximum: { type: Number, required: [true, "Salary is required"] },
      minimum: { type: Number, required: [true, "Salary is required"] },
    },
    jobType: {
      type: String,
      enum: ["Full Time", "Part Time", "Remote"],
      default: "Full Time",
    },
    status: {
      isActive: { type: Boolean, default: true },
      isApproved: { type: Boolean, default: true },
    },
    specialTags: { type: [String], default: [] },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // company: {
    //   type: mongoose.Types.ObjectId,
    //   ref: "Company",
    //   require: true,
    // },
    // relatedJobs: [JobSchema],
  },
  { timestamps: true }
);

export const Job = mongoose.model("Job", JobSchema);
