import { Job } from "../Models/JobModel.js";
import ResumeModel from "../Models/ResumeModel.js";
import { User } from "../Models/UserModel.js";
import { findBookmarks } from "./bookmarkService.js";
import { countPubishedCompany } from "./companyService.js";
import { countApplications } from "./jobApplyService.js";

// get user dashboard statistics handller
export async function getDashboardStat(user) {
  try {
    var ref;
    const userID = user == null ? void 0 : user.id;
    const query = {
      user: userID,
    };
    // total job count for Employees
    const totalJobCount = await Job.countDocuments({
      ...query,
    });
    // count the total isFeatured jobs for Employee
    const featuredJobCount = await Job.countDocuments({
      ...query,
      "status.isFeatured": true,
    });
    // count total isPublished jobs for admin from job  model
    const totalPublishedJobCount = await Job.countDocuments({
      "status.isPublished": true,
    });
    console.log("totalPublishedJobCount: ", totalPublishedJobCount);
    // count total isApproved jobs from job  model
    const approvedJobCount = await Job.countDocuments({
      ...query,
      "status.isApproved": true,
    });
    // total employer count for admin
    const totalEmployerCount = await User.countDocuments({
      "role.isEmployer": true,
    });
    //total resume count for a candidate
    const totalResumeCount = await ResumeModel.countDocuments({
      ...query,
    });
    //total isApproved resume count for a candidate
    const approvedResumeCount = await ResumeModel.countDocuments({
      ...query,
      "role.isApproved": true,
    });
    //total published resume count for admin
    const totalPublishedResumeCount = await ResumeModel.countDocuments({
      "status.isPublished": true,
    });
    //total resume count
    const activeResumeCount = await ResumeModel.countDocuments({
      ...query,
      "status.isActive": true,
    });
    const appliedJobCount = await countApplications(query);
    const publishedCompanyCount = await countPubishedCompany();
    const bookmarkData = await findBookmarks(userID);
    const bookmarkCount =
      ((ref = bookmarkData[0]) == null ? void 0 : ref.bookmarks.length) || 0;
    // response based on user role
    if (user.role.isAdmin) {
      return [
        {
          title: "Total Jobs",
          count: totalPublishedJobCount,
        },
        // {
        //   title: "Total Resumes",
        //   count: totalPublishedResumeCount,
        // },
        {
          title: "Total Employees",
          count: totalEmployerCount,
        },
        {
          title: "Total Companies",
          count: publishedCompanyCount,
        },
      ];
    } else if (user.role.isEmployer) {
      return [
        {
          title: "Total Jobs",
          count: totalJobCount,
        },
        {
          title: "Approved Jobs",
          count: approvedJobCount,
        },
        {
          title: "Bookmarked",
          count: bookmarkCount,
        },
      ];
    } else if (user.role.isCandidate) {
      return [
        // {
        //   title: "Total Resumes",
        //   count: totalResumeCount,
        // },
        {
          title: "Bookmarked",
          count: bookmarkCount,
        },
        {
          title: "Applied Jobs",
          count: appliedJobCount,
        },
      ];
    } else {
      throw new Error("You are not authorized to access this page");
    }
  } catch (e) {
    throw e;
  }
}
