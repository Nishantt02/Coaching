// import React from "react";

// import {
//   GoogleMap,
//   Marker,
//   InfoWindow,
//   useLoadScript
// } from "@react-google-maps/api";


// const containerStyle = {
//   width: "100%",
//   height: "500px"
// };

// const center = {
//   lat: 28.6139,
//   lng: 77.2090
// };


// const GoogleMapComponent = ({ listings }) => {

//   const [selected, setSelected] = React.useState(null);

//   const { isLoaded } = useLoadScript({
//     googleMapsApiKey:
//       import.meta.env.VITE_GOOGLE_MAPS_API_KEY
//   });

//   if (!isLoaded) {
//     return <h1>Loading Map...</h1>;
//   }

//   return (
//     <GoogleMap
//       mapContainerStyle={containerStyle}
//       center={center}
//       zoom={10}
//     >

//       {listings.map((listing) => (
//         <Marker
//           key={listing._id}
//           position={{
//             lat: listing.location.lat,
//             lng: listing.location.lng
//           }}
//           onClick={() => setSelected(listing)}
//         />
//       ))}

//       {selected && (
//         <InfoWindow
//           position={{
//             lat: selected.location.lat,
//             lng: selected.location.lng
//           }}
//           onCloseClick={() => setSelected(null)}
//         >
//           <div>
//             <h2>{selected.name}</h2>
//             <p>{selected.address}</p>
//           </div>
//         </InfoWindow>
//       )}

//     </GoogleMap>
//   );
// };


// export default GoogleMapComponent;

import React, { useState, useEffect, useCallback } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  Circle,
  useLoadScript,
} from "@react-google-maps/api";

// ─── Constants ───────────────────────────────────────────────────────────────

const containerStyle = { width: "100%", height: "500px" };
const DEFAULT_CENTER = { lat: 28.6139, lng: 77.209 };
const LIBRARIES = ["geometry"];

// ─── Haversine Distance (km) ──────────────────────────────────────────────────

function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius in km
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(km) {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}

// ─── Custom Marker Icon ───────────────────────────────────────────────────────

