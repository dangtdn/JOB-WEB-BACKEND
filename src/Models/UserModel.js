import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
    },
    email: {
      type: String,
      required: [true, "Email can not empty!!!"],
      index: true,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      required: [true, "Password can not empty!!!"],
    },
    isConfirmed: {
      type: Boolean,
    },
    resetLink: {
      data: String,
      default: "",
    },
    avatar: {
      type: String,
    },
    cloudinary_id: {
      type: String,
    },
    role: {
      isCandidate: {
        type: Boolean,
      },
      isEmployer: {
        type: Boolean,
      },
      isAdmin: {
        type: Boolean,
      },
    },
    phoneNumber: {
      type: String,
      default: "",
    },
    aboutMe: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
