import express from "express";
import { connection } from "./Database/database.js";
import authRoutes from "./Routes/authRoutes.js";
import planRoutes from "./Routes/planRoutes.js";
import offerRoutes from "./Routes/offerRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import tripRoutes from "./Routes/tripRoutes.js";
import blogRoutes from "./Routes/blogRoutes.js";
import adminRoutes from "./Routes/adminRoutes.js";
import chatRoutes from "./Routes/chatRoutes.js";
import path from "path";
import cors from "cors";
import { createServer } from "http";
import { initSocket } from "./Services/Socket.js";


const app = express();

const httpServer = createServer(app);

initSocket(httpServer);
app.use(express.json());

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

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
app.use("/api/blogs", blogRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);

httpServer.listen(5002, () => {
  console.log("Server & Socket running on port 5002");
});
