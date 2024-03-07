import ResumeModel from "../Models/ResumeModel.js";
import Cloud from "../utils/cloudinary.js";

// create resume service
export async function createResumeService(input, inputFiles) {
  try {
    let imageInput = null;
    let fileInput = null;
    if (inputFiles.image) {
      const imageData = await Cloud.uploader.upload(inputFiles.image);
      imageInput = {
        photo: imageData == null ? void 0 : imageData.secure_url,
        photoCloudinary_id: imageData == null ? void 0 : imageData.public_id,
      };
    }
    if (inputFiles.resumeFile) {
      const fileData = await Cloud.uploader.upload(inputFiles.resumeFile);
      fileInput = {
        file: fileData == null ? void 0 : fileData.secure_url,
        fileCloudinary_id: fileData == null ? void 0 : fileData.public_id,
      };
    }
    const resumeTotalInput = {
      ...input,
      ...imageInput,
      ...fileInput,
    };
    console.log("resumeTotalInput: ", resumeTotalInput);
    const resume = await ResumeModel.create(resumeTotalInput);
    return resume;
  } catch (e) {
    throw e;
  }
}
// find all resumes for the adminRole
export async function findAdminResumeService() {
  try {
    const resumes = await ResumeModel.find({}).lean(true);
    return resumes;
  } catch (e) {
    throw e;
  }
}
// update resume image and files service
export async function updateResumeService(resumeId, input, inputFiles) {
  try {
    let resumeTotalInput;
    if (inputFiles) {
      let imageInput = null;
      let fileInput = null;
      if (inputFiles == null ? void 0 : inputFiles.image) {
        const resumePrevData = await ResumeModel.findById(resumeId);
        if (resumePrevData.photoCloudinary_id) {
          await cloudinary.uploader.destroy(resumePrevData.photoCloudinary_id);
        }
        const imageData = await cloudinary.uploader.upload(inputFiles.image);
        imageInput = {
          photo: imageData == null ? void 0 : imageData.secure_url,
          photoCloudinary_id: imageData == null ? void 0 : imageData.public_id,
        };
      }
      if (inputFiles == null ? void 0 : inputFiles.resumeFile) {
        const resumePrevData1 = await ResumeModel.findById(resumeId);
        if (resumePrevData1.fileCloudinary_id) {
          await cloudinary.uploader.destroy(resumePrevData1.fileCloudinary_id);
        }
        const fileData = await cloudinary.uploader.upload(
          inputFiles.resumeFile
        );
        fileInput = {
          file: fileData == null ? void 0 : fileData.secure_url,
          fileCloudinary_id: fileData == null ? void 0 : fileData.public_id,
        };
      }
      resumeTotalInput = {
        ...input,
        ...imageInput,
        ...fileInput,
      };
    } else {
      resumeTotalInput = {
        ...input,
      };
    }
    const resume = await ResumeModel.findByIdAndUpdate(
      resumeId,
      resumeTotalInput,
      {
        new: true,
      }
    );
    return resume;
  } catch (e) {
    throw e;
  }
}
// delete resume service
export async function deleteResumeService(resumeId) {
  try {
    // Delete image and files from cloudinary
    const resumePrevData = await ResumeModel.findById(resumeId);
    if (resumePrevData == null ? void 0 : resumePrevData.photoCloudinary_id) {
      await Cloud.uploader.destroy(resumePrevData.photoCloudinary_id);
    }
    if (resumePrevData == null ? void 0 : resumePrevData.fileCloudinary_id) {
      await Cloud.uploader.destroy(resumePrevData.fileCloudinary_id);
    }
    const resume = await ResumeModel.findByIdAndDelete(resumeId);
    return resume;
  } catch (e) {
    throw e;
  }
}
// find all resumes service by property (used in private, ..)
export async function findResumeService(query) {
  try {
    const resumes = await ResumeModel.find(query).lean(true);
    return resumes;
  } catch (e) {
    throw e;
  }
}
export async function getSingleResumeService(resumeId) {
  try {
    const resume = await ResumeModel.findById(resumeId);
    return resume;
  } catch (e) {
    throw e;
  }
}

