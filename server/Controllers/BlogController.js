import Blog from "../Models/Blog.js";
import BlogReport from "../Models/BlogReports.js";
import User from "../Models/User.js";
import fs from "fs";
import path from "path";

// Fetch all published blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      where: { status: "published" },
      include: [{ model: User, as: "author", attributes: ["fullName", "dp"] }],
      order: [["createdAt", "DESC"]],
    });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch blogs by the logged-in user
export const getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      where: {
        authorId: req.user.id,
        where: { status: "published" },
      },
      include: [{ model: User, as: "author", attributes: ["fullName", "dp"] }],
    });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create or Update Blog
export const upsertBlog = async (req, res) => {
  try {
    const { id, title, location, content, status } = req.body;
    let updateData = { title, location, content, status };

    // If a new image was uploaded, add the path to the database
    if (req.file) {
      updateData.cover = req.file.path.replace(/\\/g, "/"); // Clean path for Windows
    }

    if (id) {
      const blog = await Blog.findByPk(id);
      if (blog.authorId !== req.user.id)
        return res.status(403).json({ message: "Forbidden" });
      await blog.update(updateData);
      return res.json(blog);
    }

    const newBlog = await Blog.create({
      ...updateData,
      authorId: req.user.id,
    });
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByPk(id, {
      include: [
        {
          model: User,
          as: "author",
          attributes: ["fullName", "dp", "role"],
        },
      ],
    });

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Check if user is the owner
    if (blog.authorId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Optional: Delete cover image from local storage
    if (blog.cover) {
      const filePath = path.join("uploads/blogs", path.basename(blog.cover));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await blog.update({ status: "hidden" });
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Report a Blog
export const reportBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    await BlogReport.create({
      blogId: id,
      reporterId: req.user.id,
      description,
    });

    res.json({ message: "Report submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