function getMarkerIcon(distance) {
  const color =
    distance === null ? "#6B7280"
    : distance < 5    ? "#16A34A"   // green  → nearby
    : distance < 15   ? "#D97706"   // amber  → moderate
                      : "#DC2626";  // red    → far

  // Inline SVG encoded as data URL (no external dependency)
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="46" viewBox="0 0 36 46">
      <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 28 18 28s18-14.5 18-28C36 8.06 27.94 0 18 0z"
            fill="${color}" stroke="#fff" stroke-width="2"/>
      <circle cx="18" cy="18" r="8" fill="#fff"/>
    </svg>`;
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: { width: 36, height: 46 },
  };
}

// ─── Main Component ───────────────────────────────────────────────────────────

const GoogleMapComponent = ({ listings = [], userLocation: externalUserLocation = null }) => {
  const [selected, setSelected] = useState(null);
  const [internalLocation, setInternalLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [sortByDistance, setSortByDistance] = useState(false);

  const userLocation = externalUserLocation || internalLocation;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  // ── Geolocation ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (externalUserLocation) {
      return;
    }

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        setInternalLocation({ lat: coords.latitude, lng: coords.longitude }),
      (err) => {
        const messages = {
          1: "Location access denied. Enable it in browser settings.",
          2: "Location unavailable. Please try again.",
          3: "Location request timed out.",
        };
        setLocationError(messages[err.code] || "Unknown location error.");
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 }
    );
  }, [externalUserLocation]);

  // ── Attach distance to each listing ───────────────────────────────────────
  const enrichedListings = listings.map((listing) => {
    const hasLocation =
      listing.location?.lat != null && listing.location?.lng != null;

    const distance = userLocation && hasLocation
      ? haversineDistance(
          userLocation.lat, userLocation.lng,
          listing.location.lat, listing.location.lng
        )
      : null;
    return { ...listing, distance };
  });

  const displayListings = sortByDistance && userLocation
    ? [...enrichedListings].sort((a, b) => a.distance - b.distance)
    : enrichedListings;

  const mapCenter = userLocation || DEFAULT_CENTER;

  const onMapClick = useCallback(() => setSelected(null), []);

  // ── Render guards ──────────────────────────────────────────────────────────
  if (loadError)  return <p style={styles.error}>❌ Failed to load Google Maps.</p>;
  if (!isLoaded)  return <p style={styles.loading}>⏳ Loading map…</p>;

  return (
    <div style={styles.wrapper}>

      {/* ── Toolbar ── */}
      <div style={styles.toolbar}>
        <div style={styles.locationStatus}>
          {userLocation ? (
            <span style={styles.badge("green")}>📍 Location detected</span>
          ) : locationError ? (
            <span style={styles.badge("red")} title={locationError}>
              ⚠ {locationError}
            </span>
          ) : (
            <span style={styles.badge("gray")}>🔄 Detecting location…</span>
          )}
        </div>

        {userLocation && (
          <button
            style={styles.sortBtn(sortByDistance)}
            onClick={() => setSortByDistance((v) => !v)}
          >
            {sortByDistance ? "✅ Sorted by Distance" : "Sort by Distance"}
          </button>
        )}
      </div>

      {/* ── Map ── */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={userLocation ? 12 : 10}
        onClick={onMapClick}
        options={{ streetViewControl: false, mapTypeControl: false }}
      >
        {/* User location marker + accuracy circle */}
        {userLocation && (
          <>
            <Marker
              position={userLocation}
              icon={{
                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
                  `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="8" fill="#2563EB" stroke="#fff" stroke-width="2"/>
                    <circle cx="10" cy="10" r="3" fill="#fff"/>
                  </svg>`
                )}`,
                scaledSize: { width: 20, height: 20 },
              }}
              title="Your location"
            />
            <Circle
              center={userLocation}
              radius={500}
              options={{
                fillColor: "#2563EB",
                fillOpacity: 0.08,
                strokeColor: "#2563EB",
                strokeOpacity: 0.4,
                strokeWeight: 1,
              }}
            />
          </>
        )}

        {/* Coaching markers */}
        {displayListings.map((listing) => (
          <Marker
            key={listing._id}
            position={{ lat: listing.location.lat, lng: listing.location.lng }}
            icon={getMarkerIcon(listing.distance)}
            title={listing.name}
            onClick={() => setSelected(listing)}
          />
        ))}

        {/* InfoWindow */}
        {selected && (
          <InfoWindow
            position={{
              lat: selected.location.lat,
              lng: selected.location.lng,
            }}
            onCloseClick={() => setSelected(null)}
          >
            <div style={styles.infoWindow}>
              <h3 style={styles.infoTitle}>{selected.name}</h3>
              <p style={styles.infoAddress}>📍 {selected.address}</p>

              {selected.distance !== null ? (
                <div style={styles.distanceBadge(selected.distance)}>
                  🚗 {formatDistance(selected.distance)} from you
                  <span style={styles.distanceNote}>
                    {selected.distance < 5
                      ? " · Nearby"
                      : selected.distance < 15
                      ? " · Moderate distance"
                      : " · Far away"}
                  </span>
                </div>
              ) : (
                <p style={styles.noLocation}>
                  Enable location to see distance
                </p>
              )}

              {userLocation && (
                <a
                  href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${selected.location.lat},${selected.location.lng}&travelmode=driving`}
                  target="_blank"
                  rel="noreferrer"
                  style={styles.directionsBtn}
                >
                  🗺 Get Directions
                </a>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* ── Sorted List ── */}
      {sortByDistance && userLocation && (
        <div style={styles.listPanel}>
          <h4 style={styles.listTitle}>Coachings Near You</h4>
          {displayListings.map((listing, idx) => (
            <div
              key={listing._id}
              style={styles.listItem(selected?._id === listing._id)}
              onClick={() => setSelected(listing)}
            >
              <span style={styles.rank}>#{idx + 1}</span>
              <div style={styles.listInfo}>
                <strong>{listing.name}</strong>
                <small>{listing.address}</small>
              </div>
              <span style={styles.listDistance(listing.distance)}>
                {formatDistance(listing.distance)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── Legend ── */}
      <div style={styles.legend}>
        {[
          { color: "#16A34A", label: "< 5 km" },
          { color: "#D97706", label: "5–15 km" },
          { color: "#DC2626", label: "> 15 km" },
          { color: "#2563EB", label: "You" },
        ].map(({ color, label }) => (
          <div key={label} style={styles.legendItem}>
            <span style={{ ...styles.dot, background: color }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Inline Styles ────────────────────────────────────────────────────────────

const styles = {
  wrapper:   { fontFamily: "sans-serif", borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,.12)" },
  toolbar:   { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" },
  locationStatus: { fontSize: 13 },
  badge: (color) => ({
    display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
    background: color === "green" ? "#DCFCE7" : color === "red" ? "#FEE2E2" : "#F3F4F6",
    color:      color === "green" ? "#15803D" : color === "red" ? "#B91C1C" : "#6B7280",
  }),
  sortBtn: (active) => ({
    padding: "5px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
    background: active ? "#2563EB" : "#E5E7EB",
    color:      active ? "#fff"    : "#374151",
    transition: "all .2s",
  }),
  infoWindow:    { maxWidth: 240, padding: 4 },
  infoTitle:     { margin: "0 0 4px", fontSize: 15, fontWeight: 700, color: "#111827" },
  infoAddress:   { margin: "0 0 8px", fontSize: 12, color: "#6B7280" },
  distanceBadge: (d) => ({
    display: "inline-flex", alignItems: "center", gap: 4,
    padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, marginBottom: 8,
    background: d < 5 ? "#DCFCE7" : d < 15 ? "#FEF3C7" : "#FEE2E2",
    color:      d < 5 ? "#15803D" : d < 15 ? "#92400E" : "#B91C1C",
  }),
  distanceNote: { fontWeight: 400, opacity: .8 },
  noLocation:   { fontSize: 12, color: "#9CA3AF", margin: "0 0 8px" },
  directionsBtn: {
    display: "block", textAlign: "center", padding: "6px 0",
    background: "#2563EB", color: "#fff", borderRadius: 8,
    fontSize: 12, fontWeight: 600, textDecoration: "none",
    marginTop: 4,
  },
  listPanel: { background: "#fff", maxHeight: 280, overflowY: "auto", borderTop: "1px solid #E5E7EB" },
  listTitle: { margin: 0, padding: "10px 14px", fontSize: 13, fontWeight: 700, color: "#374151", background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" },
  listItem:  (active) => ({
    display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
    cursor: "pointer", borderBottom: "1px solid #F3F4F6", transition: "background .15s",
    background: active ? "#EFF6FF" : "transparent",
  }),
  rank:      { width: 24, textAlign: "center", fontWeight: 700, color: "#9CA3AF", fontSize: 12 },
  listInfo:  { flex: 1, display: "flex", flexDirection: "column", gap: 2, fontSize: 13 },
  listDistance: (d) => ({
    fontWeight: 700, fontSize: 13, whiteSpace: "nowrap",
    color: d < 5 ? "#16A34A" : d < 15 ? "#D97706" : "#DC2626",
  }),
  legend:    { display: "flex", gap: 16, padding: "8px 14px", background: "#F9FAFB", borderTop: "1px solid #E5E7EB", fontSize: 12, color: "#6B7280" },
  legendItem:{ display: "flex", alignItems: "center", gap: 5 },
  dot:       { width: 10, height: 10, borderRadius: "50%", display: "inline-block" },
  error:     { color: "red", padding: 16 },
  loading:   { padding: 16 },
};

export default GoogleMapComponent;