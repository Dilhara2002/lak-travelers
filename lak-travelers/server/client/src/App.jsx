import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// API Service
import API from "./services/api"; 

// General Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./pages/UserProfile";
import MyBookings from "./pages/MyBookings";
import VendorSetup from "./pages/VendorSetup";

// Hotel Pages
import HotelList from "./pages/HotelList";
import AddHotel from "./pages/AddHotel";
import HotelDetails from "./pages/HotelDetails";
import EditHotel from "./pages/EditHotel";

// Tour Pages
import TourList from "./pages/TourList";
import AddTour from "./pages/AddTour";
import TourDetails from "./pages/TourDetails";
import EditTour from "./pages/EditTour";

// Vehicle Pages
import VehicleList from "./pages/VehicleList";
import AddVehicle from "./pages/AddVehicle";
import VehicleDetails from "./pages/VehicleDetails";
// 👇 යම් හෙයකින් EditVehicle තිබේ නම් මෙයත් එක් කරන්න (නැතිනම් මෙය ඉවත් කරන්න)
// import EditVehicle from "./pages/EditVehicle"; 

function App() {
  return (
    <Router>
      <div className="font-sans bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        
        {/* Navbar - Fixed at top */}
        <Navbar />

        {/* Content Area - pt-24 pushes content below the fixed Navbar */}
        <main className="pt-24 flex-grow px-4 md:px-0">
          <Routes>
            {/* --- Auth & General --- */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/vendor-setup" element={<VendorSetup />} />
            <Route path="/my-bookings" element={<MyBookings />} />

            {/* --- Hotel Routes --- */}
            <Route path="/hotels" element={<HotelList />} />
            <Route path="/hotels/:id" element={<HotelDetails />} />
            <Route path="/add-hotel" element={<AddHotel />} />
            <Route path="/edit-hotel/:id" element={<EditHotel />} />

            {/* --- Tour Routes --- */}
            <Route path="/tours" element={<TourList />} />
            <Route path="/tours/:id" element={<TourDetails />} />
            <Route path="/add-tour" element={<AddTour />} />
            <Route path="/edit-tour/:id" element={<EditTour />} />

            {/* --- Vehicle Routes --- */}
            <Route path="/vehicles" element={<VehicleList />} />
            <Route path="/vehicles/:id" element={<VehicleDetails />} />
            <Route path="/add-vehicle" element={<AddVehicle />} />
            {/* <Route path="/edit-vehicle/:id" element={<EditVehicle />} /> */}
            
            {/* 404 Page (Optional) */}
            <Route path="*" element={<div className="text-center py-20 font-bold text-gray-500">404 - Page Not Found 🏝️</div>} />
          </Routes>
        </main>

        {/* Footer - Stays at bottom */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;