import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const DormDetail = () => {
  const navigate = useNavigate();
  const { dormId } = useParams();
  const [tooltipInfo, setTooltipInfo] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const imageRef = useRef(null);
  
  // Room data states
  const [allRooms, setAllRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filter states
  const [filterCapacity, setFilterCapacity] = useState("");
  const [filterClassYear, setFilterClassYear] = useState("");
  const [filterAvailability, setFilterAvailability] = useState("available");
  const [filterAC, setFilterAC] = useState(""); // New AC filter
  
  // User data
  const [userId, setUserId] = useState(null);
  const [userClassYear, setUserClassYear] = useState(null);
  const [groupSize, setGroupSize] = useState(0);
  
  const dormImages = {
    "harwood-court": "/images/harwood-court-1.jpg",
    "clark-i": "/images/clark-i.jpg",
    "sontag-hall": "/images/sontag-hall.jpg",
    "mudd-blaisdell-hall": "/images/mudd-blaisdell-hall.jpg",
    // Add all your dorms here
  };

  // Define image maps for each dorm
  const dormMaps = {
    "harwood-court": [
      { coords: "228,424,163,372", roomId: "109", info: "Room 109" },
      { coords: "246,519,308,574", roomId: "104", info: "Room 104" },
      { coords: "209,520,233,575", roomId: "101", info: "Room 101" },
      { coords: "246,477,298,513", roomId: "102", info: "Room 102" },
      { coords: "248,449,299,473", roomId: "106", info: "Room 106" },
      { coords: "296,419,249,387", roomId: "108", info: "Room 108" },
      { coords: "177,340,227,370", roomId: "111", info: "Room 111" },
      { coords: "247,359,295,386", roomId: "110", info: "Room 110" },
      { coords: "180,308,227,340", roomId: "113", info: "Room 113" },
      { coords: "248,289,295,320", roomId: "114", info: "Room 114" },
      { coords: "175,244,224,273", roomId: "117", info: "Room 117" },
      { coords: "247,261,281,288", roomId: "116", info: "Room 116" },
      { coords: "175,215,225,243", roomId: "119", info: "Room 119" },
      { coords: "298,261,265,215", roomId: "120", info: "Room 120" },
      { coords: "222,123,253,163", roomId: "123", info: "Room 123" },
      { coords: "285,161,256,125", roomId: "125", info: "Room 125" },
      { coords: "312,143,346,192", roomId: "127", info: "Room 127" },
      { coords: "594,123,625,171", roomId: "145", info: "Room 145" },
      { coords: "656,124,627,170", roomId: "147", info: "Room 147" },
      { coords: "595,225,625,267", roomId: "142", info: "Room 142" },
      { coords: "656,265,627,227", roomId: "144", info: "Room 144" },
      { coords: "660,263,707,290", roomId: "162", info: "Room 162" },
      { coords: "656,293,706,320", roomId: "164", info: "Room 164" },
      { coords: "728,278,782,303", roomId: "163", info: "Room 163" },
      { coords: "727,306,777,336", roomId: "165", info: "Room 165" },
      { coords: "729,340,779,368", roomId: "167", info: "Room 167" },
      { coords: "657,362,706,391", roomId: "168", info: "Room 168" },
      { coords: "657,393,708,419", roomId: "170", info: "Room 170" },
      { coords: "726,407,778,440", roomId: "171", info: "Room 171" },
      { coords: "658,452,705,480", roomId: "172", info: "Room 172" },
      { coords: "728,441,776,464", roomId: "173", info: "Room 173" },
      { coords: "728,467,777,494", roomId: "175", info: "Room 175" },
      { coords: "660,483,705,507", roomId: "174", info: "Room 174" },
      { coords: "728,497,776,524", roomId: "176", info: "Room 176" },
      { coords: "708,544,661,513", roomId: "177", info: "Room 177" },
      { coords: "727,528,777,566", roomId: "179", info: "Room 179" },
      { coords: "659,549,691,595", roomId: "178", info: "Room 178" },
      { coords: "726,567,777,593", roomId: "181", info: "Room 181" },
      { coords: "582,575,617,608", roomId: "180", info: "Room 180" },
      { coords: "583,612,628,640", roomId: "182", info: "Room 182" },
      { coords: "662,612,706,640", roomId: "184", info: "Room 184" },
      { coords: "727,597,778,626", roomId: "183", info: "Room 183" },
      { coords: "776,665,729,628", roomId: "187", info: "Room 187" },
      { coords: "705,680,745,708", roomId: "185", info: "Room 185" },
      { coords: "750,667,775,707", roomId: "189", info: "Room 189" },
    ]
  };
  

  const image = dormImages[dormId];
  const mapData = dormMaps[dormId] || [];

  // Load user data and room data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      
      try {
        // Get userId from localStorage
        const storedUserId = localStorage.getItem("userId");
        if (!storedUserId) {
          navigate("/signin");
          return;
        }
        
        setUserId(storedUserId);
        
        // Fetch user data to get class year and group info
        const userResponse = await axios.get(`http://localhost:5001/users/${storedUserId}`);
        const userData = userResponse.data;
        setUserClassYear(userData.class_year);
        
        // Fetch roommates to determine group size
        if (userData.group_id) {
          const roommatesResponse = await axios.get(`http://localhost:5001/users/roommates/${storedUserId}`);
          setGroupSize(roommatesResponse.data.roommates.length);
        } else {
          setGroupSize(1); // Just the user if no roommates
        }
        
        // Fetch all rooms
        const roomsResponse = await axios.get("http://localhost:5001/rooms");
        const roomsData = roomsResponse.data;
        
        // Filter rooms for this dorm only (assuming rooms have a dorm_id field)
        const dormRooms = roomsData.filter(room => room.dorm_id === dormId);
        setAllRooms(dormRooms);
        
        // Try to get filtered rooms, but don't break if it fails
        try {
          const filteredRoomsResponse = await axios.get(`http://localhost:5001/rooms/filtered/${storedUserId}`);
          setFilteredRooms(filteredRoomsResponse.data.filter(room => room.dorm_id === dormId));
        } catch (filterErr) {
          console.warn("Could not get filtered rooms:", filterErr);
          // Just use all available rooms instead
          setFilteredRooms(dormRooms.filter(room => !room.is_taken));
        }
        
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load room data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [dormId, navigate]);

  // Apply manual filters on top of API filtered rooms
  useEffect(() => {
    if (allRooms.length === 0) return;
    
    let filtered = [...allRooms];
    
    // Filter by availability
    if (filterAvailability === "available") {
      filtered = filtered.filter(room => !room.is_taken);
    } else if (filterAvailability === "taken") {
      filtered = filtered.filter(room => room.is_taken);
    }
    
    // Filter by capacity
    if (filterCapacity) {
      filtered = filtered.filter(room => room.capacity === parseInt(filterCapacity));
    }
    
    // Filter by class year
    if (filterClassYear) {
      filtered = filtered.filter(room => room.class_year === parseInt(filterClassYear));
    }
    
    // Filter by AC
    if (filterAC === "yes") {
      filtered = filtered.filter(room => room.has_ac === true);
    } else if (filterAC === "no") {
      filtered = filtered.filter(room => room.has_ac === false);
    }
    
    setFilteredRooms(filtered);
  }, [filterAvailability, filterCapacity, filterClassYear, filterAC, allRooms]);

  const handleAreaMouseOver = (e, info) => {
    setTooltipInfo(info);
    setShowTooltip(true);
    updateTooltipPosition(e);
  };

  const handleAreaMouseOut = () => {
    setShowTooltip(false);
  };

  const handleAreaMouseMove = (e) => {
    updateTooltipPosition(e);
  };

  const updateTooltipPosition = (e) => {
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      setTooltipPosition({
        x: e.clientX - rect.left + 15,
        y: e.clientY - rect.top + 15
      });
    }
  };

  const handleRoomSelect = async (roomId) => {
    try {
      // Check if the user already has a room assigned
      const userResponse = await axios.get(`http://localhost:5001/users/${userId}`);
      const userData = userResponse.data;
      
      if (userData.room_id) {
        // Confirm with user that they want to change rooms
        if (!window.confirm("You already have a room assigned. Do you want to change your selection?")) {
          return;
        }
        
        // Unselect the current room first
        await axios.post("http://localhost:5001/rooms/unselectRoom", {
          room_id: userData.room_id,
          user_id: userId
        });
      }
      
      // Select the new room
      await axios.post("http://localhost:5001/rooms/selectRoom", {
        room_id: roomId,
        user_id: userId
      });
      
      // Refresh the room data
      const roomsResponse = await axios.get("http://localhost:5001/rooms");
      const roomsData = roomsResponse.data;
      const dormRooms = roomsData.filter(room => room.dorm_id === dormId);
      setAllRooms(dormRooms);
      
      // Show success message
      alert("Room selected successfully!");
      
    } catch (error) {
      console.error("Error selecting room:", error);
      alert("Failed to select room. Please try again.");
    }
  };

  const handleBackToMap = () => {
    navigate("/map");
  };

  const resetFilters = () => {
    setFilterCapacity("");
    setFilterClassYear("");
    setFilterAvailability("available");
    setFilterAC("");
  };

  // Get unique values for filters
  const getUniqueValues = (field) => {
    if (!allRooms || allRooms.length === 0) return [];
    const uniqueValues = [...new Set(allRooms.map(room => room[field]))];
    return uniqueValues.sort((a, b) => a - b); // Sort numerically
  };

  const uniqueCapacities = getUniqueValues("capacity");
  const uniqueClassYears = getUniqueValues("class_year");

  // Find room info for map tooltips
  const getRoomInfoFromId = (roomId) => {
    const room = allRooms.find(r => r.id === roomId);
    if (!room) return "Room information not available";
    
    let info = `Room ${room.room_number} - ${room.capacity} person`;
    if (room.capacity !== 1) info += "s";
    info += ` - ${room.is_taken ? 'Taken' : 'Available'}`;
    if (room.has_ac) info += " - Has AC";
    
    return info;
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <span style={styles.logoIcon}>🏠</span>
          <span style={styles.logoText}>Housing47</span>
        </div>
        <div style={styles.navLinks}>
          <button style={styles.navLink} onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button style={styles.navLink} onClick={() => navigate("/dorms")}>Browse Housing</button>
          <button style={styles.navLink} onClick={() => navigate("/group")}>My Group</button>
          <button 
            onClick={() => {
              localStorage.removeItem("userId");
              navigate("/");
            }} 
            style={styles.signOutButton}
          >
            Sign Out
          </button>
        </div>
      </header>

      <main style={styles.mainContent}>
        {/* Left Side Filters */}
        <div style={styles.leftSidebar}>
          <div style={styles.sidebarHeader}>
            <button 
              onClick={handleBackToMap}
              style={styles.backButton}
            >
              ← Back to Dorms
            </button>
            <h1 style={styles.dormTitle}>{dormId.replace(/-/g, " ").toUpperCase()}</h1>
            <p style={styles.dormSubtitle}>Interactive Floor Plan</p>
          </div>
          
          <div style={styles.filterSection}>
            <h2 style={styles.filterTitle}>Filter Rooms</h2>
            
            {/* Filter by Availability */}
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Availability</label>
              <select 
                style={styles.filterSelect}
                value={filterAvailability}
                onChange={(e) => setFilterAvailability(e.target.value)}
              >
                <option value="all">All Rooms</option>
                <option value="available">Available Only</option>
                <option value="taken">Taken Only</option>
              </select>
            </div>
            
            {/* Filter by AC */}
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Air Conditioning</label>
              <select 
                style={styles.filterSelect}
                value={filterAC}
                onChange={(e) => setFilterAC(e.target.value)}
              >
                <option value="">All Rooms</option>
                <option value="yes">With AC Only</option>
                <option value="no">Without AC</option>
              </select>
            </div>
            
            {/* Filter by Capacity */}
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Room Capacity</label>
              <select 
                style={styles.filterSelect}
                value={filterCapacity}
                onChange={(e) => setFilterCapacity(e.target.value)}
              >
                <option value="">All Capacities</option>
                {uniqueCapacities.map(capacity => (
                  <option key={capacity} value={capacity}>
                    {capacity} {capacity === 1 ? 'Person' : 'People'}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Filter by Class Year */}
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Class Year Eligibility</label>
              <select 
                style={styles.filterSelect}
                value={filterClassYear}
                onChange={(e) => setFilterClassYear(e.target.value)}
              >
                <option value="">All Class Years</option>
                {uniqueClassYears.map(year => (
                  <option key={year} value={year}>
                    {year === 1 ? 'Freshman' : 
                     year === 2 ? 'Sophomore' :
                     year === 3 ? 'Junior' : 'Senior'}
                  </option>
                ))}
              </select>
            </div>
            
            <div style={styles.filterInfo}>
              <p>Your group size: <strong>{groupSize}</strong></p>
              <p>Your class year: <strong>
                {userClassYear === 1 ? 'Freshman' : 
                 userClassYear === 2 ? 'Sophomore' :
                 userClassYear === 3 ? 'Junior' : 'Senior'}
              </strong></p>
            </div>
            
            <button style={styles.resetButton} onClick={resetFilters}>
              Reset Filters
            </button>
            
            <button 
              style={styles.automaticFilterButton}
              onClick={async () => {
                try {
                  setLoading(true);
                  const response = await axios.get(`http://localhost:5001/rooms/filtered/${userId}`);
                  setFilteredRooms(response.data.filter(room => room.dorm_id === dormId));
                  setLoading(false);
                } catch (err) {
                  console.error("Error fetching filtered rooms:", err);
                  alert("Unable to find matching rooms. You may need to create a roommate group first.");
                  setLoading(false);
                }
              }}
            >
              Show Best Matches For My Group
            </button>
          </div>
          
          {/* Filtered Room List */}
          <div style={styles.roomListSection}>
            <h2 style={styles.roomListTitle}>
              Available Rooms {filteredRooms.length > 0 ? `(${filteredRooms.length})` : ''}
            </h2>
            
            {loading ? (
              <div style={styles.loadingContainer}>
                <div style={styles.loadingSpinner}></div>
                <p>Loading rooms...</p>
              </div>
            ) : error ? (
              <div style={styles.errorContainer}>
                <p>{error}</p>
              </div>
            ) : filteredRooms.length > 0 ? (
              <div style={styles.roomList}>
                {filteredRooms.map((room) => (
                  <div 
                    key={room.id} 
                    style={{
                      ...styles.roomListItem,
                      ...(room.is_taken ? styles.roomTaken : {})
                    }}
                    onClick={() => !room.is_taken && handleRoomSelect(room.id)}
                  >
                    <div style={styles.roomNumber}>Room {room.room_number}</div>
                    <div style={styles.roomDetails}>
                      <span>{room.capacity} {room.capacity === 1 ? 'person' : 'people'}</span>
                      <span> • </span>
                      <span>{
                        room.class_year === 1 ? 'Freshman' : 
                        room.class_year === 2 ? 'Sophomore' :
                        room.class_year === 3 ? 'Junior' : 'Senior'
                      }</span>
                      {room.has_ac && <span> • <span style={styles.acBadge}>AC</span></span>}
                    </div>
                    <div style={styles.roomStatus}>
                      {room.is_taken ? (
                        <span style={styles.takenBadge}>Taken</span>
                      ) : (
                        <span style={styles.availableBadge}>Available</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={styles.noRoomsText}>No rooms match your filters.</p>
            )}
          </div>
        </div>
        
        {/* Right Side Image */}
        <div style={styles.rightContent}>
          {image ? (
            <div style={styles.imageContainer}>
              <img
                ref={imageRef}
                src={image}
                alt={`${dormId} layout`}
                useMap={`#${dormId}-map`}
                style={styles.mapImage}
              />
              
              {/* Tooltip */}
              {showTooltip && (
                <div style={{
                  ...styles.tooltip,
                  left: `${tooltipPosition.x}px`,
                  top: `${tooltipPosition.y}px`,
                }}>
                  {tooltipInfo}
                </div>
              )}
              
              {/* Image Map */}
              <map name={`${dormId}-map`}>
                {mapData.map((area, index) => {
                  // Find the actual room data for this map area
                  const roomInfo = allRooms.find(r => r.id === area.roomId);
                  const displayInfo = roomInfo ? 
                    `Room ${roomInfo.room_number} - ${roomInfo.capacity} person${roomInfo.capacity !== 1 ? 's' : ''} - ${roomInfo.is_taken ? 'Taken' : 'Available'}${roomInfo.has_ac ? ' - Has AC' : ''}` : 
                    area.info;
                  
                  return (
                    <area
                      key={index}
                      shape="rect"
                      coords={area.coords}
                      alt={`Room ${area.roomId}`}
                      onClick={() => roomInfo && !roomInfo.is_taken && handleRoomSelect(area.roomId)}
                      onMouseOver={(e) => handleAreaMouseOver(e, displayInfo)}
                      onMouseOut={handleAreaMouseOut}
                      onMouseMove={handleAreaMouseMove}
                      style={{ cursor: roomInfo && !roomInfo.is_taken ? "pointer" : "default" }}
                    />
                  );
                })}
              </map>
            </div>
          ) : (
            <div style={styles.noImageContainer}>
              <p style={styles.noImageText}>No layout image found for this dorm.</p>
            </div>
          )}
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
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0',
    color: '#4F46E5',
    fontWeight: '500',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'color 0.2s',
    marginBottom: '1rem',
  },
  dormTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1F2937',
    margin: '0',
    marginBottom: '0.25rem',
  },
  dormSubtitle: {
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
  filterInfo: {
    marginTop: '0.5rem',
    padding: '0.75rem',
    backgroundColor: '#EEF2FF',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    color: '#4338CA',
  },
  resetButton: {
    marginTop: '0.5rem',
    padding: '0.5rem',
    backgroundColor: '#F3F4F6',
    color: '#4B5563',
    border: 'none',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  automaticFilterButton: {
    padding: '0.75rem 1rem',
    backgroundColor: '#4F46E5',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  roomListSection: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
  },
  roomListTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#374151',
    margin: '0 0 1rem 0',
  },
  roomList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    overflowY: 'auto',
  },
  roomListItem: {
    padding: '0.75rem',
    borderRadius: '0.375rem',
    backgroundColor: 'white',
    border: '1px solid #E5E7EB',
    cursor: 'pointer',
    transition: 'border-color 0.2s, transform 0.1s',
  },
  roomTaken: {
    backgroundColor: '#F3F4F6',
    cursor: 'default',
    opacity: 0.8,
  },
  roomNumber: {
    fontWeight: '600',
    color: '#1F2937',
    fontSize: '0.875rem',
  },
  roomDetails: {
    color: '#6B7280',
    fontSize: '0.75rem',
    marginTop: '0.25rem',
  },
  acBadge: {
    backgroundColor: '#DBEAFE',
    color: '#1E40AF',
    padding: '0.125rem 0.375rem',
    borderRadius: '9999px',
    fontSize: '0.625rem',
    fontWeight: '500',
  },
  roomStatus: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '0.5rem',
  },
  availableBadge: {
    backgroundColor: '#D1FAE5',
    color: '#047857',
    fontSize: '0.75rem',
    fontWeight: '500',
    padding: '0.25rem 0.5rem',
    borderRadius: '9999px',
  },
  takenBadge: {
    backgroundColor: '#FEE2E2',
    color: '#B91C1C',
    fontSize: '0.75rem',
    fontWeight: '500',
    padding: '0.25rem 0.5rem',
    borderRadius: '9999px',
  },
  noRoomsText: {
    color: '#6B7280',
    fontSize: '0.875rem',
    fontStyle: 'italic',
  },
  rightContent: {
    flex: '1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: '1rem',
    overflow: 'auto',
  },
  imageContainer: {
    position: 'relative',
    maxHeight: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: 'rgba(79, 70, 229, 0.9)',
    color: 'white',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    zIndex: 100,
    pointerEvents: 'none',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },
  noImageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  noImageText: {
    color: '#6B7280',
    fontSize: '1.125rem',
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
  errorContainer: {
    padding: '1rem',
    backgroundColor: '#FEE2E2',
    color: '#B91C1C',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
  },
};

export default DormDetail;