import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.config.js";

const app = express();

dotenv.config();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  connectDB();
  console.log(`Server Running on port ${PORT}`);
});
