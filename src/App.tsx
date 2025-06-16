
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import LandingPage from "./pages/Landing";
import BrowsePage from "./pages/Browse";
import CarDetailsPage from "./pages/CarDetails";
import TripsPage from "./pages/Trips";
import SavedCarsPage from "./pages/SavedCars";

function App() {
 
  
  return (
    <div className="bg-emerald-">
      <Router>
        <Routes>
          
          <Route path="/" element={<LandingPage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/booking" element={<TripsPage />} />
          <Route path="/trips" element={<TripsPage />} />
          <Route path="/saved" element={<SavedCarsPage />} />
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/signup" element={<div>Signup Page</div>} />
          <Route path="/car/:id" element={<CarDetailsPage />} />
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
