import BookmarkModel from "../Models/bookmarkModel.js";

// find all bookmarks service
export async function findBookmarks(query) {
  try {
    // find bookmark and populdated the nested array
    const bookmarks = await BookmarkModel.find({
      user: query,
    })
      .populate({
        path: "bookmarks",
        populate: {
          path: "resume",
          select: ["name"],
        },
      })
      .populate({
        path: "bookmarks",
        populate: {
          path: "job",
          select: ["jobTitle"],
        },
      })
      .populate({
        path: "bookmarks",
        populate: {
          path: "company",
          select: ["companyName"],
        },
      });
    return bookmarks;
  } catch (e) {
    throw e;
  }
}
// create a bookmark service
export async function createBookmarkService(input) {
  try {
    // find bookmark by user id
    const bookmark = await BookmarkModel.findOne({
      user: input.user,
    });
    if (bookmark) {
      // update bookmarks by user id
      const bookmarkData = await BookmarkModel.findOneAndUpdate(
        {
          user: input.user,
        },
        {
          $push: {
            bookmarks: input.bookmarks,
          },
        },
        {
          new: true,
        }
      );
      return bookmarkData;
    } else {
      // create a new bookmark
      const bookmarkData1 = await BookmarkModel.create(input);
      return bookmarkData1;
    }
  } catch (e) {
    throw e;
  }
}
// get a bookmark by job-id service
export async function checkBookmarkService(query) {
  try {
    const bookmark = await BookmarkModel.find({
      user: query.user,
      $or: [
        {
          "bookmarks.job": query.bookmarkId,
        },
        {
          "bookmarks.resume": query.bookmarkId,
        },
        {
          "bookmarks.company": query.bookmarkId,
        },
      ],
    });
    return bookmark;
  } catch (e) {
    throw e;
  }
}
// delete a bookmark service
export async function deleteBookmarkService(query) {
  try {
    const bookmark = await BookmarkModel.updateMany({
      $pull: {
        bookmarks: {
          $or: [
            {
              resume: query.bookmarkId,
            },
            {
              job: query.bookmarkId,
            },
            {
              company: query.bookmarkId,
            },
          ],
        },
      },
    });
    return bookmark;
  } catch (e) {
    throw e;
  }
}
