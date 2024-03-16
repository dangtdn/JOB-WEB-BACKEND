import { Company } from "../Models/CompanyModel.js";
import { Job } from "../Models/JobModel.js";
import ResumeModel from "../Models/ResumeModel.js";
import { sendNotificationEmail } from "../Middlewares/nodeMailer.js";
import { emails } from "../utils/mongodb collections/emails.js";
import Cloud from "../utils/cloudinary.js";

// create a job service
export async function createJobSeivice(input, headerImage) {
  try {
    let jobInput;
    if (headerImage) {
      // Upload image to cloudinary
      const headerImageData = await Cloud.uploader.upload(headerImage);
      jobInput = {
        ...input,
        avatar: headerImageData.secure_url,
        avatarCloudinary_id: headerImageData.public_id,
      };
    } else {
      jobInput = {
        ...input,
      };
    }
    const job = await Job.create(jobInput);
    return job;
  } catch (e) {
    throw e;
  }
}
// delete a job service
export async function deleteJobService(jobID) {
  try {
    // Delete image from cloudinary
    const jobPreviousData = await Job.findById(jobID);
    if (
      jobPreviousData == null ? void 0 : jobPreviousData.avatarCloudinary_id
    ) {
      await Cloud.uploader.destroy(jobPreviousData.avatarCloudinary_id);
    }
    const job = await Job.findByIdAndDelete(jobID);
    return job;
  } catch (e) {
    throw e;
  }
}
// find all admin job service
export async function findAdminJob() {
  try {
    // const jobs = await JobModel.find().lean(true)
    const jobs = await Job.aggregate([
      {
        $lookup: {
          from: "jobapplies",
          localField: "_id",
          foreignField: "jobItem",
          as: "applications",
        },
      },
    ]);
    return jobs;
  } catch (e) {
    throw e;
  }
}

// find all private job service
export async function findJob(query) {
  try {
    // find all jobs and count application from applies collection using aggregation
    const jobs = await Job.aggregate([
      {
        $lookup: {
          from: "jobapplies",
          localField: "_id",
          foreignField: "jobItem",
          as: "applications",
        },
      },
      {
        $match: {
          user: query,
        },
      },
    ]);
    return jobs;
  } catch (e) {
    throw e;
  }
}

