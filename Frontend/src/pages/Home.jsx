import { useEffect, useState } from "react";

import api from "../services/api";

import ListingCard from "../components/ListingCard";

import SearchBar from "../components/SearchBar";

import FilterBar from "../components/FilterBar";

import GoogleMapComponent from "../components/GoogleMapComponent";


const Home = () => {

  const [listings, setListings] = useState([]);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("");

  const [userLocation, setUserLocation] = useState(null);

  const [locationError, setLocationError] = useState("");


  useEffect(() => {

    const fetchListings = async () => {

      try {

        const { data } = await api.get("/listing");

        setListings(data);

      } catch (error) {
        console.log(error);
      }
    };

    fetchListings();

  }, []);


  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setUserLocation({ lat: coords.latitude, lng: coords.longitude });
      },
      (err) => {
        const messages = {
          1: "Location access denied. Enable it in browser settings.",
          2: "Location unavailable. Please try again.",
          3: "Location request timed out.",
        };
        setLocationError(messages[err.code] || "Unable to determine your location.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);


  const haversineDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const listingsWithDistance = listings.map((item) => {
    const hasLocation =
      item.location?.lat != null && item.location?.lng != null;

    const distance = userLocation && hasLocation
      ? haversineDistance(
          userLocation.lat,
          userLocation.lng,
          item.location.lat,
          item.location.lng
        )
      : null;

    return { ...item, distance };
  });

  const filteredListings = listingsWithDistance.filter((item) => {

    return (
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === "" || item.category === category)
    );
  });


  return (
    <div className="p-5">

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">

        <SearchBar
          search={search}
          setSearch={setSearch}
        />

        <FilterBar
          category={category}
          setCategory={setCategory}
        />

      </div>


      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Listings */}
        <div className="space-y-4">

          {filteredListings.map((listing) => (
            <ListingCard
              key={listing._id}
              listing={listing}
            />
          ))}

        </div>


        {/* Google Map */}
        <div>
          <GoogleMapComponent
            listings={filteredListings}
            userLocation={userLocation}
          />
          {locationError && (
            <p className="mt-3 text-sm text-red-600">{locationError}</p>
          )}
        </div>

      </div>

    </div>
  );
};

export default Home;