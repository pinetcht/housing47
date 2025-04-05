// Map.jsx

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

const Map = () => {
  const mapContainer = useRef(null);

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://api.maptiler.com/maps/01960843-60c0-72bd-844a-3bde22239aa5/style.json?key=UHRJl9L3oK7bh3QT6De6",
      center: [-117.7103, 34.0975], // Pomona College
      zoom: 16,
    });

    return () => map.remove();
  }, []);

  return (
    <div
      ref={mapContainer}
      style={{
        width: "100%",
        height: "100vh",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    />
  );
  
};

export default Map;
