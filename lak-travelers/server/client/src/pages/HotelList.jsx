import { useEffect, useState } from 'react';
import API from '../services/api';
import HotelCard from '../components/cards/HotelCard';
import { Link } from 'react-router-dom';

const HotelList = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this hotel? 🗑️")) {
      try {
        await API.delete(`/hotels/${id}`);
        setHotels(hotels.filter((h) => h._id !== id));
      } catch (error) {
        console.error(error);
        alert("Failed to delete. You are not authorized.");
      }
    }
  };

  const filteredHotels = hotels.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Simple Skeleton Loader
  const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-pulse">
      <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* 1. HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Luxury Hotels 🏨
            </h1>
            <p className="text-gray-500 mt-2">
              Explore the best accommodations in Sri Lanka.
            </p>
          </div>

          {/* Add Hotel Button (Only for Vendor/Admin) */}
          {user && (user.role === 'vendor' || user.role === 'admin') && (
            <Link
              to="/add-hotel"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-md transition-transform transform hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              Add Hotel
            </Link>
          )}
        </div>

        {/* 2. SEARCH BAR */}
        <div className="relative mb-10 max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by hotel name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-700"
          />
        </div>

        {/* 3. HOTELS GRID */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <SkeletonCard key={n} />)}
          </div>
        ) : filteredHotels.length === 0 ? (
          // Empty State
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="inline-block p-4 rounded-full bg-gray-50 mb-4">
              <span className="text-4xl">🔍</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900">No hotels found</h3>
            <p className="text-gray-500 mt-2">We couldn't find any matches for "{searchTerm}".</p>
            <button 
              onClick={() => setSearchTerm("")}
              className="mt-4 text-blue-600 font-semibold hover:underline"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredHotels.map((hotel) => (
              <HotelCard
                key={hotel._id}
                hotel={hotel}
                onDelete={() => handleDelete(hotel._id)}
                user={user}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelList;