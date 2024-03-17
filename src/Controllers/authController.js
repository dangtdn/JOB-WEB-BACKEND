import { privateKey } from "../Middlewares/auth.js";
import { userExistValidate } from "../Middlewares/validateUser.js";
import { User } from "../Models/UserModel.js";
import jwt from "jsonwebtoken";
import {
  createUserService,
  loginUserService,
} from "../services/userService.js";

const authController = {
  signup: async (req, res, next) => {
    try {
      const user = await createUser(req.body);

      res.status(200).send({
        message: "Successfully Created User",
        user,
      });
    } catch (e) {
      res.status(500).send({
        message: e.message,
        error: e.message,
      });
    }
  },

  signin: async (req, res, next) => {
    try {
      const { accessToken } = await loginUser(req.body);

      res
        .cookie("token", accessToken, {
          maxAge: 600 * 600 * 1000,
          httpOnly: true,
        })
        .status(200)
        .send({
          message: "Successfully user logged in",
          token: accessToken,
        });
    } catch (e) {
      res.status(500).send({
        message: e.message,
        error: e.message,
      });
    }
  },
};

export default authController;

// login user controller
export async function loginUser(reqQuery) {
  try {
    const hasUser = await userExistValidate({
      email: reqQuery.email,
    });
    if (!hasUser) {
      throw new Error("User does not exist");
    }
    const accessToken = await loginUserService(reqQuery);
    return accessToken;
  } catch (e) {
    throw e;
  }
}
// create user controller
export async function createUser(reqQuery) {
  try {
    const hasUser = await userExistValidate({
      email: reqQuery.email,
    });
    if (hasUser) {
      throw new Error("User Already Exist");
    }
    const user = await createUserService(reqQuery);
    const userId = user._id;
    return user;
  } catch (e) {
    throw e;
  }
}
