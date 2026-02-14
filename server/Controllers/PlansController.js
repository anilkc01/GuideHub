import TrekPlan from "../Models/TrekPlan.js";
import User from "../Models/User.js";

export const createTrekPlan = async (req, res) => {
  try {
    const { title, location, itinerary, description, timePlanned, estBudget } = req.body;

    if (!title || title.length < 5 || title.length > 50) {
      return res.status(400).json({ message: "Title must be 5-50 characters" });
    }
    if (!location || location.length < 3 || location.length > 50) {
      return res.status(400).json({ message: "Location must be 3-50 characters" });
    }
    if (!description || description.length < 20 || description.length > 500) {
      return res.status(400).json({ message: "Description must be 20-500 characters" });
    }
    if (!estBudget || estBudget <= 0 || estBudget.toString().length > 6) {
      return res.status(400).json({ message: "Budget must be positive and max 6 digits" });
    }
    if (!timePlanned) {
      return res.status(400).json({ message: "Planned date is required" });
    }
    if (!Array.isArray(itinerary) || itinerary.length === 0) {
      return res.status(400).json({ message: "Itinerary must be a non-empty array" });
    }

    for (const item of itinerary) {
      if (!item.activity || item.activity.length > 200) {
        return res.status(400).json({ message: "Each activity must be 1-200 characters" });
      }
    }

    const newPlan = await TrekPlan.create({
      title,
      location,
      itinerary,
      description,
      timePlanned,
      estBudget,
      trekkerId: req.user.id,
      status: "open",
    });

    res.status(201).json({ success: true, plan: newPlan });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateTrekPlan = async (req, res) => {
  try {
    const plan = req.plan;
    const { title, location, description, estBudget, itinerary } = req.body;

    if (title && (title.length < 5 || title.length > 50)) {
      return res.status(400).json({ message: "Title must be 5-50 characters" });
    }
    if (location && (location.length < 3 || location.length > 50)) {
      return res.status(400).json({ message: "Location must be 3-50 characters" });
    }
    if (description && (description.length < 20 || description.length > 500)) {
      return res.status(400).json({ message: "Description must be 20-500 characters" });
    }
    if (estBudget && (estBudget <= 0 || estBudget.toString().length > 6)) {
      return res.status(400).json({ message: "Budget must be max 6 digits" });
    }
    if (itinerary) {
      if (!Array.isArray(itinerary)) return res.status(400).json({ message: "Invalid itinerary format" });
      for (const item of itinerary) {
        if (!item.activity || item.activity.length > 200) {
          return res.status(400).json({ message: "Activity must be 1-200 characters" });
        }
      }
    }

    await plan.update(req.body);
    res.status(200).json({ success: true, plan });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

export const deleteTrekPlan = async (req, res) => {
  try {
    await req.plan.destroy();
    res.status(200).json({ success: true, message: "Plan deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
};

export const getPlanById = async (req, res) => {
  try {
    const { id } = req.params;

    const plan = await TrekPlan.findByPk(id, {
      include: [
        {
          model: User,
          as: "trekker",
          attributes: ["id", "fullName", "email"],
        },
      ],
    });

    if (!plan) {
      return res.status(404).json({ message: "Trek plan not found" });
    }

    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ message: "Fetch failed", error: error.message });
  }
};

export const getMyPlans = async (req, res) => {
  try {
    const plans = await TrekPlan.findAll({
      where: { 
        trekkerId: req.user.id,
        status: ["open", "ongoing"]
     },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ message: "Fetch failed", error: error.message });
  }
};