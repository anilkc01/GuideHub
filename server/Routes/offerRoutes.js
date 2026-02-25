import express from "express";
import { 
  createOffer, 
  updateOffer, 
  getOffersByPlan, 
  acceptOffer,
  getMyOffers
} from "../Controllers/OfferController.js";

import { protect } from "../Middlewares/auth.js";

const router = express.Router();

router.get("/plan/:id", protect, getOffersByPlan);
router.get("/myoffers", protect, getMyOffers);
router.put("/accept/:id", protect, acceptOffer);
router.post("/", protect, createOffer);
router.put("/:id", protect, updateOffer);

export default router;