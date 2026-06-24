import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

function Map({ locations }) {
  if (!locations?.length) return null;

  const center = [
    locations[0].coordinates[1],
    locations[0].coordinates[0],
  ];

  return (
    <div className="mt-10 overflow-hidden rounded-2xl">
      <MapContainer
        center={center}
        zoom={6}
        scrollWheelZoom={false}
        style={{
          height: "500px",
          width: "100%",
        }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locations.map((loc) => (
          <Marker
            key={loc._id}
            position={[
              loc.coordinates[1],
              loc.coordinates[0],
            ]}
          >
            <Popup>
              Day {loc.day}: {loc.description}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default Map;