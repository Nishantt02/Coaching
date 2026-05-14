const ListingCard = ({ listing }) => {
  const formatDistance = (km) =>
    km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;

  return (
    <div className="border rounded-xl p-4 shadow">

      <img
        src={listing.image}
        alt={listing.name}
        className="h-40 w-full object-cover rounded"
      />

      <h2 className="text-xl font-bold mt-2">
        {listing.name}
      </h2>

      <p>{listing.address}</p>

      {listing.distance != null ? (
        <p className="text-sm text-gray-600 mt-1">
          Distance: {formatDistance(listing.distance)}
        </p>
      ) : (
        <p className="text-sm text-gray-500 mt-1">
          Distance unavailable
        </p>
      )}

      <p className="text-blue-600 mt-2">
        ₹ {listing.fees}
      </p>

      <p>⭐ {listing.rating}</p>

    </div>
  );
};

export default ListingCard;