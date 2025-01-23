import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

// Validate Cloudinary environment variables
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error("Cloudinary environment variables are not set");
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file to Cloudinary
 * @param localFilePath - Path to the local file to upload
 * @returns Promise<UploadApiResponse | null> - Cloudinary upload response or null if upload fails
 */
const uploadOnCloudinary = async (
  localFilePath: string
): Promise<UploadApiResponse | null> => {
  try {
    if (!localFilePath) return null;

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // File uploaded successfully
    return response;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return null;
  }
};

/**
 * Delete a file from Cloudinary
 * @param fileId - The public ID of the file to delete
 * @param resourceType - The type of resource (default: "image")
 * @returns Promise<{ result: string } | null> - Cloudinary delete response or null if deletion fails
 */
const deleteFromCloudinary = async (
  fileId: string,
  resourceType: string = "image"
): Promise<{ result: string } | null> => {
  try {
    if (!fileId) {
      console.error("File ID is missing.");
      return null;
    }

    const response = await cloudinary.uploader.destroy(fileId, {
      resource_type: resourceType,
    });

    if (response.result !== "ok") {
      console.error("Failed to delete file from Cloudinary:", response);
      return null;
    }

    return response;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return null;
  }
};

/**
 * Extract the file ID from a Cloudinary URL
 * @param fileUrl - The Cloudinary file URL
 * @returns string | null - The extracted file ID or null if extraction fails
 */
const extractCloudinaryFileId = (fileUrl: string): string | null => {
  try {
    const urlParts = new URL(fileUrl).pathname.split("/");
    return urlParts[urlParts.length - 1].split(".")[0]; // Extract file ID
  } catch (error) {
    console.error("Error extracting file ID from URL:", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary, extractCloudinaryFileId };