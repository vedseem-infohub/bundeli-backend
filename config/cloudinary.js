import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a memory buffer directly to Cloudinary
 * @param {Buffer} buffer - File buffer from multer memoryStorage
 * @param {string} folder - Target Cloudinary folder
 * @param {object} options - Optional cloudinary upload parameters
 * @returns {Promise<{ url: string, public_id: string, secure_url: string }>}
 */
export const uploadBufferToCloudinary = (buffer, folder = "bundeli-kalavrat", options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
        ...options,
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(error);
        }
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

/**
 * Delete an asset from Cloudinary by public ID
 * @param {string} publicId
 * @returns {Promise<any>}
 */
export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return null;
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.warn(`Cloudinary deletion warning for ${publicId}:`, error?.message || error);
    return null;
  }
};

export default cloudinary;

