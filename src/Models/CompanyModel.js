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
    companyTagline: { type: String, default: "" },
    category: { type: String, default: "" },
    videoLink: { type: String, default: "" },
    companyEmail: { type: String, default: "" },
    phoneNumber: { type: String, default: "" },
    eatablishedDate: { type: String, default: "" },
    companyWebsite: { type: String, default: "" },
    avarageSalary: { type: String, default: "" },
    revenue: { type: String, default: "" },
    socialLink: {
      linkedin: { type: String, default: "" },
      facebook: { type: String, default: "" },
      twitter: { type: String, default: "" },
    },
    companySize: { type: String, default: "" },
    description: {
      type: String,
      default: "",
    },
    location: { type: String, default: "" },
    locationMap: {
      latitude: { type: String, default: "" },
      longitude: { type: String, default: "" },
    },
    logo: { type: String, default: "" },
    logoCloudinary_id: { type: String, default: "" },
    thumb: { type: String, default: "" },
    thumbCloudinary_id: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Company = mongoose.model("Company", CompanySchema);
