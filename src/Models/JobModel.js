import mongoose from "mongoose";

const JobSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    status: {
      isApproved: {
        type: Boolean,
        default: false,
      },
      isPublished: {
        type: Boolean,
        default: true,
      },
      isFeatured: {
        type: Boolean,
        default: false,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
    },
    jobTitle: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: "",
    },
    region: {
      type: String,
      default: "",
    },
    jobTypes: [
      {
        type: String,
      },
    ],
    category: {
      type: String,
    },
    specialTags: [
      {
        type: String,
      },
    ],
    jobDescription: {
      type: String,
      default: "",
    },
    email: { type: String },
    jobExperience: { type: String },
    applyDeadline: {
      type: String,
    },
    hourlyrate: {
      minimum: {
        type: Number,
        default: 0,
      },
      maximum: {
        type: Number,
        default: 0,
      },
    },
    salary: {
      minimum: {
        type: Number,
        default: 0,
      },
      maximum: {
        type: Number,
        default: 0,
      },
    },
    applyLink: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    avatarCloudinary_id: {
      type: String,
      default: "",
    },
    expireAt: {
      type: Date,
      default: "",
    },
  },
  { timestamps: true }
);

export const Job = mongoose.model("Job", JobSchema);
