import { Op } from "sequelize";
import { sequelize } from "../Database/database.js";
import Rating from "../Models/Ratings.js";
import TrekPlan from "../Models/TrekPlan.js";
import Trip from "../Models/Trips.js";
import User from "../Models/User.js";
import UserReport from "../Models/UserReports.js";

export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const profile = await User.findByPk(userId, {
      attributes: [
        "id",
        "fullName",
        "email",
        "phone",
        "address",
        "dp",
        "rating",
        "status",
        "createdAt",
      ],
    });

    if (!profile) return res.status(404).json({ message: "User not found" });

    const completedTreks = await Trip.count({
      where: {
        status: "completed",
        [Op.or]: [{ trekkerId: userId }, { guideId: userId }],
      },
    });

    const years =
      new Date().getFullYear() - new Date(profile.createdAt).getFullYear();

    res.status(200).json({
      ...profile.toJSON(),
      stats: {
        completedTreks,
        experience: years > 0 ? years : 1,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

export const getTrekkerStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const openPlans = await TrekPlan.count({
      where: {
        trekkerId: userId,
        status: "open",
      },
    });

    const upcomingTrips = await Trip.count({
      where: {
        trekkerId: userId,
        status: ["upcoming"],
      },
    });

    const completedTrips = await Trip.count({
      where: {
        trekkerId: userId,
        status: "completed",
      },
    });

    res.status(200).json({
      openPlans,
      upcomingTrips,
      completedTreks: completedTrips,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching stats", error: error.message });
  }
};

export const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    const reviews = await Rating.findAll({
      where: { ratingTo: userId },
      include: [
        {
          model: User,
          as: "reviewer",
          attributes: ["fullName", "dp"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const formatted = reviews.map((r) => ({
      id: r.id,
      stars: r.stars,
      review: r.review,
      reviewer: r.reviewer,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

export const rateUser = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { userId } = req.params;
    const { rating, comment } = req.body;
    const reviewerId = req.user.id;

    if (reviewerId == userId) {
      return res.status(400).json({ message: "You cannot rate yourself" });
    }

    const existingRating = await Rating.findOne({
      where: {
        ratingFrom: reviewerId,
        ratingTo: userId,
      },
      transaction: t,
    });

    if (existingRating) {
      // UPDATE EXISTING
      await existingRating.update(
        {
          stars: rating,
          review: comment,
        },
        { transaction: t },
      );
    } else {
      await Rating.create(
        {
          ratingFrom: reviewerId,
          ratingTo: userId,
          stars: rating,
          review: comment,
        },
        { transaction: t },
      );
    }

    const avgRating = await Rating.findAll({
      where: { ratingTo: userId },
      attributes: [[sequelize.fn("AVG", sequelize.col("stars")), "avgStars"]],
      raw: true,
      transaction: t,
    });

    const newAvg = avgRating[0].avgStars
      ? parseFloat(avgRating[0].avgStars).toFixed(1)
      : rating;

    await User.update(
      { rating: newAvg },
      { where: { id: userId }, transaction: t },
    );

    await t.commit();
    res.status(200).json({
      message: existingRating ? "Review updated" : "Review posted",
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: "Operation failed", error: error.message });
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
      description: description,
    });

    res.status(201).json({ message: "User reported to admins" });
  } catch (error) {
    res.status(500).json({ message: "Report failed", error: error.message });
  }
};
