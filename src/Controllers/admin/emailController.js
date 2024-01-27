import connectDB from "../../utils/connect";
import { requireAdmin } from "../../middleware/authenticate";
import {
  findEmailByEmailType,
  updateEmail,
} from "../../services/admin/emailService.js";
// get a email by emailType
export async function getEmailSettings(reqQuery) {
  try {
    await connectDB();
    await requireAdmin(reqQuery.accessToken);
    const emailType = reqQuery.emailType;
    const email = await findEmailByEmailType(emailType);
    if (!email) {
      throw new Error("Email Not Found");
    }
    return email;
  } catch (e) {
    throw e;
  }
}
// update a email by emailType
export async function updateEmailSettings(reqQuery) {
  try {
    await connectDB();
    await requireAdmin(reqQuery.accessToken);
    const emailQuery = {
      emailType: reqQuery.emailType,
    };
    const input = {
      ...reqQuery.body,
    };
    const email = await updateEmail(emailQuery, input);
    if (!email) {
      throw new Error("Email Not Found");
    }
    return email;
  } catch (e) {
    throw e;
  }
}
