import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server running");
});

app.listen(5002, () => {
  console.log("Server running on port 5002");
});
