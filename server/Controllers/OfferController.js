import Offer from "../Models/Offer.js";
import User from "../Models/User.js";
import TrekPlan from "../Models/TrekPlan.js";
import { Op } from "sequelize";
import Trip from "../Models/Trips.js";
import { sequelize } from "../Database/database.js";

// 1. Create a new bid
export const createOffer = async (req, res) => {
  try {
    const { trekPlanId, amount, message } = req.body;
    const bidderId = req.user.id; // Assuming user id is in req.user from auth middleware

    // Check if the plan exists and is still open
    const plan = await TrekPlan.findByPk(trekPlanId);
    if (!plan || plan.status !== "open") {
      return res
        .status(400)
        .json({ message: "This trek plan is no longer accepting offers." });
    }

    // Prevent duplicate bids from the same guide
    const existingOffer = await Offer.findOne({
      where: { trekPlanId, bidderId },
    });
    if (existingOffer) {
      return res
        .status(400)
        .json({ message: "You have already placed an offer for this plan." });
    }

    const offer = await Offer.create({
      trekPlanId,
      bidderId,
      amount,
      message,
    });

    res.status(201).json({ message: "Offer submitted successfully", offer });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create offer", error: error.message });
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
      return res
        .status(404)
        .json({ message: "Offer not found or you are not authorized." });
    }

    if (offer.status !== "pending") {
      return res
        .status(400)
        .json({
          message: "Cannot update an offer that has already been processed.",
        });
    }

    await offer.update({ amount, message });

    res.status(200).json({ message: "Offer updated successfully", offer });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update offer", error: error.message });
  }
};

// 3. Get list of bids by Plan (With Bidder Details for the UI)
export const getOffersByPlan = async (req, res) => {
  try {
    const { id } = req.params;

    const offers = await Offer.findAll({
      where: { trekPlanId: id },
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
    res
      .status(500)
      .json({ message: "Failed to fetch offers", error: error.message });
  }
};

export const acceptOffer = async (req, res) => {
  const { id } = req.params; // Offer ID
  const t = await sequelize.transaction();

  try {
    // 1. Fetch the offer with Plan details to get necessary trip data
    const acceptedOffer = await Offer.findByPk(id, {
      include: [{ model: TrekPlan, as: "plan" }],
      transaction: t,
    });

    if (!acceptedOffer || !acceptedOffer.plan) {
      await t.rollback();
      return res
        .status(404)
        .json({ message: "Offer or associated Plan not found" });
    }

    const plan = acceptedOffer.plan;

    // 2. Update the chosen offer to 'accepted'
    await Offer.update(
      { status: "accepted" },
      { where: { id }, transaction: t },
    );

    // 3. Update all other offers for this plan to 'rejected'
    await Offer.update(
      { status: "rejected" },
      {
        where: {
          trekPlanId: plan.id,
          id: { [Op.ne]: id },
        },
        transaction: t,
      },
    );

    // 4. Update the TrekPlan status
    await TrekPlan.update(
      { status: "completed" },
      { where: { id: plan.id }, transaction: t },
    );

    const startDate = new Date();

    const durationDays = plan.itinerary ? plan.itinerary.length : 1;

    const endDate = new Date();
    endDate.setDate(startDate.getDate() + durationDays);

    await Trip.create(
      {
        trekPlanId: plan.id,
        trekkerId: plan.trekkerId,
        guideId: acceptedOffer.bidderId,
        startDate: startDate,
        endDate: endDate,
        status: "upcoming",
        remarks: `Trip confirmed with guide at budget: $${acceptedOffer.amount}. Duration: ${durationDays} days.`,
      },
      { transaction: t },
    );

    await t.commit();
    res.status(200).json({
      message: "Offer accepted! A new trip has been scheduled.",
      guideId: acceptedOffer.bidderId,
    });
  } catch (error) {
    await t.rollback();
    res
      .status(500)
      .json({ message: "Failed to finalize trip", error: error.message });
  }
};


export const getMyOffers = async (req, res) => {
  try {
    const guideId = req.user.id;

    const bids = await Offer.findAll({
      where: { bidderId: guideId },
      include: [
        {
          model: TrekPlan,
          as: "plan",
          attributes: ["title"],
          include: [
            {
              model: User,
              as: "trekker",
              attributes: ["fullName", "dp"],
            }
          ]
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(bids);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch your bids", error: error.message });
  }
};