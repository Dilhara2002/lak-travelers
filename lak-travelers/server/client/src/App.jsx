import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// 👇 FIXED IMPORT PATH (Removed "..")
import API from "./services/api"; 

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./pages/UserProfile";
import MyBookings from "./pages/MyBookings";

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


import VendorSetup from "./pages/VendorSetup";

function App() {
  return (
    <Router>
      <div className="font-sans bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        {/* Navbar stays fixed at the top */}
        <Navbar />

        {/* 👇 ADDED 'pt-24': Pushes content down so it's not hidden behind Navbar */}
        <main className="pt-24 flex-grow px-4 md:px-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected / User Routes */}
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Hotel Routes */}
            <Route path="/hotels" element={<HotelList />} />
            <Route path="/hotels/:id" element={<HotelDetails />} />
            <Route path="/add-hotel" element={<AddHotel />} />
            <Route path="/edit-hotel/:id" element={<EditHotel />} />

            {/* Tour Routes */}
            <Route path="/tours" element={<TourList />} />
            <Route path="/tours/:id" element={<TourDetails />} />
            <Route path="/add-tour" element={<AddTour />} />
            <Route path="/edit-tour/:id" element={<EditTour />} />

            {/* Vehicle Routes */}
            <Route path="/vehicles" element={<VehicleList />} />
            <Route path="/vehicles/:id" element={<VehicleDetails />} />
            <Route path="/add-vehicle" element={<AddVehicle />} />
            <Route path="/vendor-setup" element={<VendorSetup />} />
            
          </Routes>
        </main>

        {/* Footer stays at the bottom */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;