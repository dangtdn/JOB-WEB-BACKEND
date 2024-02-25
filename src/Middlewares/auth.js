import { User } from "../Models/UserModel.js";
import jwt from "jsonwebtoken";

export const privateKey = process.env.JWT_SECRET || "nodejs-secret-key";

export const requireUser = async (token) => {
  try {
    if (!token) {
      throw new Error("You must be logged in to access this route");
    }

    const decoded = jwt.verify(token, privateKey);
    const userID = decoded == null ? void 0 : decoded._id;
    const user = await User.findOne({
      _id: userID,
    });
    if (!user) {
      throw new Error("You must be logged in to access this route");
    }
    return user;
  } catch (e) {
    throw e;
  }
};
export const requireCandidate = async (token) => {
  try {
    if (!token) {
      throw new Error("You must be logged in to access this route");
    }
    const decoded = jwt.verify(token, privateKey);
    const userID = decoded == null ? void 0 : decoded._id;
    const user = await User.findOne({
      _id: userID,
    });
    if (!user) {
      throw new Error("You must be logged in to access this route");
    }
    if (user.role.isCandidate || user.role.isAdmin) {
      return user;
    } else {
      throw new Error("You must be a candidate to access this route");
    }
  } catch (e) {
    throw e;
  }
};
export const requireEmployer = async (token) => {
  try {
    if (!token) {
      throw new Error("You must be logged in to access this route");
    }
    const decoded = jwt.verify(token, privateKey);
    const userID = decoded == null ? void 0 : decoded._id;
    const user = await User.findOne({
      _id: userID,
    });
    if (!user) {
      throw new Error("You must be logged in to access this route");
    }
    if (user.role.isEmployer || user.role.isAdmin) {
      return user;
    } else {
      throw new Error("You must be an employer to access this route");
    }
  } catch (e) {
    throw e;
  }
};
export const requireAdmin = async (token) => {
  try {
    if (!token) {
      throw new Error("You must be logged in to access this route");
    }
    const decoded = jwt.verify(token, privateKey);
    const userID = decoded == null ? void 0 : decoded._id;
    const user = await User.findOne({
      _id: userID,
    });
    if (!user) {
      throw new Error("You must be logged in to access this route");
    }
    if (user.role.isAdmin) {
      return user;
    } else {
      throw new Error("You must be a admin to access this route");
    }
  } catch (e) {
    throw e;
  }
};
