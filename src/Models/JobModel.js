import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  name: { type: String },
  data: { type: Buffer },
  size: { type: Number },
  encoding: { type: String },
  tempFilePath: { type: String },
  truncated: { type: Boolean },
  mimetype: { type: String },
  md5: { type: String },
});

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
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    region: {
      type: [String],
      default: [],
    },
    jobTypes: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
    },
    specialTags: {
      type: [String],
      default: [],
    },
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
    // avatarFile: {
    //   type: imageSchema,
    // },
    avatar: {
      type: String | undefined,
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
