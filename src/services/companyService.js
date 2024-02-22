import { Company } from "../Models/CompanyModel.js";

// count published company profile service
export async function countPubishedCompany() {
  try {
    const companies = await Company.countDocuments({
      "status.isPublished": true,
    });
    return companies;
  } catch (e) {
    throw e;
  }
}
