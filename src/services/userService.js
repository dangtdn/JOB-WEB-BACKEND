import { User } from "../Models/UserModel.js";
import Cloud from "../utils/cloudinary.js";

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
    const user = await User.findOne({
      _id: userID,
    }) // .populate('package', ['validity', 'totalJobs', 'featuredJobs'])
      .lean(true);
    return _.omit(user, ["password", "__v", "createdAt", "updatedAt"]);
  } catch (e) {
    throw e;
  }
}
