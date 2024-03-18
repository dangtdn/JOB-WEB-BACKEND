import { Job } from "../Models/JobModel.js";
import Cloud from "../utils/cloudinary.js";
import { requireAdmin, requireUser } from "../Middlewares/auth.js";
import { sendNotificationEmail } from "../Middlewares/nodeMailer.js";
import {
  createJobSeivice,
  deleteJobService,
  findAdminJob,
  findJob,
  getTotalCountService,
  jobstatusUpdate,
} from "../services/jobService.js";
import { emails } from "../utils/mongodb collections/emails.js";

const JobController = {
  //create job
  createJob: async (req, res, next) => {
    try {
      const { headers } = req;
      const accessToken = headers.authorization?.split(" ")[1];
      const { file } = req;
      const headerImage = file?.path;

      const jobData = {
        company: req.body.company,
        jobTitle: req.body.jobTitle,
        location: req.body.location,
        region: req.body.region,
        jobTypes: req.body.jobTypes.split(","),
        category: req.body.category,
        jobExperience: req.body.jobExperience,
        specialTags: req.body.specialTags.split(","),
        jobDescription: req.body.jobDescription,
        email: req.body.email,
        applyDeadline: req.body.applyDeadline,
        hourlyrate: {
          minimum: req.body.hourlyrateMinimum,
          maximum: req.body.hourlyrateMaximum,
        },
        salary: {
          minimum: req.body.salaryMinimum,
          maximum: req.body.salaryMaximum,
        },
        applyLink: req.body.applyLink,
      };

      const reqQuery = {
        accessToken,
        jobData,
        headerImage,
      };
      const job = await createJob(reqQuery);
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
        data: job,
        relatedJobs: relatedJobs,
      });
    } catch (e) {
      res.status(500).send({
        message: "Server error",
        error: e.message,
      });
    }
  },

  //find total job, resume, company
  getTotalCount: async (req, res, next) => {
    try {
      const countData = await getTotalCount();

      res.status(200).send({
        message: "Successfully found total count for jobs, resume, company",
        data: countData,
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

  //get jobs with featured
  getJobs: async (req, res, next) => {
    try {
      const jobs = await getJobsService();
      res.status(200).send({
        message: "Successfully fetched all featured jobs",
        jobs,
      });
    } catch (e) {
      res.status(500).send({
        message: "Server error",
        error: e.message,
      });
    }
  },

  //get jobs.
  getSearchJobs: async (req, res, next) => {
    try {
      const jobs = await Job.find({
        "status.isApproved": true,
        "status.isPublished": true,
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
      res.status(200).send({
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

  //update status job by id.
  updateStatusJob: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { headers } = req;
      const accessToken = headers.authorization?.split(" ")[1];

      const rewQuery = {
        accessToken,
        jobId: id,
        jobStatus: req.body.status,
      };
      const message = await updateJobStatus(rewQuery);

      res.status(200).send({
        message,
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

// create job handller
export async function createJob(reqQuery) {
  try {
    const { accessToken, jobData, headerImage } = reqQuery;
    const userInfo = await requireUser(accessToken);
    const userId = userInfo._id;
    const userEmail = userInfo.email;

    const jobInputData = {
      ...jobData,
      user: userId,
      expireAt: new Date(new Date().setDate(new Date().getDate())),
    };
    const job = await createJobSeivice(jobInputData, headerImage);

    let jobEmails = emails.filter((item) => item.emailType === "JOB_PUBLISHED");

    const emailData = jobEmails[0];
    const inputEmailData = {
      userEmail,
      emailData,
      emailType: "JOB_PUBLISHED",
      userId,
    };
    await sendNotificationEmail(inputEmailData);
    return job;
  } catch (e) {
    throw e;
  }
}
export async function deleteJob(reqQuery) {
  try {
    const user = await requireUser(reqQuery.accessToken);
    const userID = user.id;
    const jobId = reqQuery.jobId;
    const job = await deleteJobService(jobId);
    if (!job) {
      throw new Error("Job Not Found");
    }
    let jobEmails = emails.filter((item) => item.emailType === "JOB_DELETED");
    const emailData = jobEmails[0];
    const inputEmailData = {
      userEmail: user.email,
      emailData,
      jobInfo: job,
      userId: userID,
      emailType: "JOB_DELETED",
    };
    sendNotificationEmail(inputEmailData);
    return job;
  } catch (e) {
    throw e;
  }
}
// find all job handller private
export async function getJobsPrivate(accessToken) {
  try {
    const user = await requireUser(accessToken);
    const userID = user == null ? void 0 : user._id;
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
// job status update
export async function updateJobStatus(rewQuery) {
  try {
    const user = await requireUser(rewQuery.accessToken);
    const query = {
      userId: user._id,
      adminRole: user.role.isAdmin,
      jobId: rewQuery.jobId,
      jobStatus: rewQuery.jobStatus,
    };
    const jobs = await jobstatusUpdate(query);
    return jobs;
  } catch (e) {
    throw e;
  }
}
// find total job, resume, company
export async function getTotalCount(req, res) {
  try {
    const totalCount = await getTotalCountService();
    return totalCount;
  } catch (e) {
    throw e;
  }
}
