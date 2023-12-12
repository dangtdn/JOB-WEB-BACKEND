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
    },
    region: {
      type: String,
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
    },
    email: String,
    jobExperience: String,

    applyDeadline: {
      type: String,
    },
    hourlyrate: {
      minimum: {
        type: Number,
      },
      maximum: {
        type: Number,
      },
    },
    salary: {
      minimum: {
        type: Number,
      },
      maximum: {
        type: Number,
      },
    },
    applyLink: {
      type: String,
    },
    avatar: {
      type: String,
    },
    avatarCloudinary_id: {
      type: String,
    },
    expireAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const Job = mongoose.model("Job", JobSchema);
