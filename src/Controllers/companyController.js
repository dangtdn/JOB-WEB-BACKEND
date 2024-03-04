import { Company } from "../Models/CompanyModel.js";
import { Job } from "../Models/JobModel.js";

const companyController = {
  //create company
  createCampany: async (req, res, next) => {
    try {
      const company = await Company.create(req.body);
      res.status(200).send({
        message: "Successfully created a company profile",
      });
    } catch (e) {
      res.status(500).send({
        message: "Server Error",
        error: e.message,
      });
    }
  },

  //single company
  singleCompany: async (req, res, next) => {
    try {
      const company = await Company.findById(req.params.id);
      // find the all job based company id
      const jobs = await Job.find({
        company: req.params.id,
        "status.isApproved": true,
        "status.isPublished": true,
        "status.isActive": true,
      }).lean(true);

      return res.status(200).send({
        success: true,
        message: "Company Profile Found",
        company,
        jobs,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error: error.message,
      });
      next(error);
    }
  },

  //update company by id.
  updateCompany: async (req, res, next) => {
    try {
      const company = await Company.findByIdAndUpdate(
        req.params.company_id,
        req.body,
        {
          new: true,
        }
      );
      res.status(200).json({
        success: true,
        company,
      });
    } catch (e) {
      res.status(500).send({
        message: "Server Error",
        error: e.message,
      });
    }
  },

  // show all company
  showCompanies: async (req, res, next) => {
    //enable pagination
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    const count = await Company.find({}).estimatedDocumentCount();

    try {
      const companies = await Company.find()
        .sort({ createdAt: -1 })
        .skip(pageSize * (page - 1))
        .limit(pageSize);

      res.status(200).send({
        message: "Successfully fetched all company",
        companies,
      });
    } catch (e) {
      res.status(500).send({
        message: "Server Error",
        error: e.message,
      });
    }
  },

  //delete company
  deleteCompany: async (req, res, next) => {
    try {
      const company = await Company.findByIdAndRemove(req.params.id);
      res.status(200).json({
        success: true,
        message: "company deleted",
      });
      next();
    } catch (e) {
      res.status(500).send({
        message: "Server Error",
        error: e.message,
      });
    }
  },
};

export default companyController;
