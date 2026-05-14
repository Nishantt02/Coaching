import { useEffect, useState } from "react";

import api from "../services/api";


const AdminDashboard = () => {

  const [listings, setListings] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    fees: "",
    rating: "",
    address: "",
    image: "",
    lat: "",
    lng: ""
  });


  // Fetch Listings
  const fetchListings = async () => {

    try {

      const { data } = await api.get("/listing");

      setListings(data);

    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    fetchListings();
  }, []);


  // Handle Input Change
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  // Create OR Update Listing
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const payload = {
        name: formData.name,
        category: formData.category,
        fees: Number(formData.fees),
        rating: Number(formData.rating),
        address: formData.address,
        image: formData.image,

        location: {
          lat: Number(formData.lat),
          lng: Number(formData.lng)
        }
      };


      // Update
      if (editingId) {

        await api.put(
          `/listing/${editingId}`,
          payload
        );

        setEditingId(null);

      } else {

        // Create
        await api.post(
          "/listing",
          payload
        );
      }


      // Reset Form
      setFormData({
        name: "",
        category: "",
        fees: "",
        rating: "",
        address: "",
        image: "",
        lat: "",
        lng: ""
      });

      fetchListings();

    } catch (error) {
      console.log(error);
    }
  };


  // Delete Listing
  const handleDelete = async (id) => {

    try {

      await api.delete(`/listing/${id}`);

      fetchListings();

    } catch (error) {
      console.log(error);
    }
  };


  // Edit Listing
  const handleEdit = (listing) => {

    setEditingId(listing._id);

    setFormData({
      name: listing.name,
      category: listing.category,
      fees: listing.fees,
      rating: listing.rating,
      address: listing.address,
      image: listing.image,
      lat: listing.location.lat,
      lng: listing.location.lng
    });
  };


  return (
    <div className="p-5">

      <h1 className="text-3xl font-bold mb-6">
        Admin Dashboard
      </h1>


      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10"
      >

        <input
          type="text"
          name="name"
          placeholder="Coaching Name"
          value={formData.name}
          onChange={handleChange}
          className="border p-3 rounded"
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="border p-3 rounded"
        />

        <input
          type="number"
          name="fees"
          placeholder="Fees"
          value={formData.fees}
          onChange={handleChange}
          className="border p-3 rounded"
        />

        <input
          type="number"
          name="rating"
          placeholder="Rating"
          value={formData.rating}
          onChange={handleChange}
          className="border p-3 rounded"
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="border p-3 rounded"
        />

        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
          className="border p-3 rounded"
        />

        <input
          type="number"
          name="lat"
          placeholder="Latitude"
          value={formData.lat}
          onChange={handleChange}
          className="border p-3 rounded"
        />

        <input
          type="number"
          name="lng"
          placeholder="Longitude"
          value={formData.lng}
          onChange={handleChange}
          className="border p-3 rounded"
        />


        <button className="bg-black text-white py-3 rounded">

          {editingId ? "Update Listing" : "Add Listing"}

        </button>

      </form>


      {/* Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

        {listings.map((listing) => (

          <div
            key={listing._id}
            className="border rounded-xl p-4 shadow"
          >

            <img
              src={listing.image}
              alt={listing.name}
              className="h-40 w-full object-cover rounded"
            />

            <h2 className="text-xl font-bold mt-3">
              {listing.name}
            </h2>

            <p>{listing.category}</p>

            <p>{listing.address}</p>

            <p>₹ {listing.fees}</p>

            <p>⭐ {listing.rating}</p>


            <div className="flex gap-3 mt-4">

              <button
                onClick={() => handleEdit(listing)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Edit
              </button>


              <button
                onClick={() => handleDelete(listing._id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default AdminDashboard;