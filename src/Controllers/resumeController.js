import { requireCandidate } from "../Middlewares/auth.js";
import ResumeModel from "../Models/ResumeModel.js";
import {
  createEmail,
  findEmailByEmailType,
} from "../services/admin/emailService.js";
import { createResumeService } from "../services/resumeService.js";

const ResumeController = {
  // create resume controller
  createResume: async (req, res, next) => {
    try {
      const { headers } = req;
      const accessToken = headers.authorization?.split(" ")[1];

      const { files } = req;
      const requestFiles = files;
      let image = "";
      let resumeFile = "";
      if (requestFiles.image) {
        image = requestFiles.image[0]?.path;
      }
      if (requestFiles.resumeFile) {
        resumeFile = requestFiles.resumeFile[0]?.path;
      }
      const inputFiles = {
        image,
        resumeFile,
      };
      let sortSkills = [];
      if (req.body.skills.length !== 0 && req.body.skills) {
        sortSkills = JSON.parse(req.body.skills);
      }
      const resumeInput = {
        name: req.body.fullName,
        email: req.body.email,
        region: req.body.region,
        professionalTitle: req.body.professionalTitle,
        location: req.body.location,
        video: req.body.video,
        category: req.body.category,
        workingRate: req.body.workingRate,
        education: JSON.parse(req.body.education),
        resumeContent: req.body.resumeContent,
        skills: sortSkills,
        url: JSON.parse(req.body.url),
        experience: JSON.parse(req.body.experience),
      };

      const reqQuery = {
        accessToken,
        resumeInput,
        inputFiles,
      };
      const resume = await createResume(reqQuery);
      res.status(200).send({
        message: "Successfully created a resume",
      });
      next();
    } catch (error) {
      res.status(500).send({
        message: "Server error",
        error: error.message,
      });
      next(error);
    }
  },
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
      // const adminRole = req.body.user.role.isAdmin;
      // const userID = req.body.user.userId;
      // if (adminRole === true) {
      //   const resumes = await ResumeModel.find({}).lean(true);
      //   return res.status(201).json({
      //     success: true,
      //     resumes,
      //   });
      // }
      const resumes = await ResumeModel.find();
      res.status(201).send({
        success: true,
        resumes,
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

// create resume controller
export async function createResume(reqQuery) {
  try {
    const { accessToken, resumeInput, inputFiles } = reqQuery;
    const user = await requireCandidate(accessToken);
    const userId = user.id;
    const resumeInputData = {
      userId,
      ...resumeInput,
    };
    const resume = await createResumeService(resumeInputData, inputFiles);
    const emailType = "RESUME_PUBLISHED";
    let emails;
    emails = await findEmailByEmailType(emailType);
    if (emails.length === 0) {
      const templateInput = {
        senderAddress: "Meta-Jobs",
        subject: "Your Resume is Live",
        message: "Congrats..!! Your Resume is published",
        emailType: "RESUME_PUBLISHED",
      };
      await createEmail(templateInput);
      emails = await findEmailByEmailType("RESUME_PUBLISHED");
    }
    const emailData = emails[0];
    const inputEmailData = {
      userEmail: user.email,
      emailData,
      emailType,
      userId,
    };
    const mailInfo = sendNotificationEmail(inputEmailData);
    return resume;
  } catch (e) {
    throw e;
  }
}
