import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const Map = () => {
  const navigate = useNavigate();
  const mapContainer = useRef(null);
  const [selectedDorm, setSelectedDorm] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [filterValue, setFilterValue] = useState("all");

  // Sample dorm data (replace with actual data from your API)
  const dormData = [
    { id: "harwood-court", name: "Harwood Court", type: "hall", capacity: 120, classYear: "Sophmore/Junior" },
    { id: "clark-i", name: "Clark I", type: "hall", capacity: 85, classYear: "Junior" },
    { id: "sontag-hall", name: "Sontag Hall", type: "hall", capacity: 65, classYear: "Senior" },
    { id: "mudd-blaisdell-hall", name: "Mudd-Blaisdell Hall", type: "hall", capacity: 180, classYear: "Freshman/Sophmore" },
  ];

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style:
        "https://api.maptiler.com/maps/01960843-60c0-72bd-844a-3bde22239aa5/style.json?key=UHRJl9L3oK7bh3QT6De6",
      center: [-117.7103, 34.0975], // Pomona College
      zoom: 16,
    });

    map.on("load", () => {
      setMapLoaded(true);
      const dormLayerId = "Dorm map"; // Replace with your actual label layer ID

      if (map.getLayer(dormLayerId)) {
        map.on("click", dormLayerId, (e) => {
          const dormName = e.features[0].properties.name;
          const dormId = dormName.toLowerCase().replace(/\s+/g, "-");
          
          // Find the dorm data to display in the sidebar
          const dorm = dormData.find(d => d.id === dormId) || { 
            id: dormId, 
            name: dormName,
            type: "Unknown",
            capacity: "Unknown",
            classYear: "Unknown"
          };
          
          setSelectedDorm(dorm);
        });

        map.on("mouseenter", dormLayerId, () => {
          map.getCanvas().style.cursor = "pointer";
        });

        map.on("mouseleave", dormLayerId, () => {
          map.getCanvas().style.cursor = "";
        });
      } else {
        console.warn(
          `Layer "${dormLayerId}" not found. Check your MapTiler Studio layer ID.`
        );
        console.log("Available layers:");
        console.log(map.getStyle().layers.map((l) => l.id));
      }
      
      // You could add custom markers for dorms here if needed
      dormData.forEach(dorm => {
        // This is a placeholder - you'll need actual coordinates for each dorm
        // const marker = new maplibregl.Marker({ color: "#4F46E5" })
        //  .setLngLat([longitude, latitude])
        //  .addTo(map);
      });
    });

    return () => map.remove();
  }, []);

  const handleViewDorm = (dormId) => {
    navigate(`/dorms/${dormId}`);
  };

  const handleSignOut = () => {
    localStorage.removeItem("userId");
    navigate("/");
  };

  const filteredDorms = filterValue === "all" 
    ? dormData 
    : dormData.filter(dorm => dorm.type === filterValue);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <span style={styles.logoIcon}>🏠</span>
          <span style={styles.logoText}>Housing47</span>
        </div>
        <div style={styles.navLinks}>
          <button style={styles.navLink} onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button style={{...styles.navLink, ...styles.activeNavLink}}>Browse Housing</button>
          <button style={styles.navLink} onClick={() => navigate("/group")}>My Group</button>
          <button 
            onClick={handleSignOut} 
            style={styles.signOutButton}
          >
            Sign Out
          </button>
        </div>
      </header>

      <main style={styles.mainContent}>
        {/* Left Sidebar */}
        <div style={styles.leftSidebar}>
          <div style={styles.sidebarHeader}>
            <h1 style={styles.mapTitle}>Campus Housing Map</h1>
            <p style={styles.mapSubtitle}>Click on a dorm to view details and select a room</p>
          </div>

          <div style={styles.filterSection}>
            <h2 style={styles.filterTitle}>Filter Dorms</h2>
            
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Housing Type</label>
              <select 
                style={styles.filterSelect}
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
              >
                <option value="all">All Housing Types</option>
                <option value="hall">Residence Halls</option>
                <option value="suite">Suites</option>
                <option value="apartment">Apartments</option>
              </select>
            </div>
          </div>

          {/* Dorms List */}
          <div style={styles.dormListSection}>
            <h2 style={styles.dormListTitle}>
              Available Housing ({filteredDorms.length})
            </h2>
            
            {mapLoaded ? (
              <div style={styles.dormList}>
                {filteredDorms.map((dorm) => (
                  <div 
                    key={dorm.id} 
                    style={{
                      ...styles.dormListItem,
                      ...(selectedDorm?.id === dorm.id ? styles.selectedDorm : {})
                    }}
                    onClick={() => setSelectedDorm(dorm)}
                  >
                    <div style={styles.dormName}>{dorm.name}</div>
                    <div style={styles.dormDetails}>
                      <span>{dorm.type === "hall" ? "Residence Hall" : 
                             dorm.type === "suite" ? "Suite" : 
                             dorm.type === "apartment" ? "Apartment" : dorm.type}</span>
                      <span> • </span>
                      <span>Capacity: {dorm.capacity}</span>
                    </div>
                    <div style={styles.dormClassYear}>
                      <span style={styles.classYearBadge}>{dorm.classYear}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.loadingContainer}>
                <div style={styles.loadingSpinner}></div>
                <p>Loading campus map...</p>
              </div>
            )}
          </div>

          {/* Selected Dorm Details */}
          {selectedDorm && (
            <div style={styles.selectedDormSection}>
              <h2 style={styles.selectedDormTitle}>{selectedDorm.name}</h2>
              <div style={styles.selectedDormDetails}>
                <p><strong>Type:</strong> {selectedDorm.type === "hall" ? "Residence Hall" : 
                                          selectedDorm.type === "suite" ? "Suite" : 
                                          selectedDorm.type === "apartment" ? "Apartment" : selectedDorm.type}</p>
                <p><strong>Capacity:</strong> {selectedDorm.capacity}</p>
                <p><strong>Class Year:</strong> {selectedDorm.classYear}</p>
              </div>
              <button 
                style={styles.viewDormButton}
                onClick={() => handleViewDorm(selectedDorm.id)}
              >
                View Floor Plans & Select Room
              </button>
            </div>
          )}
        </div>
        
        {/* Map Container */}
        <div style={styles.mapContainer}>
          <div
            ref={mapContainer}
            style={styles.mapElement}
          />
        </div>
      </main>
      
      <footer style={styles.footer}>
        <p>&copy; 2025 Housing47. All rights reserved.</p>
      </footer>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: 'white',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  logoIcon: {
    fontSize: '1.5rem',
  },
  logoText: {
    fontWeight: 'bold',
    fontSize: '1.25rem',
    color: '#4F46E5',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  navLink: {
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    color: '#4B5563',
    fontWeight: '500',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s, color 0.2s',
  },
  activeNavLink: {
    backgroundColor: '#EEF2FF',
    color: '#4F46E5',
  },
  signOutButton: {
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    color: '#EF4444',
    fontWeight: '500',
    background: 'none',
    border: '1px solid #EF4444',
    cursor: 'pointer',
    transition: 'background-color 0.2s, color 0.2s',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    height: 'calc(100vh - 137px)', // Header and footer height
    overflow: 'hidden',
  },
  leftSidebar: {
    width: '350px',
    backgroundColor: 'white',
    borderRight: '1px solid #E5E7EB',
    padding: '1.5rem',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  sidebarHeader: {
    marginBottom: '1rem',
  },
  mapTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1F2937',
    margin: '0',
    marginBottom: '0.25rem',
  },
  mapSubtitle: {
    fontSize: '0.875rem',
    color: '#6B7280',
    margin: '0',
  },
  filterSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '1.5rem',
    backgroundColor: '#F9FAFB',
    borderRadius: '0.5rem',
  },
  filterTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#374151',
    margin: '0 0 0.5rem 0',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  filterLabel: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#4B5563',
  },
  filterSelect: {
    padding: '0.5rem',
    borderRadius: '0.375rem',
    border: '1px solid #D1D5DB',
    fontSize: '0.875rem',
    color: '#1F2937',
    backgroundColor: 'white',
  },
  dormListSection: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
  },
  dormListTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#374151',
    margin: '0 0 1rem 0',
  },
  dormList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    overflowY: 'auto',
  },
  dormListItem: {
    padding: '0.75rem',
    borderRadius: '0.375rem',
    backgroundColor: 'white',
    border: '1px solid #E5E7EB',
    cursor: 'pointer',
    transition: 'border-color 0.2s, transform 0.1s',
  },
  selectedDorm: {
    borderColor: '#4F46E5',
    backgroundColor: '#F5F7FF',
  },
  dormName: {
    fontWeight: '600',
    color: '#1F2937',
    fontSize: '0.875rem',
  },
  dormDetails: {
    color: '#6B7280',
    fontSize: '0.75rem',
    marginTop: '0.25rem',
  },
  dormClassYear: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '0.5rem',
  },
  classYearBadge: {
    backgroundColor: '#DBEAFE',
    color: '#1E40AF',
    fontSize: '0.75rem',
    fontWeight: '500',
    padding: '0.25rem 0.5rem',
    borderRadius: '9999px',
  },
  selectedDormSection: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#F9FAFB',
    borderRadius: '0.5rem',
    border: '1px solid #E5E7EB',
  },
  selectedDormTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#1F2937',
    margin: '0 0 0.75rem 0',
  },
  selectedDormDetails: {
    fontSize: '0.875rem',
    color: '#4B5563',
    marginBottom: '1rem',
  },
  viewDormButton: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#4F46E5',
    color: 'white',
    fontWeight: '500',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  mapContainer: {
    flex: '1',
    position: 'relative',
  },
  mapElement: {
    width: '100%',
    height: '100%',
  },
  footer: {
    borderTop: '1px solid #E5E7EB',
    padding: '1rem',
    textAlign: 'center',
    color: '#6B7280',
    backgroundColor: 'white',
    fontSize: '0.875rem',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem 0',
    color: '#6B7280',
  },
  loadingSpinner: {
    width: '2rem',
    height: '2rem',
    border: '3px solid #E5E7EB',
    borderTopColor: '#4F46E5',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '0.5rem',
  },
};




export default Map;