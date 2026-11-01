import multer from "multer";

// Use in-memory buffer storage to avoid disk write permission issues on Windows/Linux
const storage = multer.memoryStorage();

// Validate file type (supports images and videos)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    // Image formats
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
    // Video formats
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/quicktime",
    "video/x-matroska",
    "video/avi",
    "video/mpeg",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}. Only image and video files are allowed.`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB maximum file size (accommodates high-res videos & images)
  },
});

/**
 * Middleware for uploading a single file
 * @param {string} fieldName - Form field name (e.g. "image", "coverImage")
 */
export const uploadSingle = (fieldName = "image") => upload.single(fieldName);

/**
 * Middleware for uploading news media (supports both cover image and news video)
 */
export const uploadNewsMedia = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "video", maxCount: 1 },
]);

/**
 * Middleware for uploading artist media (supports portrait avatar and studio cover image)
 */
export const uploadArtistMedia = upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
  { name: "image", maxCount: 1 },
]);

/**
 * Middleware for uploading multiple files under one field name
 * @param {string} fieldName - Form field name (e.g. "images")
 * @param {number} maxCount - Maximum allowed files
 */
export const uploadMultiple = (fieldName = "images", maxCount = 10) =>
  upload.array(fieldName, maxCount);

/**
 * Middleware for uploading specific fields
 * @param {Array<{ name: string, maxCount: number }>} fields
 */
export const uploadFields = (fields) => upload.fields(fields);

export default upload;

