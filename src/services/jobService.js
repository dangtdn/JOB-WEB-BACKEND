import { Company } from "../Models/CompanyModel.js";
import { Job } from "../Models/JobModel.js";
import ResumeModel from "../Models/ResumeModel.js";
import { ObjectId } from "mongodb";

// delete a job service
export async function deleteJobService(jobID) {
  try {
    // Delete image from cloudinary
    const jobPreviousData = await Job.findById(jobID);
    if (
      jobPreviousData == null ? void 0 : jobPreviousData.avatarCloudinary_id
    ) {
      await cloudinary.uploader.destroy(jobPreviousData.avatarCloudinary_id);
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
        case "approved":
          job.status.isApproved = true;
          job.save();
          // let emails;
          // emails = await findEmailByEmailType("JOB_APPROVED");
          // if (emails.length === 0) {
          //   const templateInput = {
          //     senderAddress: "Meta Jobs",
          //     subject: "Your Job is Approved",
          //     message: "Congrats..!! Your Job is Approved",
          //     emailType: "JOB_APPROVED",
          //   };
          //   await createEmail(templateInput);
          //   emails = await findEmailByEmailType("JOB_APPROVED");
          // }
          // const emailData = emails[0];
          // const approvalInput = {
          //   userEmail: job.user.email,
          //   emailData,
          //   userId,
          //   emailType: "JOB_APPROVED",
          // };
          // await sendNotificationEmail(approvalInput);
          return "Job approved successfully";
        case "rejected":
          job.status.isApproved = false;
          job.save();
          // let rejectedEmails;
          // rejectedEmails = await findEmailByEmailType("JOB_REJECTED");
          // if (rejectedEmails.length === 0) {
          //   const templateInput1 = {
          //     senderAddress: "Meta-Jobs",
          //     subject: "Your Job is Rejected",
          //     message: "Sorry..!! Your Job is Rejected",
          //     emailType: "JOB_REJECTED",
          //   };
          //   await createEmail(templateInput1);
          //   rejectedEmails = await findEmailByEmailType("JOB_REJECTED");
          // }
          // const rejectedEmailData = rejectedEmails[0];
          // const rejectlInput = {
          //   userEmail: job.user.email,
          //   emailData: rejectedEmailData,
          //   userId,
          //   emailType: "JOB_REJECTED",
          // };
          // await sendNotificationEmail(rejectlInput);
          return "Job rejected by Admin";
        case "featured":
          // const user = await getUserWithPackage(userId);
          // const { featuredJobs } = user == null ? void 0 : user.package;
          // // find the user total job
          // const featuredJobsCount = await findTotalFeaturedJob(userId);
          // if (featuredJobsCount >= featuredJobs) {
          //   throw new Error("You have reached your job limit");
          // }
          job.status.isFeatured = true;
          job.save();
          // let featureJobResult;
          // featureJobResult = await findEmailByEmailType("JOB_FEATURED");
          // if (featureJobResult.length === 0) {
          //   const templateInput2 = {
          //     senderAddress: "Meta Jobs",
          //     subject: "Your Job is Featured",
          //     message: "Congrats..!! Your Job is Featured",
          //     emailType: "JOB_FEATURED",
          //   };
          //   await createEmail(templateInput2);
          //   featureJobResult = await findEmailByEmailType("JOB_FEATURED");
          // }
          // const feaureJobData = featureJobResult[0];
          // const featurelInput = {
          //   userEmail: job.user.email,
          //   emailData: feaureJobData,
          //   userId,
          //   emailType: "JOB_FEATURED",
          // };
          // await sendNotificationEmail(featurelInput);
          return "Job featured successfully";
        case "nonFeatured":
          job.status.isFeatured = false;
          job.save();
          // let nonFeaturedEmails;
          // nonFeaturedEmails = await findEmailByEmailType("JOB_NON-FEATURED");
          // if (nonFeaturedEmails.length === 0) {
          //   const templateInput3 = {
          //     senderAddress: "Meta-Jobs",
          //     subject: "Your Job is Non-Featured",
          //     message: "Sorry..!! Your Job is Non-Featured",
          //     emailType: "JOB_NON-FEATURED",
          //   };
          //   await createEmail(templateInput3);
          //   nonFeaturedEmails = await findEmailByEmailType("JOB_NON-FEATURED");
          // }
          // const nonFeaturedEmailData = nonFeaturedEmails[0];
          // const nonFeaturedlInput = {
          //   userEmail: job.user.email,
          //   emailData: nonFeaturedEmailData,
          //   userId,
          //   emailType: "JOB_NON-FEATURED",
          // };
          // await sendNotificationEmail(nonFeaturedlInput);
          return "Job is non-featured";
        case "expired":
          job.status.isActive = false;
          job.save();
          // const expiredJobResult = await findEmailByEmailType('JOB_EXPIRED')
          // let expiredJobResult;
          // expiredJobResult = await findEmailByEmailType("JOB_EXPIRED");
          // if (expiredJobResult.length === 0) {
          //   const templateInput4 = {
          //     senderAddress: "Meta Jobs",
          //     subject: "Your Job is Expired",
          //     message: "Sorry..!! Your Job is Expired",
          //     emailType: "JOB_EXPIRED",
          //   };
          //   await createEmail(templateInput4);
          //   expiredJobResult = await findEmailByEmailType("JOB_EXPIRED");
          // }
          // const expiredJobData = expiredJobResult[0];
          // const expiredInput = {
          //   userEmail: job.user.email,
          //   emailData: expiredJobData,
          //   userId,
          //   emailType: "JOB_EXPIRED",
          // };
          // await sendNotificationEmail(expiredInput);
          return "Job is expired";
        case "active":
          job.status.isActive = true;
          job.save();
          // let activatedJobResult;
          // activatedJobResult = await findEmailByEmailType("JOB_ACTIVATED");
          // if (activatedJobResult.length === 0) {
          //   const templateInput5 = {
          //     senderAddress: "Meta Jobs",
          //     subject: "Your Job is Activated",
          //     message: "Congrats..!! Your Job is Activated",
          //     emailType: "JOB_ACTIVATED",
          //   };
          //   await createEmail(templateInput5);
          //   activatedJobResult = await findEmailByEmailType("JOB_ACTIVATED");
          // }
          // const activatedJobData = activatedJobResult[0];
          // const activatedInput = {
          //   userEmail: job.user.email,
          //   emailData: activatedJobData,
          //   userId,
          //   emailType: "JOB_ACTIVATED",
          // };
          // await sendNotificationEmail(activatedInput);
          return "Job activated successfully";
        case "draft":
          job.status.isPublished = false;
          job.save();
          // let draftJobResult;
          // draftJobResult = await findEmailByEmailType("JOB_DRAFTED");
          // if (draftJobResult.length === 0) {
          //   const templateInput6 = {
          //     senderAddress: "Meta-Jobs",
          //     subject: "Your Job is in Draft",
          //     message: "Congrats..!! Your Job is in Draft",
          //     emailType: "JOB_DRAFTED",
          //   };
          //   await createEmail(templateInput6);
          //   draftJobResult = await findEmailByEmailType("JOB_DRAFTED");
          // }
          // const draftJobData = draftJobResult[0];
          // const draftInput = {
          //   userEmail: job.user.email,
          //   emailData: draftJobData,
          //   userId,
          //   emailType: "JOB_DRAFTED",
          // };
          // await sendNotificationEmail(draftInput);
          return "Job draft successfully";
        case "published":
          job.status.isPublished = true;
          job.save();
          // let publishedJobResult;
          // publishedJobResult = await findEmailByEmailType("JOB_PUBLISHED");
          // if (publishedJobResult.length === 0) {
          //   const templateInput7 = {
          //     senderAddress: "Meta-Jobs",
          //     subject: "Your Job is in Published",
          //     message: "Congrats..!! Your Job is Published",
          //     emailType: "JOB_PUBLISHED",
          //   };
          //   await createEmail(templateInput7);
          //   publishedJobResult = await findEmailByEmailType("JOB_PUBLISHED");
          // }
          // const publishedJobData = publishedJobResult[0];
          // const publishedInput = {
          //   userEmail: job.user.email,
          //   emailData: publishedJobData,
          //   userId,
          //   emailType: "JOB_PUBLISHED",
          // };
          // await sendNotificationEmail(publishedInput);
          return "Job published successfully";
        default:
          throw new Error("Invalid status");
      }
    }
    switch (jobStatus) {
      case "featured":
        // const user1 = await getUserWithPackage(userId);
        // const { featuredJobs: featuredJobs1 } =
        //   user1 == null ? void 0 : user1.package;
        // // find the user total job
        // const featuredJobsCount1 = await findTotalFeaturedJob(userId);
        // if (featuredJobsCount1 >= featuredJobs1) {
        //   throw new Error("You have reached your job limit");
        // }
        job.status.isFeatured = true;
        job.save();
        // let featureJobResult1;
        // featureJobResult1 = await findEmailByEmailType("JOB_FEATURED");
        // if (featureJobResult1.length === 0) {
        //   const templateInput8 = {
        //     senderAddress: "Meta Jobs",
        //     subject: "Your Job is Featured",
        //     message: "Congrats..!! Your Job is Featured",
        //     emailType: "JOB_FEATURED",
        //   };
        //   await createEmail(templateInput8);
        //   featureJobResult1 = await findEmailByEmailType("JOB_FEATURED");
        // }
        // const feaureJobData1 = featureJobResult1[0];
        // const featurelInput1 = {
        //   userEmail: job.user.email,
        //   emailData: feaureJobData1,
        //   userId,
        //   emailType: "JOB_FEATURED",
        // };
        // await sendNotificationEmail(featurelInput1);
        return "Job featured successfully";
        break;
      case "nonFeatured":
        job.status.isFeatured = false;
        job.save();
        // let nonFeaturedEmails1;
        // nonFeaturedEmails1 = await findEmailByEmailType("JOB_NON-FEATURED");
        // if (nonFeaturedEmails1.length === 0) {
        //   const templateInput9 = {
        //     senderAddress: "Meta-Jobs",
        //     subject: "Your Job is Non-Featured",
        //     message: "Sorry..!! Your Job is Non-Featured",
        //     emailType: "JOB_NON-FEATURED",
        //   };
        //   await createEmail(templateInput9);
        //   nonFeaturedEmails1 = await findEmailByEmailType("JOB_NON-FEATURED");
        // }
        // const nonFeaturedEmailData1 = nonFeaturedEmails1[0];
        // const nonFeaturedlInput1 = {
        //   userEmail: job.user.email,
        //   emailData: nonFeaturedEmailData1,
        //   userId,
        //   emailType: "JOB_NON-FEATURED",
        // };
        // await sendNotificationEmail(nonFeaturedlInput1);
        return "Job is non-featured";
      case "draft":
        job.status.isPublished = false;
        job.save();
        // let draftJobResult1;
        // draftJobResult1 = await findEmailByEmailType("JOB_DRAFTED");
        // if (draftJobResult1.length === 0) {
        //   const templateInput10 = {
        //     senderAddress: "Meta-Jobs",
        //     subject: "Your Job is in Draft",
        //     message: "Congrats..!! Your Job is in Draft",
        //     emailType: "JOB_DRAFTED",
        //   };
        //   await createEmail(templateInput10);
        //   draftJobResult1 = await findEmailByEmailType("JOB_DRAFTED");
        // }
        // const draftJobData1 = draftJobResult1[0];
        // const draftInput1 = {
        //   userEmail: job.user.email,
        //   emailData: draftJobData1,
        //   userId,
        //   emailType: "JOB_DRAFTED",
        // };
        // await sendNotificationEmail(draftInput1);
        return "Job draft successfully";
      case "published":
        job.status.isPublished = true;
        job.save();
        // let publishedJobResult1;
        // publishedJobResult1 = await findEmailByEmailType("JOB_PUBLISHED");
        // if (publishedJobResult1.length === 0) {
        //   const templateInput11 = {
        //     senderAddress: "Meta-Jobs",
        //     subject: "Your Job is in Published",
        //     message: "Congrats..!! Your Job is Published",
        //     emailType: "JOB_PUBLISHED",
        //   };
        //   await createEmail(templateInput11);
        //   publishedJobResult1 = await findEmailByEmailType("JOB_PUBLISHED");
        // }
        // const publishedJobData1 = publishedJobResult1[0];
        // const publishedInput1 = {
        //   userEmail: job.user.email,
        //   emailData: publishedJobData1,
        //   userId,
        //   emailType: "JOB_PUBLISHED",
        // };
        // await sendNotificationEmail(publishedInput1);
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
