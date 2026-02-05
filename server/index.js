import express from "express";
import { connection } from "./Database/database.js";
import authRoutes from "./Routes/authRoutes.js";
import cors from "cors";

const app = express();

app.use(cors({
  origin: "*",
}));

connection();

app.get("/", (req, res) => {
  res.send("Server running");
});

app.use("/api/auth", authRoutes);

app.listen(5002, () => {
  console.log("Server running on port 5002");
});
