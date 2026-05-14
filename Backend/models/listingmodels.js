import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    name: String,

    category: String,

    fees: Number,

    rating: Number,

    address: String,

    image: String,

    location: {
      lat: Number,
      lng: Number
    }
  },
  {
    timestamps: true
  }
);

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;