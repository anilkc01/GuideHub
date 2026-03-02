import User from "../Models/User.js";
import Guide from "../Models/Guide.js";
import UserReport from "../Models/UserReports.js";
import BlogReport from "../Models/BlogReports.js";
import { Op } from "sequelize";
import Trip from "../Models/Trips.js";
import Blog from "../Models/Blog.js";
import { sendEmail } from "../Services/Email.js";

// 1. Get Users by Role (Trekker or Guide)
export const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query; // 'guide' or 'trekker'
    const users = await User.findAll({
      where: { role },
      attributes: ['id', 'fullName', 'email', 'phone', 'address', 'dp', 'status', 'role'],
      include: role === 'guide' ? [{ model: Guide, as: 'guideProfile' }] : [],
      order: [['createdAt', 'DESC']]
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; 

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.update({ status });

    // Notify User
    const subject = status === "active" ? "Account Reactivated" : "Account Suspended";
    const message = status === "active" 
      ? "Good news! Your account has been reactivated. You can now log in and use our services."
      : "We regret to inform you that your account has been suspended due to a policy violation. Please contact support for appeals.";

    await sendEmail(user.email, subject, `<p>Hello ${user.fullName},</p><p>${message}</p>`);

    res.json({ message: `User account is now ${status}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Get Pending Guide Verifications
export const getPendingVerifications = async (req, res) => {
  try {
    const verifications = await Guide.findAll({
      where: { status: 'pending' },
      include: [{ model: User, as: 'user', attributes: ['fullName', 'dp', 'email'] }]
    });
    res.json(verifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Resolve Reports
export const getReports = async (req, res) => {
  try {
    const { type } = req.params; // 'users' or 'blogs'
    let reports;
    if (type === 'users') {
      reports = await UserReport.findAll({ include: ['reporter', 'reportedUser'] });
    } else {
      reports = await BlogReport.findAll({ include: ['blog', 'reporter'] });
    }
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: ['id', 'fullName', 'email', 'phone', 'address', 'dp', 'status', 'role', 'rating']
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const reportsCount = await UserReport.count({ 
      where: { toId: id, status: 'pending' } 
    });

    const completedCount = await Trip.count({
      where: {
        status: 'completed',
        [Op.or]: [
          { trekkerId: id },
          { guideId: id }
        ]
      }
    });

    res.json({ 
      ...user.toJSON(), 
      reportsCount,
      stats: {
        completedTreks: completedCount
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserReports = async (req, res) => {
  try {
    const reports = await UserReport.findAll({
      where: { 
        toId: req.params.id, 
        status: 'pending' 
      },
      include: [
        { 
          model: User, 
          as: 'reporter', 
          attributes: ['fullName'] 
        }
      ]
    });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resolveUserReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    const report = await UserReport.findByPk(reportId);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    report.status = "resolved";
    await report.save();

    res.status(200).json({ 
      message: "Report marked as resolved successfully",
      report 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBlogReports = async (req, res) => {
  try {
    const { id } = req.params; 

    const reports = await BlogReport.findAll({
      where: { 
        blogId: id, 
        status: 'pending' 
      },
      include: [
        { 
          model: User, 
          as: 'reporter', 
          attributes: ['id', 'fullName'] 
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeBlogAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the blog
    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Update status to 'hidden' (effectively suspending it)
    blog.status = 'hidden';
    await blog.save();

    res.json({ message: "Blog has been hidden successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resolveBlogReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    const report = await BlogReport.findByPk(reportId);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    report.status = "resolved";
    await report.save();

    res.json({ message: "Report marked as resolved" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGuideApplications = async (req, res) => {
  try {
    const { status } = req.query; // pending or rejected
    const guides = await Guide.findAll({
      where: { status: status || 'pending' },
      include: [{
        model: User,
        as: 'user',
        attributes: ['fullName', 'email', 'dp', 'address', 'dob','phone']
      }]
    });
    res.json(guides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateGuideStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const guide = await Guide.findByPk(id, {
      include: [{ model: User, as: "user", attributes: ["email", "fullName"] }]
    });

    if (!guide) return res.status(404).json({ message: "Guide application not found" });

    guide.status = status;
    await guide.save();

    // Notify Guide
    const subject = status === "verified" ? "Verification Approved!" : "Verification Update";
    const message = status === "verified"
      ? "Congratulations! Your guide credentials have been verified. You can now start bidding on trek plans."
      : "Unfortunately, your guide verification was rejected. Please ensure your documents are clear and valid, then try again.";

    await sendEmail(guide.user.email, subject, `<p>Hello ${guide.user.fullName},</p><p>${message}</p>`);

    res.json({ message: `Guide application marked as ${status}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};