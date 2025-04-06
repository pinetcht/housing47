import { useParams } from "react-router-dom";

const DormDetail = () => {
  const { dormId } = useParams();

  const dormImages = {
    "harwood-court": "/images/harwood-court-1.jpg",
    "clark-i": "/images/clark-i.jpg",
    "sontag-hall": "/images/sontag-hall.jpg",
    "mudd-blaisdell-hall": "/images/mudd-blaisdell-hall.jpg",
    // Add all your dorms here
  };

  const image = dormImages[dormId];

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>{dormId.replace(/-/g, " ").toUpperCase()}</h1>
      {image ? (
        <img
          src={image}
          alt={`${dormId} layout`}
          style={{
            maxWidth: "90%",
            maxHeight: "80vh",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
          }}
        />
      ) : (
        <p>No layout image found for this dorm.</p>
      )}
    </div>
  );
};

export default DormDetail;
