import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api'; 
import TourCard from '../components/cards/TourCard'; // Folder structure එකට අනුව මාවත තහවුරු කරගන්න

const TourList = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  // 🔐 පරිශීලක තොරතුරු ආරක්ෂිතව ලබා ගැනීම
  const user = useMemo(() => {
    const savedUser = localStorage.getItem("userInfo");
    return savedUser ? JSON.parse(savedUser) : null;
  }, []);

  /**
   * 📡 Backend එකෙන් ටුවර් පැකේජ ලබා ගැනීම
   */
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/tours');
        setTours(data);
        setError(null);
      } catch (err) {
        console.error("Fetch Tours Error:", err);
        setError("Failed to load tour packages. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  /**
   * 🗑️ පැකේජයක් මකා දැමීම (Delete)
   */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tour? 🗑️")) return;

    try {
      await API.delete(`/tours/${id}`);
      setTours(prevTours => prevTours.filter((t) => t._id !== id));
      // Optional: Success toast message
    } catch (err) {
      console.error("Delete Error:", err);
      alert(err.response?.data?.message || "Unauthorized: You cannot delete this package.");
    }
  };

  /**
   * 🔍 සෙවුම් යන්ත්‍රය (Search Filtering) - Performance වැඩි කිරීමට useMemo භාවිතා කළ හැක
   */
  const filteredTours = tours.filter((tour) =>
    tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tour.destinations?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * 🦴 Skeleton Card Component
   */
  const SkeletonCard = () => (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 animate-pulse">
      <div className="h-64 bg-gray-200 rounded-2xl mb-4"></div>
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-7xl mx-auto">

        {/* --- 1. HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Tour Packages 🚐
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              Explore the hidden gems of Sri Lanka with our expert guides.
            </p>
          </div>

          {/* Create Button (Vendor/Admin Only) */}
          {user && (user.role === 'vendor' || user.role === 'admin') && (
            <Link
              to="/add-tour"
              className="group relative inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-bold shadow-xl hover:bg-slate-800 transition-all transform hover:-translate-y-1 active:scale-95 overflow-hidden"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Create New Package</span>
            </Link>
          )}
        </div>

        {/* --- 2. SEARCH BAR --- */}
        <div className="relative mb-12 max-w-2xl group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400 group-focus-within:text-slate-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by destination (e.g. Ella, Sigiriya)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all text-gray-700 text-lg"
          />
        </div>

        {/* --- 3. TOURS GRID / CONTENT --- */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, n) => <SkeletonCard key={n} />)}
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-red-50 rounded-3xl border border-red-100">
            <p className="text-red-600 font-bold">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 text-slate-900 underline font-semibold">Try Refreshing</button>
          </div>
        ) : filteredTours.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[2.5rem] border border-dashed border-gray-200 shadow-inner">
            <div className="inline-block p-6 rounded-full bg-gray-50 mb-6 text-5xl">🗺️</div>
            <h3 className="text-2xl font-bold text-slate-900">No packages found</h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto">We couldn't find any results for "{searchTerm}". Try checking your spelling or search for another city.</p>
            <button 
              onClick={() => setSearchTerm("")}
              className="mt-6 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredTours.map((tour) => (
              <div key={tour._id} className="animate-fade-in-up">
                <TourCard 
                  tour={tour}
                  onDelete={() => handleDelete(tour._id)}
                  user={user}
                />
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default TourList;