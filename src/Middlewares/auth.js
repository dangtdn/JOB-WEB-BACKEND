import jwt from "jsonwebtoken";
import { User } from "../Models/UserModel.js";
import ErrorResponse from "../utils/errorResponse.js";

// check is user is authenticated
export const isAuthenticated = async (req, res, next) => {
  const { headers } = req;
  const token = headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded: ", decoded);
    // const userID = decoded == null ? void 0 : decoded._id;
    // const user = await User.findById(userID);
    // if (!user) {
    //   return next(new ErrorResponse("Invalid token", 401));
    // }

    // // Lưu thông tin về user vào request để sử dụng ở middleware khác nếu cần
    // req.user = user;

    next();
  } catch (error) {
    return next(new ErrorResponse("Invalid token 2", 401));
  }
};

//middleware for admin
export const isAdmin = async (req, res, next) => {
  const { headers } = req;
  const token = headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    console.log("user.role.isAdmin: ", user.role.isAdmin);

    if (!user || !user.role || !user.role.isAdmin) {
      return next(
        new ErrorResponse("Access denied, you must be an admin", 403)
      );
    }

    // Lưu thông tin về user vào request để sử dụng ở middleware khác nếu cần
    req.user = user;

    next();
  } catch (error) {
    return next(new ErrorResponse("Access denied, you must be an admin", 403));
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
    // console.log("user: ", user);
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
