import  express  from "express";
import { getMyTrips } from "../Controllers/tripController.js";
import { protect } from "../Middlewares/auth.js";


const router = express.Router();

router.get("/mytrips",protect, getMyTrips);
export default router;