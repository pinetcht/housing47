import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const Map = () => {
  const mapContainer = useRef(null);

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://api.maptiler.com/maps/01960843-60c0-72bd-844a-3bde22239aa5/style.json?key=UHRJl9L3oK7bh3QT6De6",
      center: [-117.7103, 34.0975], // Pomona College
      zoom: 16,
    });

    map.on("load", () => {
      // Change 'dorms-labels' to match your actual label layer ID
      const dormLayerId = "dorms-labels";

      // Check if layer exists before binding events
      if (map.getLayer(dormLayerId)) {
        map.on("click", dormLayerId, (e) => {
          const dormName = e.features[0].properties.name;

          // Navigate to new route like /dorms/clark-i
          const formattedName = dormName.toLowerCase().replace(/\s+/g, "-");
          window.location.href = `/dorms/${encodeURIComponent(formattedName)}`;
        });

        // Pointer cursor on hover
        map.on("mouseenter", Others, () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", Others, () => {
          map.getCanvas().style.cursor = "";
        });
      } else {
        console.warn(`Layer "${Others}" not found. Check your MapTiler Studio layer ID.`);
      }
    });

    return () => map.remove();
  }, []);

  return (
    <div
      ref={mapContainer}
      style={{
        width: "100%",
        height: "100vh", // full screen map
        borderRadius: "12px",
        overflow: "hidden",
      }}
    />
  );
};

export default Map;
