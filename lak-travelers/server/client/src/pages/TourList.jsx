import { useEffect, useState } from 'react';
import API from '../services/api';
import TourCard from '../components/cards/TourCard';
import { Link } from 'react-router-dom';

const TourList = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const fetchTours = async () => {
    try {
      const { data } = await API.get('/tours');
      setTours(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tours:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this tour? 🗑️")) {
      try {
        await API.delete(`/tours/${id}`);
        setTours(tours.filter((t) => t._id !== id));
      } catch (error) {
        console.error(error);
        alert("Failed to delete. You are not authorized.");
      }
    }
  };

  const filteredTours = tours.filter((tour) =>
    tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tour.destinations.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Simple Skeleton Loader
  const SkeletonCard = () => (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 animate-pulse">
      <div className="h-72 bg-gray-200 rounded-2xl mb-4"></div>
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
              Tour Packages 🚐
            </h1>
            <p className="text-gray-500 mt-2">
              Discover the beauty of Sri Lanka with our curated tours.
            </p>
          </div>

          {/* ✨ PROFESSIONAL CREATE BUTTON (Vendor/Admin) */}
          {user && (user.role === 'vendor' || user.role === 'admin') && (
            <Link
              to="/add-tour"
              className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
            >
              {/* Shine Effect Overlay */}
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              
              <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
              <span className="relative z-10">Create Package</span>
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
            placeholder="Search packages by name or destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-gray-700"
          />
        </div>

        {/* 3. TOURS GRID */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => <SkeletonCard key={n} />)}
          </div>
        ) : filteredTours.length === 0 ? (
          // Empty State
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="inline-block p-4 rounded-full bg-gray-50 mb-4">
              <span className="text-4xl">🗺️</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900">No tours found</h3>
            <p className="text-gray-500 mt-2">We couldn't find any packages matching "{searchTerm}".</p>
            <button 
              onClick={() => setSearchTerm("")}
              className="mt-4 text-emerald-600 font-semibold hover:underline"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTours.map((tour) => (
              <TourCard 
                key={tour._id} 
                tour={tour}
                onDelete={() => handleDelete(tour._id)}
                user={user}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default TourList;