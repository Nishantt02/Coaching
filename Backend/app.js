import express from "express";
import cors from "cors";
import user from "./routes/authRoutes.js";
import listing from "./routes/listingRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running" });
});

app.use("/user", user);
app.use("/listing", listing);

export default app;