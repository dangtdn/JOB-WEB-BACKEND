import bcrypt from "bcryptjs";
import { getUserByQueryService } from "../services/userService.js";

export const userExistValidate = async (queryInput) => {
  try {
    if (queryInput == null ? void 0 : queryInput.email) {
      const email = queryInput.email;
      const user = await getUserByQueryService({
        email,
      });
      return user;
    }
  } catch (e) {
    throw e;
  }
};
export const userPasswordValidate = async ({ email, password }) => {
  try {
    const user = await getUserByQueryService({
      email,
    });
    if (!user) {
      throw new Error("Incorrect email!");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Incorrect password!");
    }
    return user;
  } catch (e) {
    throw e;
  }
};
