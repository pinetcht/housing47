import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>🚀 Welcome to Our Hackathon Project</h1>
      <p>Built with Vite + React + Firebase</p>
      <button onClick={() => navigate("/login")}>Go to Login</button>
      <button onClick={() => navigate("/map")}>Go to Map</button>
    </div>
  );
}
