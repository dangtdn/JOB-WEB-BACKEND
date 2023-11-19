import { Job } from "../Models/JobModel.js";
import { Category } from "../Models/CategoryModel.js";
import ErrorResponse from "../utils/errorResponse.js";

const JobController = {
  //create job
  createJob: async (req, res, next) => {
    try {
      const job = await Job.create({
        title: req.body.title,
        description: req.body.description,
        salaryRange: req.body.salaryRange,
        location: req.body.location,
        jobType: req.body.jobType,
        status: req.body.status,
        category: req.body.category,
        company: req.body.company,
        specialTags: req.body.specialTags,
        user: req.user.id,
      });
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
};

export default JobController;
