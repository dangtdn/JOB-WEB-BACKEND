import { requireCandidate, requireUser } from "../Middlewares/auth.js";
import {
  createEmail,
  findEmailByEmailType,
} from "../services/admin/emailService.js";
import {
  createResumeService,
  deleteResumeService,
  findAdminResumeService,
  findResumeService,
  getSingleResumeService,
  resumeStatusUpdateService,
  updateResumeService,
} from "../services/resumeService.js";

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
    } catch (error) {
      res.status(500).send({
        message: "Server error",
        error: error.message,
      });
    }
  },
  // find all resume handller private
  getResumePrivate: async (req, res, next) => {
    try {
      const { headers } = req;
      const accessToken = headers.authorization?.split(" ")[1];
      console.log("accessToken: ", accessToken);
      const resumes = await getResumePrivate(accessToken);

      res.status(200).send({
        message: "Successfully fetched all resumes",
        data: resumes,
      });
    } catch (e) {
      res.status(500).send({
        message: "Server error",
        error: e.message,
      });
    }
  },
  getSingleResume: async (req, res, next) => {
    try {
      const { id } = req.params;

      const resume = await getSingleResume(id);
      res.status(200).send({
        message: "Successfully get a resume",
        data: resume,
      });
    } catch (e) {
      res.status(500).send({
        message: "Server error",
        error: e.message,
      });
    }
  },
  //   // update resume image and file controller
  updateResume: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { headers } = req;
      const accessToken = headers.authorization?.split(" ")[1];
      const { files } = req;
      const requestFiles = files;
      let image = "";
      let docFile = "";
      if (requestFiles.image) {
        image = requestFiles.image[0]?.path;
      }
      if (requestFiles.docFile) {
        docFile = requestFiles.docFile[0]?.path;
      }
      const inputFiles = {
        image,
        docFile,
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
        resumeId: id,
      };
      const resume = await updateResume(reqQuery);

      res.status(200).send({
        message: "Successfully updated user",
      });
    } catch (e) {
      res.status(500).send({
        message: "Server error",
        error: e.message,
      });
    }
  },
  // delete resume controller
  deleteResume: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { headers } = req;
      const accessToken = headers.authorization?.split(" ")[1];

      const reqQuery = {
        accessToken,
        resumeId: id,
      };
      const company = await deleteResume(reqQuery);

      res.status(200).send({
        message: "Successfully deleted resume",
      });
    } catch (e) {
      res.status(500).send({
        message: "Server error",
        error: e.message,
      });
    }
  },
  // update status resume
  updateStattusResume: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { headers } = req;
      const accessToken = headers.authorization?.split(" ")[1];

      const rewQuery = {
        accessToken,
        resumeId: id,
        resumeStatus: req.body.status,
      };
      const message = await updateResumeStatus(rewQuery);

      res.status(200).send({
        message,
      });
    } catch (e) {
      res.status(500).send({
        message: "Server error",
        error: e.message,
      });
    }
  },
};

export default ResumeController;

// create resume controller
export async function createResume(reqQuery) {
  try {
    const { accessToken, resumeInput, inputFiles } = reqQuery;
    const user = await requireCandidate(accessToken);
    const userId = user._id;
    const resumeInputData = {
      user: userId,
      ...resumeInput,
    };
    const resume = await createResumeService(resumeInputData, inputFiles);
    // const emailType = "RESUME_PUBLISHED";
    // let emails;
    // emails = await findEmailByEmailType(emailType);
    // if (emails.length === 0) {
    //   const templateInput = {
    //     senderAddress: "Meta-Jobs",
    //     subject: "Your Resume is Live",
    //     message: "Congrats..!! Your Resume is published",
    //     emailType: "RESUME_PUBLISHED",
    //   };
    //   await createEmail(templateInput);
    //   emails = await findEmailByEmailType("RESUME_PUBLISHED");
    // }
    // const emailData = emails[0];
    // const inputEmailData = {
    //   userEmail: user.email,
    //   emailData,
    //   emailType,
    //   userId,
    // };
    // const mailInfo = sendNotificationEmail(inputEmailData);
    return resume;
  } catch (e) {
    throw e;
  }
}
// find all resume handller private
export async function getResumePrivate(accessToken) {
  try {
    const user = await requireCandidate(accessToken);
    const userID = user == null ? void 0 : user.id;
    console.log("user: ", userID);
    const adminRole = user.role.isAdmin;
    if (adminRole === true) {
      const resumes = await findAdminResumeService();
      return resumes;
    }
    const resumes1 = await findResumeService({
      user: userID,
    });
    return resumes1;
  } catch (e) {
    throw e;
  }
}
// find  resume  single
export async function getSingleResume(resumeId) {
  try {
    const resume = await getSingleResumeService(resumeId);
    return resume;
  } catch (e) {
    throw e;
  }
}
//   // update resume image and file controller
export async function updateResume(reqQuery) {
  try {
    const { accessToken, resumeInput, inputFiles, resumeId } = reqQuery;
    await requireCandidate(accessToken);
    const resume = await updateResumeService(resumeId, resumeInput, inputFiles);
    return resume;
  } catch (e) {
    throw e;
  }
}
// delete resume controller
export async function deleteResume(reqQuery) {
  try {
    const user = await requireCandidate(reqQuery.accessToken);
    const userId = user._id;
    console.log("reqQuery: ", reqQuery);
    const resumeId = reqQuery.resumeId;
    const resume = await deleteResumeService(resumeId);
    // const emailType = "RESUME_DELETED";
    // let emails;
    // emails = await findEmailByEmailType(emailType);
    // if (emails.length === 0) {
    //     const templateInput = {
    //         senderAddress: "Meta-Jobs",
    //         subject: "Your Resume is Deleted",
    //         message: "You have deleted a resume",
    //         emailType: "RESUME_DELETED"
    //     };
    //     await createEmail(templateInput);
    //     emails = await findEmailByEmailType("RESUME_DELETED");
    // }
    // const emailData = emails[0];
    // const inputEmailData = {
    //     userEmail: user.email,
    //     emailData,
    //     emailType,
    //     userId
    // };
    // const mailInfo = sendNotificationEmail(inputEmailData);
    return resume;
  } catch (e) {
    throw e;
  }
}
// resume status update
export async function updateResumeStatus(rewQuery) {
  try {
    const user = await requireUser(rewQuery.accessToken);
    const query = {
      userId: user._id,
      adminRole: user.role.isAdmin,
      resumeId: rewQuery.resumeId,
      resumeStatus: rewQuery.resumeStatus,
    };
    const resume = await resumeStatusUpdateService(query);
    return resume;
  } catch (e) {
    throw e;
  }
}
