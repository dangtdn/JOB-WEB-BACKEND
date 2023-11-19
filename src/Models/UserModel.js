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
    account: {
      type: String,
      required: [true, "Account can not empty!!!"],
      index: { unique: true },
    },
    password: {
      type: String,
      required: [true, "Password can not empty!!!"],
    },
    firstName: {
      type: String,
      required: [true, "First Name can not empty!!!"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name can not empty!!!"],
    },
    role: {
      type: String,
      required: [true, "Role can not empty!!!"],
    },
    image: {
      url: {
        type: String,
        required: [true, "Image can not empty!!!"],
      },
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female"],
        message: "Gender must be a male or female!!!",
      },
      required: [true, "Gender can not empty!!!"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number can not empty!!!"],
      minLength: 10,
      maxLength: 10,
    },
    birthday: {
      type: String,
      required: [true, "Birth day can not empty!!!"],
    },
    location: {
      type: String,
      required: [true, "Location can not empty!!!"],
    },
    active: {
      type: Boolean,
      default: true,
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
