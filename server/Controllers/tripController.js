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

export const getGuideTrips = async (req, res) => {
  try {
    const guideId = req.user.id;
    const trips = await Trip.findAll({
      where: { guideId },
      include: [
        {
          model: TrekPlan,
          attributes: ['title', 'location', 'estBudget', 'itinerary', 'description']
        },
        {
          model: User,
          as: 'trekker',
          attributes: ['fullName', 'dp', 'rating']
        }
      ],
      order: [['startDate', 'ASC']]
    });

    const formattedTrips = trips.map(t => ({
      ...t.TrekPlan.toJSON(),
      tripId: t.id,
      status: t.status,
      startDate: t.startDate,
      endDate: t.endDate,
      trekker: t.trekker
    }));

    res.json(formattedTrips);
  } catch (error) {
    res.status(500).json({ message: "Error fetching assigned treks" });
  }
};