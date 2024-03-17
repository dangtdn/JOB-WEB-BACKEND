import { Formidable } from "formidable";
import { requireUser } from "../Middlewares/auth.js";
import { userPasswordValidate } from "../Middlewares/validateUser.js";
import { User } from "../Models/UserModel.js";
import { getDashboardStat } from "../services/dashboardService.js";
import {
  getUserService,
  updatePasswordService,
  updateUserService,
} from "../services/userService.js";
import ErrorResponse from "../utils/errorResponse.js";
import jwt from "jsonwebtoken";

const userController = {
  //load all users
  allUsers: async (req, res, next) => {
    //enable pagination
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    const count = await User.find({}).estimatedDocumentCount();

    try {
      const users = await User.find()
        .sort({ createdAt: -1 })
        .select("-password")
        .skip(pageSize * (page - 1))
        .limit(pageSize);

      res.status(200).send({
        success: true,
        users,
        page,
        pages: Math.ceil(count / pageSize),
        count,
      });
    } catch (e) {
      res.status(500).send({
        message: "Server Error",
        error: e.message,
      });
    }
  },

  //show single user
  singleUser: async (req, res, next) => {
    try {
      const { headers } = req;
      const accessToken = headers.authorization?.split(" ")[1];
      const user = await getUser(accessToken);
      res.status(200).send({
        message: "Successfully fetched user",
        user,
      });
    } catch (e) {
      res.status(500).send({
        message: "Server Error",
        error: e.message,
      });
    }
  },

  //edit user
  updateUser: async (req, res, next) => {
    try {
      const { headers } = req;
      const accessToken = headers.authorization?.split(" ")[1];

      const { file } = req;
      const imageData = file?.path;

      console.log(("req: ", req));
      console.log("imageData: ", imageData);
      const userData = {
        fullName: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
        },
        email: req.body?.email,
        phoneNumber: req.body?.phoneNumber,
        aboutMe: req.body?.aboutMe,
      };

      const reqQuery = {
        accessToken,
        userData,
      };

      const user = await updateUser(reqQuery, imageData);

      res.status(200).send({
        message: "Successfully updated user",
      });
    } catch (e) {
      res.status(500).send({
        message: "Server Error",
        error: e.message,
      });
    }
  },

  //delete user
  deleteUser: async (req, res, next) => {
    try {
      const user = await User.findByIdAndRemove(req.params.id);
      res.status(200).send({
        message: "Successfully deleted user",
      });
    } catch (e) {
      res.status(500).send({
        message: "Server Error",
        error: e.message,
      });
    }
  },

  //get user dashboard statistics
  getDashboardStat: async (req, res, next) => {
    try {
      const { headers } = req;
      const token = headers.authorization?.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded._id);
      console.log("user: ", user);
      const data = await getDashboardStat(user);
      console.log("data: ", data);
      res.status(200).send({
        success: true,
        message: "Successfully fetched user dashboard statistics",
        data,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error: error.message,
      });
    }
  },

  // reset password
  updatePassword: async (req, res, next) => {
    try {
      const { headers } = req;
      const accessToken = headers.authorization?.split(" ")[1];

      const userInput = {
        currentPassword: req.body.currentPassword,
        newPassword: req.body.newPassword,
      };
      const reqQuery = {
        accessToken,
        userInput,
      };
      const userPassword = await updatePassword(reqQuery);

      res.status(200).send({
        message: "Successfully reset password",
      });
    } catch (e) {
      res.status(500).send({
        message: e.message,
        error: e.message,
      });
    }
  },
};

export default userController;

// update UserHandler
export async function updateUser(reqQuery, imageData) {
  try {
    const userInfo = await requireUser(reqQuery.accessToken);
    const userId = userInfo._id;
    const userInput = {
      ...reqQuery.userData,
    };
    const user = await updateUserService(userId, userInput, imageData);
    return user;
  } catch (e) {
    throw e;
  }
}
// create user controller
export async function getUser(accessToken) {
  try {
    const userInfo = await requireUser(accessToken);
    const userID = userInfo._id;
    const user = await getUserService(userID);
    return user;
  } catch (e) {
    throw e;
  }
}
// reset password Handler
export async function updatePassword(reqQuery) {
  try {
    const { accessToken, userInput } = reqQuery;
    const userInfo = await requireUser(accessToken);
    const userId = userInfo._id;
    const userEmail = userInfo.email;
    const userDetails = {
      password: userInput.currentPassword,
      email: userEmail,
    };
    const user = await userPasswordValidate(userDetails);
    if (!user) {
      throw new Error("Invalid current password");
    }
    const userPassword = await updatePasswordService(userId, userInput);
    return userPassword;
  } catch (e) {
    throw e;
  }
}
