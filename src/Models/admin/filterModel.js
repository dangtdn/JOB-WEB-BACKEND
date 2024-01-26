import mongoose from "mongoose";

const filterSchema = new mongoose.Schema({
  jobTypes: {
    type: [String],
  },
  jobExperience: {
    type: [String],
  },
  companySize: {
    type: [String],
  },
  avarageSalary: {
    type: [String],
  },
  revenue: {
    type: [String],
  },
  region: {
    type: [String],
  },
  tags: {
    type: [String],
  },
  skills: {
    type: [String],
  },
});

const FilterModel = mongoose.model("FilterModel", filterSchema);
export default FilterModel;
