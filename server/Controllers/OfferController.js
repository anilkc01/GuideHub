import Offer from "../Models/Offer.js";
import User from "../Models/User.js";
import Guide from "../Models/Guide.js";
import TrekPlan from "../Models/TrekPlan.js";
import { Op } from "sequelize";
import Trip from "../Models/Trips.js";
import { sequelize } from "../Database/database.js";
import { sendEmail } from "../Services/Email.js";


export const createOffer = async (req, res) => {
  try {
    const { trekPlanId, amount, message } = req.body;
    const bidderId = req.user.id; 

    const user = await User.findByPk(bidderId);
    
    if (!user || user.role !== "guide") {
      return res.status(403).json({ message: "Only guides can place bids." });
    }

    const guideProfile = await Guide.findOne({ where: { userId: bidderId } });

    if (guideProfile.status !== "verified") {
      return res.status(403).json({ 
        message: "Your account is not verified. Please wait for admin approval before bidding." 
      });
    }

    const plan = await TrekPlan.findByPk(trekPlanId);
    if (!plan || plan.status !== "open") {
      return res
        .status(400)
        .json({ message: "This trek plan is no longer accepting offers." });
    }

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
      return res.status(400).json({
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
          attributes: ["id", "fullName", "dp", "rating"], // Specifically for your sidebar list
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
  const { id } = req.params;
  const t = await sequelize.transaction();

  try {
    // 1. Fetch offer ONLY 
    const acceptedOffer = await Offer.findByPk(id, { transaction: t });

    if (!acceptedOffer) {
      await t.rollback();
      return res.status(404).json({ message: "Offer not found" });
    }

    // 2. Fetch plan separately
    const plan = await TrekPlan.findByPk(acceptedOffer.trekPlanId, {
      transaction: t,
    });

    if (!plan) {
      await t.rollback();
      return res.status(404).json({ message: "Associated Plan not found" });
    }

    // 3. Accept selected offer
    await Offer.update(
      { status: "accepted" },
      { where: { id }, transaction: t },
    );

    // 4. Reject others
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

    // 5. Update plan
    await TrekPlan.update(
      { status: "completed" },
      { where: { id: plan.id }, transaction: t },
    );

    // 6. Create trip
    const startDate = new Date();
    const durationDays = plan.itinerary?.length || 1;
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + durationDays);

    await Trip.create(
      {
        trekPlanId: plan.id,
        trekkerId: plan.trekkerId,
        guideId: acceptedOffer.bidderId,
        startDate,
        endDate,
        status: "upcoming",
        remarks: `Trip confirmed at $${acceptedOffer.amount} for ${durationDays} days.`,
      },
      { transaction: t },
    );

    await t.commit();

    try {
      const bidder = await User.findByPk(acceptedOffer.bidderId);

      if (bidder?.email) {
        await sendEmail(
          bidder.email,
          "Offer Accepted - New Trip Scheduled!",
          `<p>Congratulations ${bidder.fullName},</p>
         <p>Your offer for <strong>${plan.title || "Trip"}</strong> has been accepted.</p>
         <p>Please check your dashboard for trip details.</p>`,
        );
      }
    } catch (emailError) {
      console.error("Email failed but trip was created:", emailError.message);
    }

    res.status(200).json({
      message: "Offer accepted! Trip scheduled successfully.",
      guideId: acceptedOffer.bidderId,
    });
  } catch (error) {
    if (!t.finished) {
      await t.rollback();
    }

    res.status(500).json({
      message: "Failed to finalize trip",
      error: error.message,
    });
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
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(bids);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch your bids", error: error.message });
  }
};