// find all private resume service
export async function resumeStatusUpdateService(query) {
  try {
    const { userId, adminRole, resumeId, resumeStatus } = query;
    // find the job based on id
    const resume = await ResumeModel.findById(resumeId).populate("user", [
      "email",
    ]);
    if (!resume) {
      throw new Error("Resume Not Found");
    }
    if (adminRole === true) {
      switch (resumeStatus) {
        case "approved":
          resume.status.isApproved = true;
          resume.save();
          // let emails;
          // emails = await findEmailByEmailType("RESUME_APPROVED");
          // if (emails.length === 0) {
          //     const templateInput = {
          //         senderAddress: "Meta-Jobs",
          //         subject: "Your Resume is Approved",
          //         message: "Congrats..!! Your Resume is Approved",
          //         emailType: "RESUME_APPROVED"
          //     };
          //     await createEmail(templateInput);
          //     emails = await findEmailByEmailType("RESUME_APPROVED");
          // }
          // const emailData = emails[0];
          // const approvalInput = {
          //     userEmail: resume.user.email,
          //     emailData,
          //     userId,
          //     emailType: "RESUME_APPROVED"
          // };
          // await sendNotificationEmail(approvalInput);
          return "Resume approved successfully";
        case "rejected":
          resume.status.isApproved = false;
          resume.save();
          // let rejectedEmails;
          // rejectedEmails = await findEmailByEmailType("RESUME_REJECTED");
          // if (rejectedEmails.length === 0) {
          //     const templateInput1 = {
          //         senderAddress: "Meta-Jobs",
          //         subject: "Your Resume is Rejected",
          //         message: "Sorry..!! Your Resume is Rejected",
          //         emailType: "RESUME_REJECTED"
          //     };
          //     await createEmail(templateInput1);
          //     rejectedEmails = await findEmailByEmailType("RESUME_REJECTED");
          // }
          // const rejectedEmailData = rejectedEmails[0];
          // const rejectlInput = {
          //     userEmail: resume.user.email,
          //     emailData: rejectedEmailData,
          //     userId,
          //     emailType: "RESUME_REJECTED"
          // };
          // await sendNotificationEmail(rejectlInput);
          return "Resume rejected by Admin";
        case "expired":
          resume.status.isActive = false;
          resume.save();
          // let activeResumeResult;
          // activeResumeResult = await findEmailByEmailType("RESUME_EXPIRED");
          // if (activeResumeResult.length === 0) {
          //     const templateInput2 = {
          //         senderAddress: "Meta-Jobs",
          //         subject: "Your Resume is Expired",
          //         message: "Congrats..!! Your Resume is Expired",
          //         emailType: "RESUME_EXPIRED"
          //     };
          //     await createEmail(templateInput2);
          //     activeResumeResult = await findEmailByEmailType("RESUME_EXPIRED");
          // }
          // const activeJobData = activeResumeResult[0];
          // const activeInput = {
          //     userEmail: resume.user.email,
          //     emailData: activeJobData,
          //     userId,
          //     emailType: "RESUME_EXPIRED"
          // };
          // await sendNotificationEmail(activeInput);
          return "Resume expired successfully";
        case "active":
          resume.status.isActive = true;
          resume.save();
          // let activatedJobResult;
          // activatedJobResult = await findEmailByEmailType("RESUME_ACTIVATED");
          // if (activatedJobResult.length === 0) {
          //     const templateInput3 = {
          //         senderAddress: "Meta-Jobs",
          //         subject: "Your Resume is Activated",
          //         message: "Congrats..!! Your Resume is Activated",
          //         emailType: "RESUME_ACTIVATED"
          //     };
          //     await createEmail(templateInput3);
          //     activatedJobResult = await findEmailByEmailType("RESUME_ACTIVATED");
          // }
          // const activatedResumeData = activatedJobResult[0];
          // const activatedInput = {
          //     userEmail: resume.user.email,
          //     emailData: activatedResumeData,
          //     userId,
          //     emailType: "RESUME_ACTIVATED"
          // };
          // await sendNotificationEmail(activatedInput);
          return "Resume activated successfully";
        case "draft":
          resume.status.isPublished = false;
          resume.save();
          // let draftResumeResult;
          // draftResumeResult = await findEmailByEmailType("RESUME_DRAFTED");
          // if (draftResumeResult.length === 0) {
          //     const templateInput4 = {
          //         senderAddress: "Meta-Jobs",
          //         subject: "Your Resume is in Draft",
          //         message: "Congrats..!! Your Resume is in Draft",
          //         emailType: "RESUME_DRAFTED"
          //     };
          //     await createEmail(templateInput4);
          //     draftResumeResult = await findEmailByEmailType("RESUME_DRAFTED");
          // }
          // const draftResumeData = draftResumeResult[0];
          // const draftInput = {
          //     userEmail: resume.user.email,
          //     emailData: draftResumeData,
          //     userId,
          //     emailType: "RESUME_DRAFTED"
          // };
          // await sendNotificationEmail(draftInput);
          return "Resume draft successfully";
        case "published":
          resume.status.isPublished = true;
          resume.save();
          // let publishedResumeResult;
          // publishedResumeResult = await findEmailByEmailType("RESUME_PUBLISHED");
          // if (publishedResumeResult.length === 0) {
          //     const templateInput5 = {
          //         senderAddress: "Meta-Jobs",
          //         subject: "Your Resume is in Published",
          //         message: "Congrats..!! Your Resume is Published",
          //         emailType: "RESUME_PUBLISHED"
          //     };
          //     await createEmail(templateInput5);
          //     publishedResumeResult = await findEmailByEmailType("RESUME_PUBLISHED");
          // }
          // const publishedResumeData = publishedResumeResult[0];
          // const publishedInput = {
          //     userEmail: resume.user.email,
          //     emailData: publishedResumeData,
          //     userId,
          //     emailType: "RESUME_PUBLISHED"
          // };
          // await sendNotificationEmail(publishedInput);
          return "Resume published successfully";
        default:
          throw new Error("Invalid status");
      }
    }
    switch (resumeStatus) {
      case "draft":
        resume.status.isPublished = false;
        resume.save();
        // let draftResumeResult1;
        // draftResumeResult1 = await findEmailByEmailType("RESUME_DRAFTED");
        // if (draftResumeResult1.length === 0) {
        //     const templateInput6 = {
        //         senderAddress: "Meta-Jobs",
        //         subject: "Your Resume is in Draft",
        //         message: "Congrats..!! Your Resume is in Draft",
        //         emailType: "RESUME_DRAFTED"
        //     };
        //     await createEmail(templateInput6);
        //     draftResumeResult1 = await findEmailByEmailType("RESUME_DRAFTED");
        // }
        // const draftResumeData1 = draftResumeResult1[0];
        // const draftInput1 = {
        //     userEmail: resume.user.email,
        //     emailData: draftResumeData1,
        //     userId,
        //     emailType: "RESUME_DRAFTED"
        // };
        // await sendNotificationEmail(draftInput1);
        return "Resume draft successfully";
      case "published":
        resume.status.isPublished = true;
        resume.save();
        // let publishedResumeResult1;
        // publishedResumeResult1 = await findEmailByEmailType("RESUME_PUBLISHED");
        // if (publishedResumeResult1.length === 0) {
        //     const templateInput7 = {
        //         senderAddress: "Meta-Jobs",
        //         subject: "Your Resume is in Published",
        //         message: "Congrats..!! Your Resume is Published",
        //         emailType: "RESUME_PUBLISHED"
        //     };
        //     await createEmail(templateInput7);
        //     publishedResumeResult1 = await findEmailByEmailType("RESUME_PUBLISHED");
        // }
        // const publishedResumeData1 = publishedResumeResult1[0];
        // const publishedInput1 = {
        //     userEmail: resume.user.email,
        //     emailData: publishedResumeData1,
        //     userId,
        //     emailType: "RESUME_PUBLISHED"
        // };
        // await sendNotificationEmail(publishedInput1);
        return "Resume published successfully";
      default:
        throw new Error("Invalid status");
    }
  } catch (e) {
    throw e;
  }
}
