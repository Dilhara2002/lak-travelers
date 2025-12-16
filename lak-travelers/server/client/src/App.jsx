import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HotelList from "./pages/HotelList";
import AddHotel from "./pages/AddHotel";
import HotelDetails from "./pages/HotelDetails";
import MyBookings from "./pages/MyBookings";
import EditHotel from "./pages/EditHotel";
import UserProfile from "./pages/UserProfile";
import TourList from "./pages/TourList";
import AddTour from "./pages/AddTour";
import TourDetails from "./pages/TourDetails";
import VehicleList from "./pages/VehicleList";
import AddVehicle from "./pages/AddVehicle";
import VehicleDetails from "./pages/VehicleDetails";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import EditTour from "./pages/EditTour";

function App() {
  return (
    <Router>
      <div className="font-sans bg-gray-50 text-gray-900 min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/hotels" element={<HotelList />} />
          <Route path="/add-hotel" element={<AddHotel />} />
          <Route path="/hotels/:id" element={<HotelDetails />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/edit-hotel/:id" element={<EditHotel />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/tours" element={<TourList />} />
          <Route path="/add-tour" element={<AddTour />} />
          <Route path="/tours/:id" element={<TourDetails />} />
          <Route path="/vehicles" element={<VehicleList />} />
          <Route path="/add-vehicle" element={<AddVehicle />} />
          <Route path="/vehicles/:id" element={<VehicleDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/edit-tour/:id" element={<EditTour />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;