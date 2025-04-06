import { useParams } from "react-router-dom";

const DormDetail = () => {
  const { dormId } = useParams();

  // Map dorm IDs to image filenames
  const dormImages = {
    "clark-i": "/images/clark-i.jpg",
    "clark-iii": "/images/clark-iii.jpg",
    "mudd-blaisdell-hall": "/images/mudd-blaisdell-hall.jpg",
    "harwood-court": "/ResHall-FloorPlan-Harwood 1.pdf",
    // Add the rest...
  };

  const image = dormImages[dormId];

  if (!image) {
    return <div>Dorm not found.</div>;
  }

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>{dormId.replace(/-/g, " ").toUpperCase()}</h2>
      <img src={image} alt={`${dormId} layout`} style={{ maxWidth: "100%", height: "auto" }} />
    </div>
  );
};

export default DormDetail;
