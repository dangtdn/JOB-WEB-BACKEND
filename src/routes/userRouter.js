import express from "express";
import userController from "../Controllers/userController.js";
import { isAdmin, isAuthenticated } from "../Middlewares/auth.js";

const {
  allUsers,
  singleUser,
  editUser,
  deleteUser,
  createUserJobsHistory,
  getDashboardStat,
} = userController;
const router = express.Router();

//user routes
// /api/allusers
router.get("/admin/users", isAuthenticated, isAdmin, allUsers);
// /api/user/id
router.get("/user/:id", isAuthenticated, singleUser);
// /api/user/statistics
router.get("/user/statistics", getDashboardStat);
// /api/user/update/id
router.put("/admin/user/update/:id", isAuthenticated, isAdmin, editUser);
// /api/admin/user/delete/id
router.delete("/admin/user/delete/:id", isAuthenticated, isAdmin, deleteUser);
// /api/user/jobhistory
router.post("/user/job-histories", isAuthenticated, createUserJobsHistory);

// router.post("/upload", (req, res) => {
//   // Get the file that was set to our field named "image"
//   const { image } = req.files;

//   console.log("image: ", JSON.stringtify(image));

//   // // If no image submitted, exit
//   if (!image) return res.sendStatus(400);

//   // // If does not have image mime type prevent from uploading
//   if (/^image/.test(image.mimetype)) return res.sendStatus(400);

//   // // Move the uploaded image to our upload folder
//   image.mv(__dirname + "/upload/" + image.name);

//   console.log("imagemv: ", image);
//   // All good
//   res.sendStatus(200);
// });

export default router;
