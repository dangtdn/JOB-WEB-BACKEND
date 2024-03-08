import express from "express";
import bookmarkController from "../Controllers/bookmarkController.js";

const { createBookmark, getBookmarks, checkBookmark, deleteBookmark } =
  bookmarkController;
const router = express.Router();

//bookmark type routes

// /api/bookmark/create
router.post("/user/bookmark", createBookmark);
// /api/bookmarks
router.get("/bookmarks", getBookmarks);
// /api/bookmark/:id
router.get("/user/bookmark/find/:id", checkBookmark);
// /api/bookmark/:id
router.delete("/user/bookmark/:id", deleteBookmark);

export default router;
