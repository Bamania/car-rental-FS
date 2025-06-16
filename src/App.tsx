import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import LandingPage from "./pages/Landing";
import BrowsePage from "./pages/Browse";
import CarDetailsPage from "./pages/CarDetails";
import TripsPage from "./pages/Trips";
import SavedCarsPage from "./pages/SavedCars";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div className="bg-emerald-">
      <Router>
        <Routes>

          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
    
          <Route 
            path="/browse" 
            element={
              <ProtectedRoute>
                <BrowsePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/booking" 
            element={
              <ProtectedRoute>
                <TripsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/trips" 
            element={
              <ProtectedRoute>
                <TripsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/saved" 
            element={
              <ProtectedRoute>
                <SavedCarsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/car/:id" 
            element={
              <ProtectedRoute>
                <CarDetailsPage />
              </ProtectedRoute>
            } 
          />
          
      
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
