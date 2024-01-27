import mongoose from "mongoose";

const emailSchema = new mongoose.Schema({
  senderAddress: {
    type: String,
    required: true,
  },
  senderEmail: {
    type: String,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  emailType: {
    type: String,
    required: true,
    unique: true,
  },
});

const EmailModel = mongoose.model("EmailModel", emailSchema);
export default EmailModel;
