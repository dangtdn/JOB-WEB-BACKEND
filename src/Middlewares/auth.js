import jwt from "jsonwebtoken";
import { User } from "../Models/UserModel.js";
import ErrorResponse from "../utils/errorResponse.js";

// check is user is authenticated
export const isAuthenticated = async (req, res, next) => {
  // const { token } = req.cookies;
  const { headers } = req;
  console.log("headers", headers);
  const token = headers.authorization?.substring(
    7,
    headers.authorization.length
  );
  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
  next();

  // try {
  //   // Verify token
  //   // const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //   // req.user = await User.findById(decoded.id);
  //   // const user = await getUser(req, next);
  //   next();
  // } catch (error) {
  //   return next(new ErrorResponse("Not authorized to access this route", 401));
  // }
};

//middleware for admin
export const isAdmin = async (req, res, next) => {
  // console.log("req.user: ", req.user);
  // if (req.user.role === 0) {
  //   return next(new ErrorResponse("Access denied, you must an admin", 403));
  // }
  // next();

  // const { headers } = req;
  // const token = headers.authorization?.substring(
  //   7,
  //   headers.authorization.length
  // );
  // // Make sure token exists
  // if (!token) {
  //   return next(new ErrorResponse("Not authorized to access this route", 401));
  // }

  try {
    // Verify token
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = await User.findById(decoded.id);
    const user = await getUser(req, next);
    if (user.role.isAdmin) {
      return next(new ErrorResponse("Access denied, you must an admin", 403));
    }
    next();
  } catch (error) {
    return next(new ErrorResponse("Access denied, you must an admin", 403));
  }
};

export const getUser = async (req, next) => {
  const { headers } = req;
  const token = headers.authorization?.substring(
    7,
    headers.authorization.length
  );
  console.log("token: ", token);
  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded: ", decoded);
    const user = await User.findById(decoded.id);
    console.log("user: ", user);
    if (!user) {
      return next(
        new ErrorResponse("You must be logged in to access this route", 412)
      );
    }

    return user;
  } catch (error) {
    return next(
      new ErrorResponse("You must be logged in to access this route", 412)
    );
  }
};
