import  express  from "express";
import { protect } from "../Middlewares/auth.js";
import {  getTrekkerStats, getUserProfile, getUserReviews, rateUser, reportUser, updateDp, updateUserDetails } from "../Controllers/userController.js";
import { getMe } from "../Controllers/authController.js";
import { uploadSingleDp } from "../Middlewares/multer.js";

const router = express.Router();


router.get("/profile/:userId", protect, getUserProfile);
router.get("/stats", protect, getTrekkerStats);
router.get("/reviews/:userId", protect, getUserReviews);
router.post("/rate/:userId", protect, rateUser);
router.post("/report", protect, reportUser);
router.get("/me", protect, getMe);
router.patch("/update-profile", protect, updateUserDetails);
router.post("/update-dp", protect, uploadSingleDp, updateDp);


export default router;