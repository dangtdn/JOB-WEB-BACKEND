import multer from "multer";
import path from "path";

// Multer config
const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    console.log("file: ", file);
    if (
      ext !== ".jpg" &&
      ext !== ".jpeg" &&
      ext !== ".png" &&
      ext !== ".webp" &&
      ext !== ".svg" &&
      ext !== ".pdf" &&
      ext !== ".doc" &&
      ext !== ".docx"
    ) {
      cb(new Error("File type is not supported"), false);
      return;
    }
    cb(null, true);
  },
});

export default upload;
