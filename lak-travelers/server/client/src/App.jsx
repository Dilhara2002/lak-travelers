import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HotelList from "./pages/HotelList";
import AddHotel from "./pages/AddHotel";
import HotelDetails from "./pages/HotelDetails";
import MyBookings from "./pages/MyBookings";

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;