import { Job } from "../Models/JobModel.js";

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
