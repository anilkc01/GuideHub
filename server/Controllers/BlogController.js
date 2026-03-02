import Blog from "../Models/Blog.js";
import BlogReport from "../Models/BlogReports.js";
import User from "../Models/User.js";


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
      where: { authorId: req.user.id },
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
      updateData.image = req.file.path.replace(/\\/g, "/"); // Clean path for Windows
    }

    if (id) {
      const blog = await Blog.findByPk(id);
      if (blog.authorId !== req.user.id) return res.status(403).json({ message: "Forbidden" });
      await blog.update(updateData);
      return res.json(blog);
    }
    
    const newBlog = await Blog.create({ 
      ...updateData, 
      authorId: req.user.id 
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

// Report a Blog
export const reportBlog = async (req, res) => {
  try {
    const { blogId, category, description } = req.body;
    await BlogReport.create({ blogId, reporterId: req.user.id, category, description });
    res.json({ message: "Report submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};