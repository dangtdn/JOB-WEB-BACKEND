import mongoose from "mongoose";

const jobApplySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    default: "Pending",
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  coverLetter: {
    type: String,
  },
  cvFile: {
    type: String,
  },
  cvFileCloudinary_id: {
    type: String,
  },
  jobItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
  },
});
const JobApply = mongoose.model("JobApply", jobApplySchema);
export default JobApply;
