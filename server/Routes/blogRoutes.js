import express from "express";
import { protect } from "../Middlewares/auth.js";
import { getAllBlogs, getBlogById, getMyBlogs, reportBlog, upsertBlog } from "../Controllers/BlogController.js";
import { uploadBlogImage } from "../Middlewares/multer.js";


const router = express.Router();

router.get("/", protect, getAllBlogs);

router.get("/my", protect, getMyBlogs);

router.post("/upsert", protect, uploadBlogImage, upsertBlog);

router.post("/report", protect, reportBlog);

router.get("/:id", protect, getBlogById);

export default router;