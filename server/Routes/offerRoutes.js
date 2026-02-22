import express from "express";
import { 
  createOffer, 
  updateOffer, 
  getOffersByPlan 
} from "../Controllers/OfferController.js";

import { protect } from "../Middlewares/auth.js";

const router = express.Router();

router.get("/plan/:id", protect, getOffersByPlan);

router.post("/", protect, createOffer);
router.put("/:id", protect, updateOffer);

export default router;