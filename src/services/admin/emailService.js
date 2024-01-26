import { sendSingleEmail } from "../../utils/nodeMailerSingle";
import EmailModel from "../../models/admin/email.model";
import connectDB from "../../utils/connect";
export async function sendContactEmail(input) {
  try {
    await connectDB();
    const email = await sendSingleEmail(input);
    return true;
  } catch (e) {
    throw e;
  }
}
// find  email by emailType
export async function findEmailByEmailType(emailType) {
  try {
    await connectDB();
    const email = await EmailModel.find({
      emailType: emailType,
    }).lean(true);
    return email;
  } catch (e) {
    throw e;
  }
}
// create a email services for admin seetings
export async function createEmail(input) {
  try {
    await connectDB();
    const email = await EmailModel.create(input);
    return email;
  } catch (e) {
    throw e;
  }
}
// update a email by id
export async function updateEmail(emailQuery, input) {
  try {
    await connectDB();
    const email = await EmailModel.findOneAndUpdate(emailQuery, input, {
      new: true,
    });
    return email;
  } catch (e) {
    throw e;
  }
}
