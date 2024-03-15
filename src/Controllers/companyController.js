import { requireEmployer, requireUser } from "../Middlewares/auth.js";
import { Company } from "../Models/CompanyModel.js";
import { Job } from "../Models/JobModel.js";
import {
  createCompanyService,
  deleteCompanyService,
  getSingleCompanyService,
  updateCompanyService,
  updateCompanyStatusService,
} from "../services/companyService.js";

const companyController = {
  //create company
  createCampany: async (req, res, next) => {
    try {
      const { headers } = req;
      const accessToken = headers.authorization?.split(" ")[1];
      const { files } = req;
      const inputFiles = files;
      let logoImage = "";
      let headerImage = "";
      if (inputFiles.logoImage) {
        logoImage = inputFiles.logoImage[0]?.path;
      }
      if (inputFiles.headerImage) {
        headerImage = inputFiles.headerImage[0]?.path;
      }
      const images = {
        logoImage,
        headerImage,
      };
      const companyInput = {
        companyName: req.body.companyName,
        companyTagline: req.body.companyTagline,
        category: req.body.category,
        companyEmail: req.body.companyEmail,
        phoneNumber: req.body.phoneNumber,
        eatablishedDate: req.body.eatablishedDate,
        companyWebsite: req.body.companyWebsite,
        avarageSalary: req.body.avarageSalary,
        companySize: req.body.companySize,
        description: req.body.description,
        location: req.body.location,
        locationMap: {
          latitude: req.body.locationLatitude,
          longitude: req.body.locationLongitude,
        },
        videoLink: req.body.videoLink,
        socialLink: {
          linkedin: req.body.linkedinLink,
          facebook: req.body.facebookLink,
          twitter: req.body.twitterLink,
        },
      };

      const reqQuery = {
        accessToken,
        companyInput,
        images,
      };
      const job = await createCompany(reqQuery);
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
  getSingleCompany: async (req, res, next) => {
    try {
      const { id } = req.params;
      const companyResult = await getSingleCompany(id);

      return res.status(200).send({
        message: "Company Profile Found",
        data: companyResult,
      });
    } catch (error) {
      res.status(500).send({
        message: "Server Error",
        error: error.message,
      });
    }
  },

  //update company by id.
  updateCompany: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { headers } = req;
      const accessToken = headers.authorization?.split(" ")[1];
      const { files } = req;
      const inputFiles = files;
      let logoImage = "";
      let headerImage = "";
      if (inputFiles.logoImage) {
        logoImage = inputFiles.logoImage[0]?.path;
      }
      if (inputFiles.headerImage) {
        headerImage = inputFiles.headerImage[0]?.path;
      }
      const images = {
        logoImage,
        headerImage,
      };
      const companyInput = {
        companyName: req.body.companyName,
        companyTagline: req.body.companyTagline,
        category: req.body.category,
        companyEmail: req.body.companyEmail,
        phoneNumber: req.body.phoneNumber,
        eatablishedDate: req.body.eatablishedDate,
        companyWebsite: req.body.companyWebsite,
        avarageSalary: req.body.avarageSalary,
        companySize: req.body.companySize,
        description: req.body.description,
        location: req.body.location,
        locationMap: {
          latitude: req.body.locationLatitude,
          longitude: req.body.locationLongitude,
        },
        videoLink: req.body.videoLink,
        socialLink: {
          linkedin: req.body.linkedinLink,
          facebook: req.body.facebookLink,
          twitter: req.body.twitterLink,
        },
      };

      const reqQuery = {
        accessToken,
        companyInput,
        images,
        companyId: id,
      };
      const company = await updateCompany(reqQuery);

      res.status(200).send({
        message: "Successfully Updated Company Profile",
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

  //get companies private.
  getCompaniesPrivate: async (req, res, next) => {
    try {
      const { headers } = req;
      const accessToken = headers.authorization?.split(" ")[1];
      const companies = await findCompanyPrivate(accessToken);

      res.status(200).send({
        message: "Successfully fetched all private companies",
        data: companies,
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
      const { id } = req.params;
      const { headers } = req;
      const accessToken = headers.authorization?.split(" ")[1];
      const reqQuery = {
        accessToken,
        companyId: id,
      };
      const company = await deleteCompany(reqQuery);

      res.status(200).send({
        message: "Successfully deleted company",
      });
    } catch (e) {
      res.status(500).send({
        message: "Server Error",
        error: e.message,
      });
    }
  },

  //delete company
  updateStatusCompany: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { headers } = req;
      const accessToken = headers.authorization?.split(" ")[1];
      const rewQuery = {
        accessToken,
        companyId: id,
        companyStatus: req.body.status,
      };
      const message = await updateCompanyStatus(rewQuery);

      res.status(200).send({
        message,
      });
    } catch (e) {
      res.status(500).send({
        message: "Server Error",
        error: e.message,
      });
    }
  },
};

export default companyController;

// find all company profile  private
export async function findCompanyPrivate(accessToken) {
  try {
    const user = await requireEmployer(accessToken);
    const userID = user._id;
    const adminRole = user.role.isAdmin;
    if (adminRole === true) {
      const company = await Company.find({}).lean(true);
      return company;
    }
    const company1 = await Company.find({
      user: userID,
    }).lean(true);
    return company1;
  } catch (e) {
    throw e;
  }
}
// create company profile handller
export async function createCompany(reqQuery) {
  try {
    const { accessToken, companyInput, images } = reqQuery;
    const userInfo = await requireEmployer(accessToken);
    const userId = userInfo._id;
    const companyInputData = {
      ...companyInput,
      user: userId,
    };
    const company = await createCompanyService(companyInputData, images);
    return company;
  } catch (e) {
    throw e;
  }
}

// update company profile handller
export async function updateCompany(reqQuery) {
  try {
    const { accessToken, companyId, companyInput, images } = reqQuery;
    const userInfo = await requireEmployer(accessToken);
    const userId = userInfo._id;
    const userEmail = userInfo.email;
    // update a company profile
    const company = await updateCompanyService(companyId, companyInput, images);
    return company;
  } catch (e) {
    throw e;
  }
}

// comapny status update
export async function updateCompanyStatus(rewQuery) {
  try {
    const user = await requireUser(rewQuery.accessToken);
    const query = {
      userId: user._id,
      adminRole: user.role.isAdmin,
      companyId: rewQuery.companyId,
      companyStatus: rewQuery.companyStatus,
    };
    const company = await updateCompanyStatusService(query);
    return company;
  } catch (e) {
    throw e;
  }
}

// delete company profile
export async function deleteCompany(reqQuery) {
  try {
    await requireEmployer(reqQuery.accessToken);
    const companyID = reqQuery.companyId;
    const company = await deleteCompanyService(companyID);
    return company;
  } catch (e) {
    throw e;
  }
}

export async function getSingleCompany(companyID) {
  try {
    const companyResult = await getSingleCompanyService(companyID);
    return companyResult;
  } catch (e) {
    throw e;
  }
}
