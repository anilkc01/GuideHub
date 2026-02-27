import  express  from "express";
import { createTrekPlan, deletePlan, explorePlans, getMyPlans, getPlanById, updateTrekPlan } from "../Controllers/PlansController.js";
import { protect, requireOwner } from "../Middlewares/auth.js";

const router = express.Router();


router.post("/", protect, createTrekPlan);

router.get("/my-plans", protect, getMyPlans);

router.put("/:id", protect, requireOwner, updateTrekPlan);
router.delete("/:id", protect, requireOwner, deletePlan );
router.get("/explore", protect, explorePlans);
router.get("/:id", protect, getPlanById);

export default router;