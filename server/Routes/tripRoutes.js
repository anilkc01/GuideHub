import  express  from "express";
import { getGuideTrips, getMyTrips, markTripCompleted } from "../Controllers/tripController.js";
import { protect } from "../Middlewares/auth.js";


const router = express.Router();

router.get("/mytrips",protect, getMyTrips);
router.get("/assignedTrips", protect, getGuideTrips);
router.put("/mark-completed/:id", protect, markTripCompleted);
export default router;