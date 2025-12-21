import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages Import
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

import LegalPolicy from "./pages/LegalPolicy";
import AboutUs from "./pages/AboutUs";

// Components Import
import ChatBot from './components/ChatBot'; 
import AdminBookings from './pages/AdminBookings';
import VendorBookings from './pages/VendorBookings';

// 🛡️ Protected Route Component
const ProtectedRoute = ({ children }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  return userInfo ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <ToastContainer position="top-center" autoClose={2000} />
      
      <div className="font-sans bg-gray-50 text-gray-900 min-h-screen flex flex-col relative">
        <Navbar />
        
        <main className="pt-24 flex-grow px-4 md:px-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/hotels" element={<HotelList />} />
            <Route path="/hotels/:id" element={<HotelDetails />} />
            <Route path="/tours" element={<TourList />} />
            <Route path="/tours/:id" element={<TourDetails />} />
            <Route path="/vehicles" element={<VehicleList />} />
            <Route path="/vehicles/:id" element={<VehicleDetails />} />

            <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/vendor-setup" element={<ProtectedRoute><VendorSetup /></ProtectedRoute>} />
            <Route path="/my-bookings" element={<MyBookings />} />

            <Route path="/add-hotel" element={<ProtectedRoute><AddHotel /></ProtectedRoute>} />
            <Route path="/edit-hotel/:id" element={<ProtectedRoute><EditHotel /></ProtectedRoute>} />
            <Route path="/add-tour" element={<ProtectedRoute><AddTour /></ProtectedRoute>} />
            <Route path="/edit-tour/:id" element={<ProtectedRoute><EditTour /></ProtectedRoute>} />
            <Route path="/add-vehicle" element={<ProtectedRoute><AddVehicle /></ProtectedRoute>} />

            <Route path='/admin/bookings' element={<ProtectedRoute><AdminBookings /></ProtectedRoute>} />
            <Route path='/vendor/bookings' element={<ProtectedRoute><VendorBookings /></ProtectedRoute>} />

            <Route path="/privacy" element={<LegalPolicy />} />
            <Route path="/about" element={<AboutUs />} />

            <Route path="*" element={<div className="text-center py-20 font-bold text-gray-500">404 - Not Found</div>} />
          </Routes>
        </main>

        <ChatBot /> 
        <Footer />
      </div>
    </Router>
  );
}

export default App;