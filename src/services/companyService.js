import { Company } from "../Models/CompanyModel.js";
import { Job } from "../Models/JobModel.js";
import Cloud from "../utils/cloudinary.js";

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
// create a company profile service
export async function createCompanyService(input, images) {
  try {
    let companyInput;
    if (images) {
      let logoImageInput = null;
      let headerImageInput = null;
      if (images.logoImage) {
        // Upload image to cloudinary
        const logoImageData = await Cloud.uploader.upload(images.logoImage);
        logoImageInput = {
          logo: logoImageData == null ? void 0 : logoImageData.secure_url,
          logoCloudinary_id:
            logoImageData == null ? void 0 : logoImageData.public_id,
        };
      }
      if (images.headerImage) {
        // Upload image to cloudinary
        const headerImageData = await Cloud.uploader.upload(images.headerImage);
        headerImageInput = {
          thumb: headerImageData == null ? void 0 : headerImageData.secure_url,
          thumbCloudinary_id:
            headerImageData == null ? void 0 : headerImageData.public_id,
        };
      }
      companyInput = {
        ...input,
        ...logoImageInput,
        ...headerImageInput,
      };
    } else {
      companyInput = {
        ...input,
      };
    }
    const company = await Company.create(companyInput);
    return company;
  } catch (e) {
    throw e;
  }
}
// update a company profile service
export async function updateCompanyService(companyID, update, images) {
  try {
    let companyUpdate;
    if (images) {
      let logoImageInput = null;
      let headerImageInput = null;
      if (images.logoImage) {
        const companyPrevData = await Company.findById(companyID);
        if (companyPrevData.logoCloudinary_id) {
          await Cloud.uploader.destroy(companyPrevData.logoCloudinary_id);
        }
        const logoImageData = await Cloud.uploader.upload(images.logoImage);
        logoImageInput = {
          logo: logoImageData == null ? void 0 : logoImageData.secure_url,
          logoCloudinary_id:
            logoImageData == null ? void 0 : logoImageData.public_id,
        };
      }
      if (images.headerImage) {
        const companyPrevData1 = await Company.findById(companyID);
        if (companyPrevData1.thumbCloudinary_id) {
          await Cloud.uploader.destroy(companyPrevData1.thumbCloudinary_id);
        }
        const headerImageData = await Cloud.uploader.upload(images.headerImage);
        headerImageInput = {
          thumb: headerImageData == null ? void 0 : headerImageData.secure_url,
          thumbCloudinary_id:
            headerImageData == null ? void 0 : headerImageData.public_id,
        };
      }
      companyUpdate = {
        ...update,
        ...logoImageInput,
        ...headerImageInput,
      };
    } else {
      companyUpdate = {
        ...update,
      };
    }
    const company = await Company.findByIdAndUpdate(companyID, companyUpdate, {
      new: true,
    });
    return company;
  } catch (e) {
    throw e;
  }
}
// company status update service
export async function updateCompanyStatusService(query) {
  try {
    const { userId, adminRole, companyId, companyStatus } = query;
    // find the job based on id
    const company = await Company.findById(companyId).populate("user", [
      "email",
    ]);
    if (!company) {
      throw new Error("Company Not Found");
    }
    if (adminRole === true) {
      switch (companyStatus) {
        case "approved":
          company.status.isApproved = true;
          company.save();
          // let emails;
          // emails = await findEmailByEmailType("COMPANY_APPROVED");
          // if (emails.length === 0) {
          //     const templateInput = {
          //         senderAddress: "Meta Jobs",
          //         subject: "Your Company is Approved",
          //         message: "Congrats..!! Your Company is Approved",
          //         emailType: "COMPANY_APPROVED"
          //     };
          //     await createEmail(templateInput);
          //     emails = await findEmailByEmailType("COMPANY_APPROVED");
          // }
          // const emailData = emails[0];
          // const approvalInput = {
          //     userEmail: company.user.email,
          //     emailData,
          //     userId,
          //     emailType: "COMPANY_APPROVED"
          // };
          // await sendNotificationEmail(approvalInput);
          return "Company approved successfully";
        case "rejected":
          company.status.isApproved = false;
          company.save();
          // let rejectedEmails;
          // rejectedEmails = await findEmailByEmailType("COMPANY_REJECTED");
          // if (rejectedEmails.length === 0) {
          //     const templateInput1 = {
          //         senderAddress: "Meta-Jobs",
          //         subject: "Your Company is Rejected",
          //         message: "Sorry..!! Your Company is Rejected",
          //         emailType: "COMPANY_REJECTED"
          //     };
          //     await createEmail(templateInput1);
          //     rejectedEmails = await findEmailByEmailType("COMPANY_REJECTED");
          // }
          // const rejectedEmailData = rejectedEmails[0];
          // const rejectlInput = {
          //     userEmail: company.user.email,
          //     emailData: rejectedEmailData,
          //     userId,
          //     emailType: "COMPANY_REJECTED"
          // };
          // await sendNotificationEmail(rejectlInput);
          return "Company rejected by Admin";
        case "expired":
          company.status.isActive = false;
          company.save();
          // let expireCompanyResult;
          // expireCompanyResult = await findEmailByEmailType("COMPANY_EXPIRED");
          // if (expireCompanyResult.length === 0) {
          //     const templateInput2 = {
          //         senderAddress: "Meta-Jobs",
          //         subject: "Your Company profile is expired",
          //         message: "Sorry..!! Your company profile  is expired",
          //         emailType: "COMPANY_EXPIRED"
          //     };
          //     await createEmail(templateInput2);
          //     expireCompanyResult = await findEmailByEmailType("COMPANY_EXPIRED");
          // }
          // const expireCompanyData = expireCompanyResult[0];
          // const expireInput = {
          //     userEmail: company.user.email,
          //     emailData: expireCompanyData,
          //     userId,
          //     emailType: "COMPANY_EXPIRED"
          // };
          // await sendNotificationEmail(expireInput);
          return "Company expired successfully";
        case "active":
          company.status.isActive = true;
          company.save();
          // let activatedCompanyResult;
          // activatedCompanyResult = await findEmailByEmailType("COMPANY_ACTIVATED");
          // if (activatedCompanyResult.length === 0) {
          //     const templateInput3 = {
          //         senderAddress: "Meta-Jobs",
          //         subject: "Your Company is Activated",
          //         message: "Congrats..!! Your Company is Activated",
          //         emailType: "COMPANY_ACTIVATED"
          //     };
          //     await createEmail(templateInput3);
          //     activatedCompanyResult = await findEmailByEmailType("COMPANY_ACTIVATED");
          // }
          // const activatedCompanyData = activatedCompanyResult[0];
          // const activatedInput = {
          //     userEmail: company.user.email,
          //     emailData: activatedCompanyData,
          //     userId,
          //     emailType: "COMPANY_ACTIVATED"
          // };
          // await sendNotificationEmail(activatedInput);
          return "Company activated successfully";
        case "draft":
          company.status.isPublished = false;
          company.save();
          // let draftCompanyResult;
          // draftCompanyResult = await findEmailByEmailType("COMPANY_DRAFTED");
          // if (draftCompanyResult.length === 0) {
          //   const templateInput4 = {
          //     senderAddress: "Meta-Jobs",
          //     subject: "Your Company is in Draft",
          //     message: "Congrats..!! Your Company is in Draft",
          //     emailType: "COMPANY_DRAFTED",
          //   };
          //   await createEmail(templateInput4);
          //   draftCompanyResult = await findEmailByEmailType("COMPANY_DRAFTED");
          // }
          // const draftCompanyData = draftCompanyResult[0];
          // const draftInput = {
          //   userEmail: company.user.email,
          //   emailData: draftCompanyData,
          //   userId,
          //   emailType: "COMPANY_DRAFTED",
          // };
          // await sendNotificationEmail(draftInput);
          return "Company draft successfully";
        case "published":
          company.status.isPublished = true;
          company.save();
          // let publishedCompanyResult;
          // publishedCompanyResult = await findEmailByEmailType(
          //   "COMPANY_PUBLISHED"
          // );
          // if (publishedCompanyResult.length === 0) {
          //   const templateInput5 = {
          //     senderAddress: "Meta-Jobs",
          //     subject: "Your Company is in Published",
          //     message: "Congrats..!! Your Company is Published",
          //     emailType: "COMPANY_PUBLISHED",
          //   };
          //   await createEmail(templateInput5);
          //   publishedCompanyResult = await findEmailByEmailType(
          //     "COMPANY_PUBLISHED"
          //   );
          // }
          // const publishedCompanyData = publishedCompanyResult[0];
          // const publishedCompanyInput = {
          //   userEmail: company.user.email,
          //   emailData: publishedCompanyData,
          //   userId,
          //   emailType: "COMPANY_PUBLISHED",
          // };
          // await sendNotificationEmail(publishedCompanyInput);
          return "Company published successfully";
        default:
          throw new Error("Invalid status");
      }
    }
    switch (companyStatus) {
      case "draft":
        company.status.isPublished = false;
        company.save();
        // let draftCompanyResult1;
        // draftCompanyResult1 = await findEmailByEmailType("COMPANY_DRAFTED");
        // if (draftCompanyResult1.length === 0) {
        //   const templateInput6 = {
        //     senderAddress: "Meta-Jobs",
        //     subject: "Your Company is in Draft",
        //     message: "Congrats..!! Your Company is in Draft",
        //     emailType: "COMPANY_DRAFTED",
        //   };
        //   await createEmail(templateInput6);
        //   draftCompanyResult1 = await findEmailByEmailType("COMPANY_DRAFTED");
        // }
        // const draftCompanyData1 = draftCompanyResult1[0];
        // const draftInput1 = {
        //   userEmail: company.user.email,
        //   emailData: draftCompanyData1,
        //   userId,
        //   emailType: "COMPANY_DRAFTED",
        // };
        // await sendNotificationEmail(draftInput1);
        return "Company draft successfully";
      case "published":
        company.status.isPublished = true;
        company.save();
        // let publishedCompanyResult1;
        // publishedCompanyResult1 = await findEmailByEmailType(
        //   "COMPANY_PUBLISHED"
        // );
        // if (publishedCompanyResult1.length === 0) {
        //   const templateInput7 = {
        //     senderAddress: "Meta-Jobs",
        //     subject: "Your Company is in Published",
        //     message: "Congrats..!! Your Company is Published",
        //     emailType: "COMPANY_PUBLISHED",
        //   };
        //   await createEmail(templateInput7);
        //   publishedCompanyResult1 = await findEmailByEmailType(
        //     "COMPANY_PUBLISHED"
        //   );
        // }
        // const publishedCompanyData1 = publishedCompanyResult1[0];
        // const publishedCompanyInput1 = {
        //   userEmail: company.user.email,
        //   emailData: publishedCompanyData1,
        //   userId,
        //   emailType: "COMPANY_PUBLISHED",
        // };
        // await sendNotificationEmail(publishedCompanyInput1);
        return "Company published successfully";
      default:
        throw new Error("Invalid status");
    }
  } catch (e) {
    throw e;
  }
}
// delete a company profile service
export async function deleteCompanyService(companyID) {
  try {
    // Delete image from cloudinary
    const companyPrevData = await Company.findById(companyID);
    if (companyPrevData == null ? void 0 : companyPrevData.logoCloudinary_id) {
      await Cloud.uploader.destroy(companyPrevData.logoCloudinary_id);
    }
    if (companyPrevData == null ? void 0 : companyPrevData.thumbCloudinary_id) {
      await Cloud.uploader.destroy(companyPrevData.thumbCloudinary_id);
    }
    const company = await Company.findByIdAndDelete(companyID);
    if (!company) {
      throw new Error("Company Not Found");
    }
    // const companyData = await Company.findById(companyID).populate(
    //   "user",
    //   ["email"]
    // );
    // const emailType = "COMPANY_DELETED";
    // let emails;
    // emails = await findEmailByEmailType(emailType);
    // if (emails.length === 0) {
    //   const templateInput = {
    //     senderAddress: "Meta-Jobs",
    //     subject: "Your Company Profile Deleted",
    //     message: "Your company profile is deleted",
    //     emailType: "COMPANY_DELETED",
    //   };
    //   await createEmail(templateInput);
    //   emails = await findEmailByEmailType("COMPANY_DELETED");
    // }
    // const emailData = emails[0];
    // const inputEmailData = {
    //   userEmail: companyData == null ? void 0 : companyData.user.email,
    //   emailData,
    //   userID: companyData == null ? void 0 : companyData.user._id,
    //   emailType,
    // };
    // sendNotificationEmail(inputEmailData);
    return company;
  } catch (e) {
    throw e;
  }
}
export async function getSingleCompanyService(companyID) {
  try {
    const company = await Company.findById(companyID).lean(true);
    if (!company) {
      throw new Error("Company Profile Not Found");
    }
    // find the all job based company id
    const jobs = await Job.find({
      company: companyID,
      "status.isApproved": true,
      "status.isPublished": true,
      "status.isActive": true,
    }).lean(true);
    return {
      company,
      jobs,
    };
  } catch (e) {
    throw e;
  }
}
