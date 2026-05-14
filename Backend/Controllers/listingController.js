import Listing from "../models/listingmodels.js";


// Get All Listings
export const getListings = async (req, res) => {
  try {

    const listings = await Listing.find();

    res.status(200).json(listings);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// Create Listing
export const createListing = async (req, res) => {
  try {

    const listing = await Listing.create(req.body);

    res.status(201).json(listing);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// Update Listing
export const updateListing = async (req, res) => {
  try {

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found"
      });
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedListing);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// Delete Listing
export const deleteListing = async (req, res) => {
  try {

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found"
      });
    }

    await listing.deleteOne();

    res.status(200).json({
      message: "Listing deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};