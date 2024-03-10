import { signJwt } from "../Middlewares/jwt.utils.js";
import { userPasswordValidate } from "../Middlewares/validateUser.js";
import { User } from "../Models/UserModel.js";
import Cloud from "../utils/cloudinary.js";
import { hashPw } from "../utils/hashPw.js";

// user login service
export async function loginUserService(input) {
  try {
    const { password, email } = input;
    const user = await userPasswordValidate({
      email,
      password,
    });
    if (!user) {
      throw new Error("Invalid Authentication");
    }
    const userId = user._id;
    const accessToken = signJwt({
      _id: userId,
    });
    return {
      accessToken,
    };
  } catch (e) {
    throw e;
  }
}
// create user service
export async function createUserService(input) {
  try {
    const { password } = input;
    const hash = await hashPw(password);
    const inputData = {
      ...input,
      password: hash,
    };
    const user = await User.create(inputData);
    return user;
  } catch (e) {
    throw e;
  }
}
// update user service
export async function updateUserService(userId, update, imageData) {
  try {
    let userUpdate = null;
    if (imageData) {
      const userPreviousData = await User.findById(userId);
      if (userPreviousData == null ? void 0 : userPreviousData.cloudinary_id) {
        await Cloud.uploader.destroy(userPreviousData.cloudinary_id);
      }
      // Upload image to cloudinary
      const result = await Cloud.uploader.upload(imageData);
      const imageInput = {
        avatar: result.secure_url,
        cloudinary_id: result.public_id,
      };
      userUpdate = {
        ...update,
        ...imageInput,
      };
    } else {
      userUpdate = {
        ...update,
      };
    }
    const user = await User.findByIdAndUpdate(userId, userUpdate, {
      new: true,
    });
    return user;
  } catch (e) {
    throw e;
  }
}
// get user service
export async function getUserService(userID) {
  try {
    // populates package
    const user = await User.findOne({ _id: userID }).lean(true);
    const { password, __v, createdAt, updatedAt, ...filteredUser } = user;
    return filteredUser;
  } catch (e) {
    throw e;
  }
}
// get user by query service
export async function getUserByQueryService(query) {
  try {
    return await User.findOne(query).lean();
  } catch (e) {
    throw e;
  }
}
// reset password service
export async function updatePasswordService(userId, input) {
  try {
    const inputPassword = input.newPassword;
    const hash = await hashPw(inputPassword);
    const userPassword = await User.findByIdAndUpdate(
      {
        _id: userId,
      },
      {
        password: hash,
      },
      {
        new: true,
      }
    );
    return userPassword;
  } catch (e) {
    throw e;
  }
}
