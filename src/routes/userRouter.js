import express from "express";
import userController from "../Controllers/userController.js";

const {
  allUsers,
  singleUser,
  updateUser,
  deleteUser,
  createUserJobsHistory,
  getDashboardStat,
  updatePassword,
} = userController;
const router = express.Router();

//user routes
// /api/allusers
router.get("/admin/users", allUsers);
// /api/user/id
router.get("/current-user", singleUser);
// /api/user/statistics
router.get("/statistics", getDashboardStat);
// /api/user/update/id
router.put("/admin/user/update/:id", updateUser);
// /api/user/update/id
router.put("/users/password/reset", updatePassword);
// /api/admin/user/delete/id
router.delete("/admin/user/delete/:id", deleteUser);
// /api/user/jobhistory
router.post("/user/job-histories", createUserJobsHistory);

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
