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
    const resumes = await ResumeModel.find(query);
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
