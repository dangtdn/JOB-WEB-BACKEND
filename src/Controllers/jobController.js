import { Job } from "../Models/JobModel.js";
import { Category } from "../Models/CategoryModel.js";
import ErrorResponse from "../utils/errorResponse.js";
import Cloud from "../utils/cloudinary.js";

const JobController = {
  //create job
  createJob: async (req, res, next) => {
    try {
      let jobInput;
      if (req.body.headerImage) {
        // Upload image to cloudinary
        const headerImageData = await Cloud.uploader.upload(headerImage);
        jobInput = {
          ...req.body.job,
          avatar: headerImageData.secure_url,
          avatarCloudinary_id: headerImageData.public_id,
        };
      } else {
        jobInput = {
          ...req.body.job,
        };
      }
      const job = await Job.create(jobInput);
      res.status(201).json({
        success: true,
        job,
      });
    } catch (error) {
      next(error);
    }
  },

  //single job
  singleJob: async (req, res, next) => {
    try {
      const job = await Job.findById(req.params.id);
      res.status(200).json({
        success: true,
        job,
      });
    } catch (error) {
      next(error);
    }
  },

  //update job by id.
  updateJob: async (req, res, next) => {
    try {
      const job = await Job.findByIdAndUpdate(req.params.job_id, req.body, {
        new: true,
      })
        .populate("Category", "CategoryName")
        .populate("user", "firstName lastName");
      res.status(200).json({
        success: true,
        job,
      });
    } catch (error) {
      next(error);
    }
  },

  //update job by id.
  showJobs: async (req, res, next) => {
    //enable search
    const keyword = req.query.keyword
      ? {
          title: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

    // filter jobs by category ids
    let ids = [];
    const jobCategory = await Category.find({}, { _id: 1 });
    jobCategory.forEach((cat) => {
      ids.push(cat._id);
    });

    let cat = req.query.cat;
    let categ = cat !== "" ? cat : ids;

    //jobs by location
    let locations = [];
    const jobByLocation = await Job.find({}, { location: 1 });
    jobByLocation.forEach((val) => {
      locations.push(val.location);
    });
    let setUniqueLocation = [...new Set(locations)];
    let location = req.query.location;
    let locationFilter = location !== "" ? location : setUniqueLocation;

    //enable pagination
    const pageSize = 5;
    const page = Number(req.query.pageNumber) || 1;
    //const count = await Job.find({}).estimatedDocumentCount();
    const count = await Job.find({
      ...keyword,
      jobType: categ,
      location: locationFilter,
    }).countDocuments();

    try {
      const jobs = await Job.find({
        ...keyword,
        jobType: categ,
        location: locationFilter,
      })
        .sort({ createdAt: -1 })
        .skip(pageSize * (page - 1))
        .limit(pageSize);
      res.status(200).json({
        success: true,
        jobs,
        page,
        pages: Math.ceil(count / pageSize),
        count,
        setUniqueLocation,
      });
    } catch (error) {
      next(error);
    }
  },
  getJobs: async (req, res, next) => {
    try {
      async function getJobsService() {
        try {
          // const jobs = await JobModel.find(arg).lean(true)
          const jobs = await Job.find({
            "status.isApproved": true,
            "status.isPublished": true,
            "status.isFeatured": true,
            "status.isActive": true,
          })
            .populate("company", [
              "companyName",
              "companyTagline",
              "logo",
              "companyEmail",
              "phoneNumber",
              "companyWebsite",
              "socialLink",
            ])
            .lean(true);
          return jobs;
        } catch (e) {
          throw e;
        }
      }

      const jobs = await getJobsService();
      res.status(200).json({
        success: true,
        jobs,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default JobController;
