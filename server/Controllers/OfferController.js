import Offer from "../Models/Offer.js";
import User from "../Models/User.js";
import TrekPlan from "../Models/TrekPlan.js";


// 1. Create a new bid
export const createOffer = async (req, res) => {
  try {
    const { trekPlanId, amount, message } = req.body;
    const bidderId = req.user.id; // Assuming user id is in req.user from auth middleware

    // Check if the plan exists and is still open
    const plan = await TrekPlan.findByPk(trekPlanId);
    if (!plan || plan.status !== "open") {
      return res.status(400).json({ message: "This trek plan is no longer accepting offers." });
    }

    // Prevent duplicate bids from the same guide
    const existingOffer = await Offer.findOne({ where: { trekPlanId, bidderId } });
    if (existingOffer) {
      return res.status(400).json({ message: "You have already placed an offer for this plan." });
    }

    const offer = await Offer.create({
      trekPlanId,
      bidderId,
      amount,
      message,
    });

    res.status(201).json({ message: "Offer submitted successfully", offer });
  } catch (error) {
    res.status(500).json({ message: "Failed to create offer", error: error.message });
  }
};

// 2. Update current bid
export const updateOffer = async (req, res) => {
  try {
    const { id } = req.params; // The Offer ID
    const { amount, message } = req.body;
    const bidderId = req.user.id;

    const offer = await Offer.findOne({ where: { id, bidderId } });

    if (!offer) {
      return res.status(404).json({ message: "Offer not found or you are not authorized." });
    }

    if (offer.status !== "pending") {
      return res.status(400).json({ message: "Cannot update an offer that has already been processed." });
    }

    await offer.update({ amount, message });

    res.status(200).json({ message: "Offer updated successfully", offer });
  } catch (error) {
    res.status(500).json({ message: "Failed to update offer", error: error.message });
  }
};

// 3. Get list of bids by Plan (With Bidder Details for the UI)
export const getOffersByPlan = async (req, res) => {
  try {
    const { id } = req.params;

    const offers = await Offer.findAll({
      where: {  trekPlanId: id },
      include: [
        {
          model: User,
          as: "bidder",
          attributes: ["fullName", "dp", "rating"], // Specifically for your sidebar list
        },
      ],
      order: [["createdAt", "DESC"]], // Newest offers first
    });

    res.status(200).json(offers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch offers", error: error.message });
  }
};