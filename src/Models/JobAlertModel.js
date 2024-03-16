import mongoose from "mongoose";

const jobAlertSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    keyword: {
      type: String,
    },
    region: {
      type: String,
    },
    category: {
      type: String,
    },
    tags: [
      {
        type: String,
      },
    ],
    type: [
      {
        type: String,
      },
    ],
    emailFrequency: {
      type: String,
    },
  },
  { timestamps: true }
);
const JobAlertModel = mongoose.model("JobAlert", jobAlertSchema);
export default JobAlertModel;
