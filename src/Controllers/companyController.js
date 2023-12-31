import { Company } from "../Models/CompanyModel.js";

const companyController = {
  //create company
  createCampany: async (req, res, next) => {
    try {
      const company = await Company.create(req.body);
      res.status(200).json({
        success: true,
        company,
      });
    } catch (error) {
      next(error);
    }
  },

  //single company
  singleCompany: async (req, res, next) => {
    try {
      const company = await Company.findById(req.params.id);
      res.status(200).json({
        success: true,
        company,
      });
    } catch (error) {
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
    } catch (error) {
      next(error);
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

      res.status(200).json({
        success: true,
        companies,
        page,
        pages: Math.ceil(count / pageSize),
        count,
      });
      next();
    } catch (error) {
      return next(error);
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
    } catch (error) {
      return next(error);
    }
  },
};

export default companyController;
