import { Router } from "express";
import { deleteAccount, registerGuide, registerUser, verifyEmail, verifyPassword, verifyToken } from "../Controllers/authController";
import { protect } from "../Middlewares/auth";

const router = express.Router();

Router.post("/register", registerUser);
Router.post("/registerguide", protect, registerGuide);
Router.post("/verify-email", verifyEmail);
Router.post("/verify-password", verifyPassword);
Router.post("/verify-token", verifyToken);
Router.post("/delete-account", protect, deleteAccount);