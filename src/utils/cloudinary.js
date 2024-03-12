import cloudinary from "cloudinary";
import dotenv from "dotenv";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const Cloud = cloudinary.v2;
dotenv.config();

Cloud.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// const storage = new CloudinaryStorage({
//   cloudinary: newCloudinary,
//   allowedFormats: ["jpg", "png"],
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// const Cloud = multer({ storage });

export default Cloud;
