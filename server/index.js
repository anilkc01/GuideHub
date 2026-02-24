import express from "express";
import { connection } from "./Database/database.js";
import authRoutes from "./Routes/authRoutes.js";
import planRoutes from "./Routes/planRoutes.js";
import offerRoutes from "./Routes/offerRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import tripRoutes from "./Routes/tripRoutes.js";
import cors from "cors";

const app = express();
app.use(express.json());

app.use(cors({
  origin: "*",
}));

connection();

app.get("/", (req, res) => {
  res.send("Server running");
});

app.use("/api/auth", authRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/user", userRoutes);
app.use("/api/trips", tripRoutes);

app.listen(5002, () => {
  console.log("Server running on port 5002");
});
