import TrekPlan from "../Models/TrekPlan.js";
import Trip from "../Models/Trips.js";
import User from "../Models/User.js";


export const getMyTrips = async (req, res) => {
  try {
    const userId = req.user.id;

    const trips = await Trip.findAll({
      where: { trekkerId: userId },
      include: [
        {
          model: TrekPlan,
          attributes: ["id", "title", "location", "estBudget"],
        },
        {
          model: User,
          as: "guide",
          attributes: ["fullName", "dp"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch trips", error: error.message });
  }
};