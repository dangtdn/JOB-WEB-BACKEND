import JobApply from "../Models/JobApplyModel.js";
import Cloud from "../utils/cloudinary.js";

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

// create a job service
export async function createJobApplyService(input, cvFile) {
  try {
    let applyInput;
    if (cvFile) {
      // Upload image to cloudinary
      const cvFileData = await Cloud.uploader.upload(cvFile);
      applyInput = {
        ...input,
        cvFile: cvFileData.secure_url,
        cvFileCloudinary_id: cvFileData.public_id,
      };
    } else {
      applyInput = {
        ...input,
      };
    }
    const jobApplication = await JobApply.create(applyInput);
    return jobApplication;
  } catch (e) {
    throw e;
  }
}
// update job application status service
export async function updateApplyStatusService(applyID, update) {
  try {
    const application = await JobApply.findByIdAndUpdate(applyID, update, {
      new: true,
    });
    return application;
  } catch (e) {
    throw e;
  }
}
