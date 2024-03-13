import { requireCandidate } from "../Middlewares/auth.js";
import { sendNotificationEmail } from "../Middlewares/nodeMailer.js";
import JobApply from "../Models/JobApplyModel.js";
import { findEmailByEmailType } from "../services/admin/emailService.js";
import {
  createJobApplyService,
  findApplications,
  getJobApplicationsService,
} from "../services/jobApplyService.js";

const JobApplyController = {
  // create JobApply
  createJobApply: async (req, res, next) => {
    try {
      const { file } = req;
      const cvFile = file?.path;
      const { headers } = req;
      const accessToken = headers.authorization?.split(" ")[1];
      const reqQuery = {
        accessToken,
        applyData: req.body,
        cvFile,
      };
      const job = await createJobApply(reqQuery);
      res.status(200).send({
        message: "You have successfully applied a job",
      });
    } catch (e) {
      res.status(500).send({
        message: "Server Error",
        error: e.message,
      });
    }
  },

  // get user apply
  getUserApplication: async (req, res, next) => {
    try {
      const { id } = req.params;
      const applications = await findApplications({
        user: id,
      });
      res.status(200).send({
        message: "Successfully fetched all applications for this user",
        data: applications,
      });
    } catch (e) {
      res.status(500).send({
        message: "Server Error",
        error: e.message,
      });
    }
  },

  // get job apply
  getJobApplication: async (req, res, next) => {
    try {
      const jobID = req.params.id;
      const applicationResult = await getJobApplicationsService(jobID);
      const data = {
        applications: applicationResult.applications,
        totalApplyCount: applicationResult.applyCount,
      };
      res.status(200).json({
        message: "Successfully find all applications of this job",
        data,
      });
    } catch (e) {
      res.status(500).send({
        message: "Server Error",
        error: e.message,
      });
    }
  },

  // update status job apply
  updateApplyStatus: async (req, res, next) => {
    try {
      const jobID = req.params.id;
      const applyData = {
        status: req.body.status,
      };
      const application = await updateApplyStatusService(applyId, applyData);
      res.status(201).json({
        message: "Application Updated",
        success: true,
        application,
      });
    } catch (e) {
      res.status(500).send({
        message: "Server Error",
        error: e.message,
      });
    }
  },

  //delete job apply
  deleteUserApplication: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { headers } = req;
      const accessToken = headers.authorization?.split(" ")[1];
      const reqQuery = {
        accessToken,
        applicatioId: id,
      };
      const application = await deleteUserApplication(reqQuery);

      res.status(200).send({
        message: "Successfully deleted application",
      });
    } catch (e) {
      res.status(500).send({
        message: "Server Error",
        error: e.message,
      });
    }
  },
};

export default JobApplyController;

// create job handller
export async function createJobApply(reqQuery) {
  try {
    const { accessToken, applyData, cvFile } = reqQuery;
    const user = await requireCandidate(accessToken);
    const userId = user._id;
    // const userEmail = user.email;
    const applyDataInput = {
      ...applyData,
      user: userId,
    };
    const jobApply = await createJobApplyService(applyDataInput, cvFile);
    // let emails;
    // emails = await findEmailByEmailType("JOB_APPLIED");
    // if (emails.length === 0) {
    //   const templateInput = {
    //     senderAddress: "Meta Jobs",
    //     subject: "Job is Applied",
    //     message: "Congrats..!! Your have applied a Job",
    //     emailType: "JOB_APPLIED",
    //   };
    //   await createEmail(templateInput);
    //   emails = await findEmailByEmailType("JOB_APPLIED");
    // }
    // const emailData = emails[0];
    // const approvalInput = {
    //   userEmail: userEmail,
    //   emailData,
    //   userId,
    //   emailType: "JOB_APPLIED",
    // };
    // await sendNotificationEmail(approvalInput);
    return jobApply;
  } catch (e) {
    throw e;
  }
}

// delete job apply
export async function deleteUserApplication(reqQuery) {
  try {
    await requireCandidate(reqQuery.accessToken);
    const applicatioId = reqQuery.applicatioId;
    const application = await JobApply.findByIdAndDelete(applicatioId);
    if (!application) {
      throw new Error("Application Not Found");
    }
    return application;
  } catch (e) {
    throw e;
  }
}
