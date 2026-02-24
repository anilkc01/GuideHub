
import { sequelize } from "../Database/database.js";
import Rating from "../Models/Ratings.js";
import TrekPlan from "../Models/TrekPlan.js";
import User from "../Models/User.js";
import UserReport from "../Models/UserReports.js";

// Get Profile for the UserDetailCard
export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const profile = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Rating,
          as: "receivedRatings",
          include: [
            {
              model: User,
              as: "reviewer",
              attributes: ["fullName", "dp"],
            },
          ],
        },
      ],
      order: [[ { model: Rating, as: "receivedRatings" }, "createdAt", "DESC"]]
    });

    if (!profile) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate Statistics for GuideHub Stats Section
    // For a Guide: Number of completed treks they were part of
    // For a Trekker: Number of plans they created
    const completedTreks = await TrekPlan.count({
      where: { 
        status: "completed",
        // This logic assumes we might eventually have a guideId on TrekPlan
        // For now, let's count plans associated with this user
        trekkerId: userId 
      }
    });

    // Mocking experience based on account age or a specific field if you add one later
    const accountAge = Math.floor((new Date() - new Date(profile.createdAt)) / (1000 * 60 * 60 * 24 * 365));
    
    // Combine everything into the format the frontend expects
    const responseData = {
      ...profile.toJSON(),
      isVerified: profile.status === "active", // Or based on your specific verification logic
      stats: {
        completedTreks: completedTreks || 0,
        experience: accountAge > 0 ? accountAge : 1,
      },
      reviews: profile.receivedRatings.map(r => ({
        id: r.id,
        rating: r.stars,
        comment: r.review,
        reviewer: r.reviewer
      }))
    };

    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
};

// Handle Rating/Review Submission
export const rateUser = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { userId } = req.params; // The guide being rated
    const { rating, comment } = req.body;
    const reviewerId = req.user.id; // From auth middleware

    if (reviewerId == userId) {
      return res.status(400).json({ message: "You cannot rate yourself" });
    }

    // Create the rating
    await Rating.create({
      ratingFrom: reviewerId,
      ratingTo: userId,
      stars: rating,
      review: comment
    }, { transaction: t });

    // Update the User's aggregate rating
    const avgRating = await Rating.findAll({
      where: { ratingTo: userId },
      attributes: [[sequelize.fn("AVG", sequelize.col("stars")), "avgStars"]],
      raw: true,
      transaction: t
    });

    await User.update(
      { rating: parseFloat(avgRating[0].avgStars).toFixed(1) },
      { where: { id: userId }, transaction: t }
    );

    await t.commit();
    res.status(201).json({ message: "Review posted successfully" });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: "Rating failed", error: error.message });
  }
};

// Handle Reporting
export const reportUser = async (req, res) => {
  try {
    const { reportedUserId, reason, description } = req.body;
    const fromId = req.user.id;

    await UserReport.create({
      fromId,
      toId: reportedUserId,
      category: reason,
      description: description
    });

    res.status(201).json({ message: "User reported to admins" });
  } catch (error) {
    res.status(500).json({ message: "Report failed", error: error.message });
  }
};