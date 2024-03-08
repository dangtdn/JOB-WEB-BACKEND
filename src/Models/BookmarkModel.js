import mongoose from "mongoose";
const bookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  bookmarks: [
    {
      job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
      company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
      },
      resume: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ResumeModel",
      },
      note: {
        type: String,
        default: "",
      },
    },
  ],
});
const BookmarkModel = mongoose.model("Bookmark", bookmarkSchema);
export default BookmarkModel;
