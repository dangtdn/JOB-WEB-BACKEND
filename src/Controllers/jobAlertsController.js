import { requireUser } from "../Middlewares/auth.js";
import JobAlertModel from "../Models/JobAlertModel.js";
import {
  createJobAlertService,
  deleteJobAlertService,
  getJobAlertsService,
  getSingleJobAlertService,
  updateJobAlertService,
  updateJobAlertStatusService,
} from "../services/jobAlertService.js";

const JobAlertsController = {
  //create job alert
  createJobAlerts: async (req, res, next) => {
    try {
      const { headers } = req;
      const accessToken = headers.authorization?.split(" ")[1];
      const reqData = {
        body: req.body,
        accessToken,
      };
      const jobAlert = await createJobAlerts(reqData);

      res.status(200).send({
        message: "Job alert created successfully",
      });
    } catch (e) {
      res.status(500).send({
        message: "Server error",
        error: e.message,
      });
    }
  },

  //get job alerts
  getJobAlerts: async (req, res, next) => {
    try {
      const { headers } = req;
      const accessToken = headers.authorization?.split(" ")[1];

      const jobAlerts = await getJobAlerts(accessToken);

      res.status(200).send({
        message: "Successfully fetched all alert by this user",
        data: jobAlerts,
      });
    } catch (e) {
      res.status(500).send({
        message: "Server Error",
        error: e.message,
      });
    }
  },

  //single job alert
  getSingleJobAlert: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { headers } = req;
      const accessToken = headers.authorization?.split(" ")[1];

      const reqQuery = {
        accessToken,
        alertId: id,
      };

      const jobAlert = await getSingleJobAlert(reqQuery);

      res.status(200).send({
        message: "Successfully fetched alert",
        data: jobAlert,
      });
    } catch (e) {
      res.status(500).send({
        message: "Server Error",
        error: e.message,
      });
    }
  },

  //update job alert by id.
  updateJobAlert: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { headers } = req;
      const accessToken = headers.authorization?.split(" ")[1];

      const reqQuery = {
        accessToken,
        alertId: id,
        body: req.body,
      };

      const jobAlert = await updateJobAlert(reqQuery);

      res.status(200).send({
        message: "Successfully updated alert",
      });
    } catch (e) {
      res.status(500).send({
        message: "Server error",
        error: e.message,
      });
    }
  },

  //update job alert status.
  updateJobAlertStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { headers } = req;
      const accessToken = headers.authorization?.split(" ")[1];

      const reqQuery = {
        accessToken,
        alertId: id,
        active: req.body.active,
      };

      const jobAlerts = await updateJobAlertStatus(reqQuery);
      res.status(200).send({
        message: "Successfully changed alert status",
      });
    } catch (e) {
      res.status(500).send({
        message: "Server Error",
        error: e.message,
      });
    }
  },

  //delete job alert by id.
  deleteJobAlert: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { headers } = req;
      const accessToken = headers.authorization?.split(" ")[1];

      const reqQuery = {
        accessToken,
        alertId: id,
      };

      const jobAlerts = await deleteJobAlert(reqQuery);
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

export default JobAlertsController;

// create job alert
export async function createJobAlerts(reqData) {
  try {
    const user = await requireUser(reqData.accessToken);
    const userID = user == null ? void 0 : user.id;
    const input = {
      ...reqData.body,
      user: userID,
    };
    const jobAlert = await createJobAlertService(input);
    return jobAlert;
  } catch (e) {
    throw e;
  }
}
// find job alert of a candidate (private)
export async function getJobAlerts(accessToken) {
  try {
    const user = await requireUser(accessToken);
    const userID = user == null ? void 0 : user.id;
    if (user?.role.isCandidate) {
      const jobAlert = await JobAlertModel.find().lean(true);
      return jobAlert;
    }
    const jobAlerts = await getJobAlertsService({
      user: userID,
    });
    return jobAlerts;
  } catch (e) {
    throw e;
  }
}
// get job alert by ID
export async function getSingleJobAlert(reqData) {
  try {
    const user = await requireUser(reqData.accessToken);
    const alertID = reqData == null ? void 0 : reqData.alertId;
    const jobAlerts = await getSingleJobAlertService(alertID);
    return jobAlerts;
  } catch (e) {
    throw e;
  }
}
// update job alert
export async function updateJobAlert(reqQuery) {
  try {
    await requireUser(reqQuery.accessToken);
    const alertID = reqQuery.alertId;
    const alertData = {
      ...reqQuery.body,
    };
    // update a job
    const jobAlert = await updateJobAlertService(alertID, alertData);
    if (!jobAlert) {
      throw new Error("Job Alert Not Found");
    }
    return jobAlert;
  } catch (e) {
    throw e;
  }
}
// update job alert status
export async function updateJobAlertStatus(reqQuery) {
  try {
    await requireUser(reqQuery.accessToken);
    const alertID = reqQuery.alertId;
    const alertData = {
      active: reqQuery.active,
    };
    // update a job
    const jobAlert = await updateJobAlertStatusService(alertID, alertData);
    if (!jobAlert) {
      throw new Error("Job Alert Not Found");
    }
    return jobAlert;
  } catch (e) {
    throw e;
  }
}
// delete job alert
export async function deleteJobAlert(reqQuery) {
  try {
    await requireUser(reqQuery.accessToken);
    const alertID = reqQuery.alertId;
    const jobAlert = await deleteJobAlertService(alertID);
    return jobAlert;
  } catch (e) {
    throw e;
  }
}
