import  express  from "express";
import { getGuideTrips, getMyTrips } from "../Controllers/tripController.js";
import { protect } from "../Middlewares/auth.js";


const router = express.Router();

router.get("/mytrips",protect, getMyTrips);
router.get("/assignedTrips", protect, getGuideTrips);
export default router;