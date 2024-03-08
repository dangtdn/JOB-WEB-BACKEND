import { requireUser } from "../Middlewares/auth.js";
import {
  checkBookmarkService,
  createBookmarkService,
  deleteBookmarkService,
  findBookmarks,
} from "../services/bookmarkService.js";

const bookmarkController = {
  //create a bookmarks
  createBookmark: async (req, res, next) => {
    try {
      const { headers } = req;
      const accessToken = headers.authorization?.split(" ")[1];

      const reqQuery = {
        accessToken,
        body: {
          ...req.body,
        },
      };
      const bookmark = await createBookmark(reqQuery);

      res.status(200).send({
        message: "Bookmark successfully created",
      });
    } catch (e) {
      res.status(500).send({
        message: "Server Error",
        error: e.message,
      });
    }
  },

  //get all bookmarks of an user
  getBookmarks: async (req, res, next) => {
    try {
      const { headers } = req;
      const accessToken = headers.authorization?.split(" ")[1];
      const bookmarks = await getBookmarks(accessToken);

      if (bookmarks[0].bookmarks.length == 0) {
        return res.status(200).send({
          message: "No Bookmark Found",
          data: [],
        });
      }
      res.status(200).send({
        message: "Successfully find all bookmarks",
        data: bookmarks[0].bookmarks,
      });
    } catch (e) {
      res.status(500).send({
        message: "Server Error",
        error: e.message,
      });
    }
  },

  //check a bookmark by job-id
  checkBookmark: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { headers } = req;
      const accessToken = headers.authorization?.split(" ")[1];
      const reqQuery = {
        accessToken,
        bookmarkId: id,
      };

      const bookmarkData = await checkBookmark(reqQuery);

      if (!bookmarkData.isBookmark) {
        return res.status(200).send({
          message: "Bookmark not found",
          data: bookmarkData,
        });
      }

      res.status(200).send({
        message: "Bookmark status found",
        data: bookmarkData,
      });
    } catch (e) {
      res.status(500).send({
        message: "Server Error",
        error: e.message,
      });
    }
  },

  //delete a bookmark by job-id
  deleteBookmark: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { headers } = req;
      const accessToken = headers.authorization?.split(" ")[1];
      const reqQuery = {
        accessToken,
        bookmarkId: id,
      };
      const bookmark = await deleteBookmark(reqQuery);
      if (!bookmark) {
        return res.status(404).send({
          message: "Bookmark Not Found",
        });
      }
      return res.status(200).send({
        message: "Bookmark Deleted",
      });
    } catch (e) {
      res.status(500).send({
        message: "Server Error",
        error: e.message,
      });
    }
  },
};

export default bookmarkController;

export async function createBookmark(reqQuery) {
  try {
    const { accessToken, body } = reqQuery;
    const user = await requireUser(accessToken);
    const userID = user._id;
    const input = {
      user: userID,
      bookmarks: {
        ...body,
      },
    };
    const bookmark = await createBookmarkService(input);
    return bookmark;
  } catch (e) {
    throw e;
  }
}
// find all private bookmarks
export async function getBookmarks(accessToken) {
  try {
    const user = await requireUser(accessToken);
    const userID = user == null ? void 0 : user.id;
    const bookmarks = await findBookmarks(userID);
    return bookmarks;
  } catch (e) {
    throw e;
  }
}
// check a bookmark by job-id
export async function checkBookmark(reqQuery) {
  try {
    const { accessToken, bookmarkId } = reqQuery;
    const user = await requireUser(accessToken);
    const userID = user._id;
    const query = {
      user: userID,
      bookmarkId,
    };
    const bookmark = await checkBookmarkService(query);
    if (bookmark.length == 0) {
      const bookmarkData = {
        isBookmark: false,
      };
      return bookmarkData;
    }
    const bookmarkData1 = {
      isBookmark: true,
    };
    return bookmarkData1;
  } catch (e) {
    throw e;
  }
}
// delete a bookmark handller
export async function deleteBookmark(reqQuery) {
  try {
    const { accessToken, bookmarkId } = reqQuery;
    const user = await requireUser(accessToken);
    const userId = user == null ? void 0 : user.id;
    const query = {
      user: userId,
      bookmarkId: bookmarkId,
    };
    const bookmark = await deleteBookmarkService(query);
    return bookmark;
  } catch (e) {
    throw e;
  }
}
