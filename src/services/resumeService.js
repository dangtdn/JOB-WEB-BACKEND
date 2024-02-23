// create resume service
export async function createResumeService(input, inputFiles) {
  try {
    let imageInput = null;
    let fileInput = null;
    if (inputFiles.image) {
      const imageData = await cloudinary.uploader.upload(inputFiles.image);
      imageInput = {
        photo: imageData == null ? void 0 : imageData.secure_url,
        photoCloudinary_id: imageData == null ? void 0 : imageData.public_id,
      };
    }
    if (inputFiles.resumeFile) {
      const fileData = await cloudinary.uploader.upload(inputFiles.resumeFile);
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
