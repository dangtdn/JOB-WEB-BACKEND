import ResumeModel from "../Models/ResumeModel.js";

const ResumeController = {
  // create resume controller
  createResume: async (req, res, next) => {},
  // find all resume handller private
  getResumePrivate: async (req, res, next) => {
    try {
      //   body = {
      //       user: {
      //           userId: string;
      //           role: {
      //               isCandidate: {
      //                 type: Boolean,
      //               },
      //               isEmployer: {
      //                 type: Boolean,
      //               },
      //               isAdmin: {
      //                 type: Boolean,
      //               },
      //             },
      //       }
      //   }
      const adminRole = req.body.user.role.isAdmin;
      const userID = req.body.user.userId;
      if (adminRole === true) {
        const resumes = await ResumeModel.find({}).lean(true);
        return res.status(201).json({
          success: true,
          resumes,
        });
      }
      const resumes1 = await ResumeModel.find({
        user: userID,
      });
      res.status(201).json({
        success: true,
        resumes1,
      });
    } catch (error) {
      next(error);
    }
  },
  // resume status update
  updateResumeStatus: async (req, res, next) => {},
  //   // update resume image and file controller
  updateResume: async (req, res, next) => {},
  // delete resume controller
  deleteResume: async (req, res, next) => {},
};

export default ResumeController;
