import mongoose from "mongoose";

const CompanySchema = mongoose.Schema(
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
    companyName: {
      type: String,
      required: true,
    },
    companyTagline: String,
    category: String,
    videoLink: String,
    companyEmail: String,
    phoneNumber: String,
    eatablishedDate: String,
    companyWebsite: String,
    avarageSalary: String,
    revenue: String,
    socialLink: {
      linkedin: String,
      facebook: String,
      twitter: String,
    },
    companySize: String,
    description: {
      type: String,
      required: true,
    },
    location: String,
    locationMap: {
      latitude: String,
      longitude: String,
    },
    logo: String,
    logoCloudinary_id: String,
    thumb: String,
    thumbCloudinary_id: String,
  },
  { timestamps: true }
);

export const Company = mongoose.model("Company", CompanySchema);
