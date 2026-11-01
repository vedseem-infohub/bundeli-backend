import multer from "multer";

// Use in-memory buffer storage to avoid disk write permission issues on Windows/Linux
const storage = multer.memoryStorage();

// Validate file type
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}. Only image files are allowed.`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB maximum file size
  },
});

/**
 * Middleware for uploading a single file
 * @param {string} fieldName - Form field name (e.g. "image", "coverImage")
 */
export const uploadSingle = (fieldName = "image") => upload.single(fieldName);

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

