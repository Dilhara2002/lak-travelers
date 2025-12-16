import { useEffect, useState } from 'react';
import API from '../services/api';
import HotelCard from '../components/cards/HotelCard';
import { Link } from 'react-router-dom';

const HotelList = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 👇 Login වී සිටින User ගේ විස්තර ගන්නවා
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const fetchHotels = async () => {
    try {
      const { data } = await API.get('/hotels');
      setHotels(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching hotels:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  // 👇 DELETE FUNCTION
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this hotel? 🗑️")) {
      try {
        await API.delete(`/hotels/${id}`);
        // List එකෙන් අයින් කරනවා
        setHotels(hotels.filter((h) => h._id !== id));
        alert("Hotel Deleted Successfully!");
      } catch (error) {
        console.error(error);
        alert("Failed to delete. You are not authorized.");
      }
    }
  };

  const filteredHotels = hotels.filter((hotel) => 
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Find your perfect stay 🏨</h1>
          <p className="text-gray-500 mt-1">Browse top-rated hotels across Sri Lanka.</p>
        </div>
        
        {/* Add Hotel Button: Vendor හෝ Admin ට විතරයි පේන්නේ */}
        {user && (user.role === 'vendor' || user.role === 'admin') && (
          <Link to="/add-hotel" className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 font-medium shadow-md">
            + Add Hotel
          </Link>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-lg w-full">
          <input 
            type="text" 
            placeholder="Search hotels... 🔍" 
            className="w-full p-4 pl-5 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-20 text-xl text-gray-500">Loading hotels... ⏳</div>
      ) : filteredHotels.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <h3 className="text-xl text-gray-600">No hotels found.</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredHotels.map((hotel) => (
            <div key={hotel._id} className="relative group">
              {/* Hotel Card එක */}
              <HotelCard hotel={hotel} />

              {/* 👇 DELETE BUTTON (Admin or Owner Only) */}
              {user && (user.role === 'admin' || user._id === hotel.user) && (
                <button 
                  onClick={() => handleDelete(hotel._id)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition transform hover:scale-110 z-10"
                  title="Delete Hotel"
                >
                  🗑️
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HotelList;