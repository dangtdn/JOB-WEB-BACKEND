import JobApply from "../Models/JobApplyModel.js";

// find all application of a job service
export async function getJobApplicationsService(jobId) {
  try {
    const applications = await JobApply.find({
      jobItem: jobId,
    }).lean(true);
    const applyCount = await JobApply.countDocuments({
      jobItem: jobId,
    });
    return {
      applications,
      applyCount,
    };
  } catch (e) {
    throw e;
  }
}

// find all application of a candidate service
export async function findApplications(query) {
  try {
    const applications = await JobApply.find(query)
      .populate("jobItem", ["jobTitle"])
      .lean(true);
    return applications;
  } catch (e) {
    throw e;
  }
}

// count all application of a candidate service
export async function countApplications(query) {
  try {
    const applications = await JobApply.countDocuments(query);
    return applications;
  } catch (e) {
    throw e;
  }
}
