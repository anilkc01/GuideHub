import multer from "multer";
import path from "path";
import fs from "fs";

// 1. Storage for Guide Documents (Nested by User ID)
const storageGuide = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.body.userId || req.params.userId;
    const uploadPath = `uploads/users/${userId}/`;

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// 2. Storage for Blogs (Flat Folder)
const storageBlogs = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/blogs/";

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `blog-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const storageUserFiles = multer.diskStorage({
  destination: (req, file, cb) => {
    // Check body, params, OR the user object attached by your protect middleware
    const userId = req.body.userId || req.params.userId || req.user?.id;
    const uploadPath = `uploads/users/${userId}/`;

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// Shared File Filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .png, .jpg, .webp and .jpeg format allowed!"), false);
  }
};

// EXPORT 1: Guide Documents (Multiple Fields)
export const uploadGuideDocs = multer({ 
  storage: storageGuide, 
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } 
}).fields([
  { name: "licenseImage", maxCount: 1 },
  { name: "citizenshipImage", maxCount: 1 },
  { name: "dpImage", maxCount: 1 }
]);

// EXPORT 2: Blog Images (Single Field)
export const uploadBlogImage = multer({
  storage: storageBlogs,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
}).single("image");

export const uploadSingleDp = multer({ 
  storage: storageUserFiles, 
  fileFilter,
  limits: { fileSize: 2 * 2024 * 2024 } 
}).single("dpImage");