// job status update service
export async function jobstatusUpdate(query) {
  try {
    const { userId, adminRole, jobId, jobStatus } = query;
    // find the job based on id
    const job = await Job.findById(jobId).populate("user", ["email"]);
    if (!job) {
      throw new Error("Job Not Found");
    }
    if (adminRole === true) {
      switch (jobStatus) {
        case "approved": {
          job.status.isApproved = true;
          job.save();
          let approvedEmails = emails.filter(
            (item) => item.emailType === "JOB_APPROVED"
          );
          // emails = await findEmailByEmailType("JOB_APPROVED");
          if (approvedEmails.length === 0) {
            const templateInput = {
              senderAddress: "Meta Jobs",
              subject: "Your Job is Approved",
              message: "Congrats..!! Your Job is Approved",
              emailType: "JOB_APPROVED",
            };
            // await createEmail(templateInput);
            // emails = await findEmailByEmailType("JOB_APPROVED");
          }
          const emailData = approvedEmails[0];
          const approvalInput = {
            userEmail: job.user.email,
            emailData,
            userId,
            emailType: "JOB_APPROVED",
          };
          await sendNotificationEmail(approvalInput);
          return "Job approved successfully";
        }
        case "rejected": {
          job.status.isApproved = false;
          job.save();
          let rejectedEmails = emails.filter(
            (item) => item.emailType === "JOB_REJECTED"
          );
          // rejectedEmails = await findEmailByEmailType("JOB_REJECTED");
          if (rejectedEmails.length === 0) {
            const templateInput1 = {
              senderAddress: "Meta-Jobs",
              subject: "Your Job is Rejected",
              message: "Sorry..!! Your Job is Rejected",
              emailType: "JOB_REJECTED",
            };
            // await createEmail(templateInput1);
            // rejectedEmails = await findEmailByEmailType("JOB_REJECTED");
          }
          const rejectedEmailData = rejectedEmails[0];
          const rejectlInput = {
            userEmail: job.user.email,
            emailData: rejectedEmailData,
            userId,
            emailType: "JOB_REJECTED",
          };
          await sendNotificationEmail(rejectlInput);
          return "Job rejected by Admin";
        }
        case "featured": {
          job.status.isFeatured = true;
          job.save();
          let featureJobResult = emails.filter(
            (item) => item.emailType === "JOB_FEATURED"
          );
          const feaureJobData = featureJobResult[0];
          const featurelInput = {
            userEmail: job.user.email,
            emailData: feaureJobData,
            userId,
            emailType: "JOB_FEATURED",
          };
          await sendNotificationEmail(featurelInput);
          return "Job featured successfully";
        }
        case "nonFeatured": {
          job.status.isFeatured = false;
          job.save();
          let nonFeaturedEmails = emails.filter(
            (item) => item.emailType === "JOB_NON-FEATURED"
          );
          const nonFeaturedEmailData = nonFeaturedEmails[0];
          const nonFeaturedlInput = {
            userEmail: job.user.email,
            emailData: nonFeaturedEmailData,
            userId,
            emailType: "JOB_NON-FEATURED",
          };
          await sendNotificationEmail(nonFeaturedlInput);
          return "Job is non-featured";
        }
        case "expired": {
          job.status.isActive = false;
          job.save();
          let expiredJobResult = emails.filter(
            (item) => item.emailType === "JOB_EXPIRED"
          );
          const expiredJobData = expiredJobResult[0];
          const expiredInput = {
            userEmail: job.user.email,
            emailData: expiredJobData,
            userId,
            emailType: "JOB_EXPIRED",
          };
          await sendNotificationEmail(expiredInput);
          return "Job is expired";
        }
        case "active": {
          job.status.isActive = true;
          job.save();
          let activatedJobResult = emails.filter(
            (item) => item.emailType === "JOB_ACTIVATED"
          );
          // activatedJobResult = await findEmailByEmailType("JOB_ACTIVATED");
          if (activatedJobResult.length === 0) {
            const templateInput5 = {
              senderAddress: "Meta Jobs",
              subject: "Your Job is Activated",
              message: "Congrats..!! Your Job is Activated",
              emailType: "JOB_ACTIVATED",
            };
            // await createEmail(templateInput5);
            // activatedJobResult = await findEmailByEmailType("JOB_ACTIVATED");
          }
          const activatedJobData = activatedJobResult[0];
          const activatedInput = {
            userEmail: job.user.email,
            emailData: activatedJobData,
            userId,
            emailType: "JOB_ACTIVATED",
          };
          await sendNotificationEmail(activatedInput);
          return "Job activated successfully";
        }
        case "draft": {
          job.status.isPublished = false;
          job.save();
          let draftJobResult = emails.filter(
            (item) => item.emailType === "JOB_DRAFTED"
          );
          // draftJobResult = await findEmailByEmailType("JOB_DRAFTED");
          if (draftJobResult.length === 0) {
            const templateInput6 = {
              senderAddress: "Meta-Jobs",
              subject: "Your Job is in Draft",
              message: "Congrats..!! Your Job is in Draft",
              emailType: "JOB_DRAFTED",
            };
            // await createEmail(templateInput6);
            // draftJobResult = await findEmailByEmailType("JOB_DRAFTED");
          }
          const draftJobData = draftJobResult[0];
          const draftInput = {
            userEmail: job.user.email,
            emailData: draftJobData,
            userId,
            emailType: "JOB_DRAFTED",
          };
          await sendNotificationEmail(draftInput);
          return "Job draft successfully";
        }
        case "published": {
          job.status.isPublished = true;
          job.save();
          let publishedJobResult = emails.filter(
            (item) => item.emailType === "JOB_PUBLISHED"
          );
          // publishedJobResult = await findEmailByEmailType("JOB_PUBLISHED");
          if (publishedJobResult.length === 0) {
            const templateInput7 = {
              senderAddress: "Meta-Jobs",
              subject: "Your Job is in Published",
              message: "Congrats..!! Your Job is Published",
              emailType: "JOB_PUBLISHED",
            };
            // await createEmail(templateInput7);
            // publishedJobResult = await findEmailByEmailType("JOB_PUBLISHED");
          }
          const publishedJobData = publishedJobResult[0];
          const publishedInput = {
            userEmail: job.user.email,
            emailData: publishedJobData,
            userId,
            emailType: "JOB_PUBLISHED",
          };
          await sendNotificationEmail(publishedInput);
          return "Job published successfully";
        }
        default: {
          throw new Error("Invalid status");
        }
      }
    }
    switch (jobStatus) {
      case "featured":
        job.status.isFeatured = true;
        job.save();
        let featureJobResult1 = emails.filter(
          (item) => item.emailType === "JOB_FEATURED"
        );
        const feaureJobData1 = featureJobResult1[0];
        const featurelInput1 = {
          userEmail: job.user.email,
          emailData: feaureJobData1,
          userId,
          emailType: "JOB_FEATURED",
        };
        await sendNotificationEmail(featurelInput1);
        return "Job featured successfully";
        break;
      case "nonFeatured":
        job.status.isFeatured = false;
        job.save();
        let nonFeaturedEmails1 = emails.filter(
          (item) => item.emailType === "JOB_NON-FEATURED"
        );
        const nonFeaturedEmailData1 = nonFeaturedEmails1[0];
        const nonFeaturedlInput1 = {
          userEmail: job.user.email,
          emailData: nonFeaturedEmailData1,
          userId,
          emailType: "JOB_NON-FEATURED",
        };
        await sendNotificationEmail(nonFeaturedlInput1);
        return "Job is non-featured";
      case "draft":
        job.status.isPublished = false;
        job.save();
        let draftJobResult1 = emails.filter(
          (item) => item.emailType === "JOB_DRAFTED"
        );
        const draftJobData1 = draftJobResult1[0];
        const draftInput1 = {
          userEmail: job.user.email,
          emailData: draftJobData1,
          userId,
          emailType: "JOB_DRAFTED",
        };
        await sendNotificationEmail(draftInput1);
        return "Job draft successfully";
      case "published":
        job.status.isPublished = true;
        job.save();
        let publishedJobResult1 = emails.filter(
          (item) => item.emailType === "JOB_PUBLISHED"
        );
        const publishedJobData1 = publishedJobResult1[0];
        const publishedInput1 = {
          userEmail: job.user.email,
          emailData: publishedJobData1,
          userId,
          emailType: "JOB_PUBLISHED",
        };
        await sendNotificationEmail(publishedInput1);
        return "Job published successfully";
      default:
        throw new Error("Invalid status");
    }
  } catch (e) {
    throw e;
  }
}
// find total job, total company, total resume in public api route
export async function getTotalCountService() {
  try {
    const totalJobs = await Job.find({
      "status.isApproved": true,
      "status.isPublished": true,
      "status.isActive": true,
    }).count();
    const totalCompanies = await Company.find({
      "status.isPublished": true,
      "status.isApproved": true,
      "status.isActive": true,
    }).count();
    const totalResumes = await ResumeModel.find({
      "status.isPublished": true,
      "status.isApproved": true,
      "status.isActive": true,
    }).count();
    const total = {
      totalJobs,
      totalCompanies,
      totalResumes,
    };
    return total;
  } catch (e) {
    throw e;
  }
}
