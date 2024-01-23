import JobApply from "../Models/JobApplyModel.js";

// find all application of a job service
export async function getJobApplicationsService(jobId) {
  try {
    const applications = await JobApply.find({
      jobItem: new ObjectId(jobId),
    }).lean(true);
    const applyCount = await JobApply.countDocuments({
      jobItem: new ObjectId(jobId),
    });
    return {
      applications,
      applyCount,
    };
  } catch (e) {
    throw e;
  }
}
