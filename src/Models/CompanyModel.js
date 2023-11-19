import mongoose from "mongoose";

const CompanySchema = mongoose.Schema(
  {
    companyName: { type: String, required: [true, "Name can not empty!!!"] },
    companyEmail: {
      type: String,
      required: [true, "Name can not empty!!!"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    companySize: { type: String, default: "" },
    companyWebsite: { type: String, default: "" },
    description: { type: String, default: "" },
    logo: {
      url: {
        type: String,
        required: [true, "Logo can not empty!!!"],
      },
    },
    phoneNumber: { type: String, maxlength: 10 },
    location: { type: String, default: "" },
    locationMap: {
      latitude: { type: String, default: "" },
      longitude: { type: String, default: "" },
    },
    socialLink: {
      linkedin: { type: String, default: "" },
      facebook: { type: String, default: "" },
    },
    status: {
      isActive: { type: Boolean, default: true },
      isApproved: { type: Boolean, default: true },
    },
    userId: { type: String, unique: true },
  },
  { timestamps: true }
);

export const Company = mongoose.model("Company", CompanySchema);
