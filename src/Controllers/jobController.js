import { Job } from "../Models/JobModel.js";
import Cloud from "../utils/cloudinary.js";
import { requireAdmin, requireUser } from "../Middlewares/auth.js";
import {
  createEmail,
  findEmailByEmailType,
} from "../services/admin/emailService.js";
import { sendNotificationEmail } from "../Middlewares/nodeMailer.js";
import { deleteJobService, findAdminJob } from "../services/jobService.js";

const JobController = {
  //create job
  createJob: async (req, res, next) => {
    try {
      let jobInput;
      // const { image } = req?.files;
      // console.log("image: ", image);
      // if (image) {
      //   // const newImage = new Image({
      //   //   ...image,
      //   // });
      //   jobInput = {
      //     ...req.body.job,
      //     avatarFile: image,
      //   };
      // }

      if (req.body.headerImage) {
        // Upload image to cloudinary
        const headerImageData = await Cloud.uploader.upload(headerImage);
        jobInput = {
          ...req.body.job,
          avatar: headerImageData.secure_url,
          avatarCloudinary_id: headerImageData.public_id,
        };
      } else {
        jobInput = {
          ...req.body.job,
        };
      }
      const job = await Job.create(jobInput);
      res.status(200).send({
        message: "Successfully created a job",
      });
    } catch (e) {
      res.status(500).send({
        message: "Server error",
        error: e.message,
      });
    }
  },

  //single job
  singleJob: async (req, res, next) => {
    try {
      const job = await Job.findById(req.params.id)
        .populate("company", [
          "companyName",
          "companyTagline",
          "logo",
          "companyEmail",
          "phoneNumber",
          "companyWebsite",
          "socialLink",
        ])
        .lean(true);
      // pick category from job
      const jobCategory = { category: job.category };
      const relatedJobs = await Job.find({
        category: jobCategory.category,
        _id: {
          $ne: req.params.id,
        },
      })
        .populate("company")
        .limit(4)
        .lean(true);
      if (!job) {
        return res.status(404).send({
          message: "Job Not Found",
        });
      }

      return res.status(200).send({
        message: "Successfully fetched job",
        success: true,
        job,
        relatedJobs: relatedJobs,
      });
    } catch (e) {
      res.status(500).send({
        message: "Server error",
        error: e.message,
      });
    }
  },

  //update job by id.
  updateJob: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { headers } = req;
      const accessToken = headers.authorization?.split(" ")[1];
      let jobInput;
      await requireAdmin(accessToken);

      if (req.body.headerImage) {
        // Upload image to cloudinary
        const headerImageData = await Cloud.uploader.upload(headerImage);
        jobInput = {
          ...req.body.job,
          avatar: headerImageData.secure_url,
          avatarCloudinary_id: headerImageData.public_id,
        };
      } else {
        jobInput = {
          ...req.body.job,
        };
      }
      const job = await Job.findByIdAndUpdate(id, jobInput, {
        new: true,
      });
      res.status(200).json({
        message: "Successfully updated job",
      });
    } catch (e) {
      res.status(500).send({
        message: "Server error",
        error: e.message,
      });
    }
  },

  //get jobs.
  getJobs: async (req, res, next) => {
    try {
      const jobs = await getJobsService();
      res.status(200).json({
        message: "Successfully fetched all jobs",
        jobs,
      });
    } catch (e) {
      res.status(500).send({
        message: "Server error",
        error: e.message,
      });
    }
  },

  //get jobs private.
  getJobsPrivate: async (req, res, next) => {
    try {
      const { headers } = req;
      const accessToken = headers.authorization?.split(" ")[1];
      console.log("accessToken: ", headers.authorization);
      const jobs = await getJobsPrivate(accessToken);
      res.status(200).send({
        message: "Successfully fetched all private jobs",
        data: jobs,
      });
    } catch (e) {
      res.status(500).send({
        message: "Server Error",
        error: e.message,
      });
    }
  },

  //delete job by id.
  deleteJobs: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { headers } = req;
      const accessToken = headers.authorization?.split(" ")[1];

      const reqQuery = {
        accessToken,
        jobId: id,
      };
      const job = await deleteJob(reqQuery);

      res.status(200).send({
        message: "Successfully deleted job",
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error: error.message,
      });
    }
  },
};

export default JobController;

export async function deleteJob(reqQuery) {
  try {
    const user = await requireUser(reqQuery.accessToken);
    const userID = user.id;
    const jobId = reqQuery.jobId;
    const job = await deleteJobService(jobId);
    if (!job) {
      throw new Error("Job Not Found");
    }
    // const emailType = "JOB_DELETED";
    // let emails;
    // emails = await findEmailByEmailType(emailType);
    // if (emails.length === 0) {
    //   const templateInput = {
    //     senderAddress: "Meta-Jobs",
    //     subject: "Your Job is Deleted",
    //     message: "You have deleted a job",
    //     emailType: "JOB_DELETED",
    //   };
    //   await createEmail(templateInput);
    //   emails = await findEmailByEmailType("JOB_DELETED");
    // }
    // const emailData = emails[0];
    // const inputEmailData = {
    //   userEmail: user.email,
    //   emailData,
    //   jobInfo: job,
    //   userId: userID,
    //   emailType,
    // };
    // sendNotificationEmail(inputEmailData);
    return job;
  } catch (e) {
    throw e;
  }
}
// find all job handller private
export async function getJobsPrivate(accessToken) {
  try {
    const user = await requireUser(accessToken);
    const userID = user == null ? void 0 : user.id;
    console.log("userID: ", userID);
    const adminRole = user.role.isAdmin;
    if (adminRole === true) {
      const jobs = await findAdminJob();
      return jobs;
    }
    const jobs1 = await findJob(userID);
    return jobs1;
  } catch (e) {
    throw e;
  }
}
// get all jobs public
export async function getJobsService() {
  try {
    const jobs = await Job.find({
      "status.isApproved": true,
      "status.isPublished": true,
      "status.isFeatured": true,
      "status.isActive": true,
    })
      .populate("company", [
        "companyName",
        "companyTagline",
        "logo",
        "companyEmail",
        "phoneNumber",
        "companyWebsite",
        "socialLink",
      ])
      .lean(true);
    return jobs;
  } catch (e) {
    throw e;
  }
}
