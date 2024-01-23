import JobApply from "../Models/JobApplyModel.js";
import { getJobApplicationsService } from "../services/jobApplyService";

const JobApplyController = {
  // create JobApply
  createJobApply: async (req, res, next) => {
    try {
      // {
      //     "user": "622b4d0a210fd3b5bb5a315c",
      //     "status": "Pending",
      //     "fullName": "Robert Browny",
      //     "email": "rober@example.con",
      //     "coverLetter":
      //       "Lorem text lorem text, Lorem text lorem text, Lorem text lorem text, Lorem text lorem text, Lorem text lorem text, Lorem text lorem text, ",
      //     "jobItem": "622f00ed7cc2cc7a44eeb531",
      //   }
      const request = req.body;
      const jobApply = await JobApply.create(request);
      res.status(201).json({
        success: true,
        message: "You have successfully applied a job",
        jobApply,
      });
    } catch (error) {
      next(error);
    }
  },

  // get user apply
  getUserApplication: async (req, res, next) => {
    try {
      const userID = req.params.id;
      const applications = await findApplications({
        user: userID,
      });
      res.status(201).json({
        success: true,
        applications,
      });
    } catch (error) {
      next(error);
    }
  },

  // get job apply
  getJobApplication: async (req, res, next) => {
    try {
      const jobID = req.params.id;
      const applicationResult = await getJobApplicationsService(jobID);
      const data = {
        applications: applicationResult.applications,
        totalApplyCount: applicationResult.applyCount,
      };
      res.status(201).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  // update status job apply
  updateApplyStatus: async (req, res, next) => {
    try {
      const jobID = req.params.id;
      const applyData = {
        status: req.body.status,
      };
      const application = await updateApplyStatusService(applyId, applyData);
      res.status(201).json({
        message: "Application Updated",
        success: true,
        application,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default JobApplyController;
