import  express  from "express";
import { protect } from "../Middlewares/auth.js";
import { getTrekkerStats, getUserProfile, getUserReviews, rateUser, reportUser } from "../Controllers/userController.js";

const router = express.Router();


router.get("/profile/:userId", protect, getUserProfile);
router.get("/stats", protect, getTrekkerStats);
router.get("/reviews/:userId", protect, getUserReviews);
router.post("/rate/:userId", protect, rateUser);
router.post("/report", protect, reportUser);

export default router;