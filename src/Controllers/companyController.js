import { Company } from "../Models/CompanyModel.js";

const companyController = {
    //create company
    createCampany: async (req, res, next) => {
      try {
        const company = await Category.create(req.body);
        res.status(200).json({
          success: true,
          company,
        });
      } catch (error) {
        next(error);
      }
    },
//update job by id.
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
}

export default companyController;