import mongoose from "mongoose";
const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      isPublished: {
        type: Boolean,
        default: true,
      },
      isApproved: {
        type: Boolean,
        default: false,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    region: {
      type: String,
    },
    professionalTitle: {
      type: String,
    },
    location: {
      type: String,
    },
    photo: {
      type: String,
    },
    photoCloudinary_id: {
      type: String,
    },
    file: {
      type: String,
    },
    fileCloudinary_id: {
      type: String,
    },
    video: {
      type: String,
    },
    category: {
      type: String,
    },
    // industry: {
    //   type: String,
    // },
    workingRate: {
      type: Number,
    },
    education: {
      type: [
        {
          schoolName: String,
          qualifications: String,
          startDate: String,
          endDate: String,
          notes: String,
        },
      ],
    },
    resumeContent: {
      type: String,
    },
    skills: {
      type: [String],
    },
    url: {
      type: [
        {
          name: String,
          url: String,
        },
      ],
    },
    experience: {
      type: [
        {
          employerName: String,
          jobTitle: String,
          startDate: String,
          endDate: String,
          notes: String,
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);
const ResumeModel = mongoose.model("ResumeModel", resumeSchema);
export default ResumeModel;
