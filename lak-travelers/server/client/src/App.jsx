import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages Import (ඔබ එවූ ඒවාමයි...)
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./pages/UserProfile";
import MyBookings from "./pages/MyBookings";
import VendorSetup from "./pages/VendorSetup";
import HotelList from "./pages/HotelList";
import HotelDetails from "./pages/HotelDetails";
import AddHotel from "./pages/AddHotel";
import EditHotel from "./pages/EditHotel";
import TourList from "./pages/TourList";
import TourDetails from "./pages/TourDetails";
import AddTour from "./pages/AddTour";
import EditTour from "./pages/EditTour";
import VehicleList from "./pages/VehicleList";
import VehicleDetails from "./pages/VehicleDetails";
import AddVehicle from "./pages/AddVehicle";


import AdminBookings from './pages/AdminBookings';
import VendorBookings from './pages/VendorBookings';

// 🛡️ Protected Route Component: ලොග් වූ අයට පමණක් අවසර දීමට
const ProtectedRoute = ({ children }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  return userInfo ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="font-sans bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        <Navbar />
        <main className="pt-24 flex-grow px-4 md:px-0">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/hotels" element={<HotelList />} />
            <Route path="/hotels/:id" element={<HotelDetails />} />
            <Route path="/tours" element={<TourList />} />
            <Route path="/tours/:id" element={<TourDetails />} />
            <Route path="/vehicles" element={<VehicleList />} />
            <Route path="/vehicles/:id" element={<VehicleDetails />} />

            {/* Private Routes (ලොග් වී සිටිය යුතුය) */}
            <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/vendor-setup" element={<ProtectedRoute><VendorSetup /></ProtectedRoute>} />

            {/* Vendor Specific (ලොග් වූ Vendor ට පමණක්) */}
            <Route path="/add-hotel" element={<ProtectedRoute><AddHotel /></ProtectedRoute>} />
            <Route path="/edit-hotel/:id" element={<ProtectedRoute><EditHotel /></ProtectedRoute>} />
            <Route path="/add-tour" element={<ProtectedRoute><AddTour /></ProtectedRoute>} />
            <Route path="/edit-tour/:id" element={<ProtectedRoute><EditTour /></ProtectedRoute>} />
            <Route path="/add-vehicle" element={<ProtectedRoute><AddVehicle /></ProtectedRoute>} />

            <Route path='/admin/bookings' element={<AdminBookings />} />
            <Route path='/vendor/bookings' element={<VendorBookings />} />

            {/* 404 */}
            <Route path="*" element={<div className="text-center py-20 font-bold text-gray-500">404 - 🏝️ පර්වතයක් සොයාගත නොහැක!</div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;