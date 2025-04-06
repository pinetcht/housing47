import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MapPage from "./pages/MapPage";
import DormDetail from "./pages/DormDetail";
import SignIn from "./pages/SignIn"; // your new sign-in page
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import About from "./pages/About";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Login />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/dorms/:dormId" element={<DormDetail />} /> {/* ✅ now active */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}
