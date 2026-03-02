import  express  from "express";
import { changePassword, deactiveAccount, deleteAccount, getOtp, registerGuide, registerUser, verifyEmail, verifyOtp, verifyPassword, verifyToken } from "../Controllers/authController.js";
import { protect } from "../Middlewares/auth.js";
import { uploadGuideDocs } from "../Middlewares/multer.js";


const Router = express.Router();

Router.post("/register", registerUser);
Router.post("/register-guide", uploadGuideDocs, registerGuide);
Router.post("/verify-email", verifyEmail);
Router.post("/verify-password", verifyPassword);
Router.get("/verify-token",protect, verifyToken);
Router.post("/delete-account", protect, deleteAccount);
Router.post("/get-otp", getOtp);
Router.post("/verify-otp", verifyOtp);
Router.patch("/update-status/:id", protect, deactiveAccount);
Router.post("/change-password", protect, changePassword);


export default Router;