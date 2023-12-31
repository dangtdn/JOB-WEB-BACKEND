import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

const jobsHistorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      maxlength: 70,
    },
    description: {
      type: String,
      trim: true,
    },
    salaryRange: {
      maximum: { type: Number, required: [true, "Salary is required"] },
      minimum: { type: Number, required: [true, "Salary is required"] },
    },
    location: {
      type: String,
    },
    interviewDate: {
      type: Date,
    },
    applicationStatus: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },

    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

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
    jobsHistory: [jobsHistorySchema],
  },
  { timestamps: true }
);

//encrypting password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// compare user password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// return a JWT token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: 3600,
  });
};

export const User = mongoose.model("User", userSchema);
