import express from "express";

import {
  getListings,
  createListing,
  updateListing,
  deleteListing
} from "../controllers/listingController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();


// Public Route
router.get("/", getListings);


// Protected Routes
router.post("/", protect, createListing);

router.put("/:id", protect, updateListing);

router.delete("/:id", protect, deleteListing);

export default router;