import express from "express";

import { 
  getAllUsers, 
  updateUserStatus, 
  getPendingVerifications, 
  getReports, 
  getUserDetailsForAdmin,
  getUserReports,
  resolveUserReport,
  getBlogReports,
  resolveBlogReport,
  removeBlogAdmin,
  updateGuideStatus,
  getGuideApplications
} from "../Controllers/adminController.js";
import { protect, requireAdmin } from "../Middlewares/auth.js";

const router = express.Router();


router.use(protect);
router.use(requireAdmin);

router.get("/users", getAllUsers);



router.patch("/users/:id/status", updateUserStatus);
router.patch("/blogs/remove/:id", removeBlogAdmin);

router.get("/guides/verify",  getGuideApplications);

router.patch("/guides/status/:id",updateGuideStatus);
router.get("/guides/pending", getPendingVerifications);


router.get("/reports/:type", getReports);
router.get("/user-reports/:id", getUserReports);
router.get("/blog-reports/:id", getBlogReports);
router.patch("/user-report/resolve/:reportId", resolveUserReport);
router.patch("/blog-report/resolve/:reportId", resolveBlogReport);
router.get("/user/:id", getUserDetailsForAdmin); 

export default router;