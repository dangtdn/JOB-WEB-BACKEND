import JobAlertModel from "../Models/JobAlertModel.js";

// create job alert service
export async function createJobAlertService(input) {
  try {
    const jobAlert = await JobAlertModel.create(input);
    return jobAlert;
  } catch (e) {
    throw e;
  }
}
// find all job alerts service (private)
export async function getJobAlertsService(query) {
  try {
    const jobAlert = await JobAlertModel.find(query).lean(true);
    return jobAlert;
  } catch (e) {
    throw e;
  }
}
// get job alert service
export async function getSingleJobAlertService(alertID) {
  try {
    const jobAlert = await JobAlertModel.findById(alertID);
    return jobAlert;
  } catch (e) {
    throw e;
  }
}
// update job alert service
export async function updateJobAlertService(alertID, input) {
  try {
    const jobAlert = await JobAlertModel.findByIdAndUpdate(alertID, input, {
      new: true,
    });
    return jobAlert;
  } catch (e) {
    throw e;
  }
}
// update job alert status service
export async function updateJobAlertStatusService(alertID, update) {
  try {
    const jobAlert = await JobAlertModel.findByIdAndUpdate(alertID, update, {
      new: true,
    });
    return jobAlert;
  } catch (e) {
    throw e;
  }
}
// delete job alert  service
export async function deleteJobAlertService(alertID) {
  try {
    const jobAlert = await JobAlertModel.findByIdAndDelete(alertID);
    return jobAlert;
  } catch (e) {
    throw e;
  }
}
