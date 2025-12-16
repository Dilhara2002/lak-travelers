import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const Home = () => {
  const [hotels, setHotels] = useState([]);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // අලුත්ම Hotels 3 සහ Tours 3 ගන්නවා
        const hotelsRes = await API.get('/hotels');
        const toursRes = await API.get('/tours');
        
        // Data වලින් මුල් 3 විතරක් ගන්නවා (slice)
        setHotels(hotelsRes.data.slice(0, 3));
        setTours(toursRes.data.slice(0, 3));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching home data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Image Helper
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/300";
    if (imagePath.startsWith("http")) return imagePath;
    const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    return `http://localhost:5001${cleanPath}`;
  };

  return (
    <div>
      {/* 1. HERO SECTION (Main Banner) */}
      <div className="relative bg-blue-900 h-[500px] flex items-center justify-center text-center px-4">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1588258524675-c61d5e3057dc?q=80&w=2070&auto=format&fit=crop" 
            alt="Sri Lanka" 
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            Discover <span className="text-yellow-400">Sri Lanka</span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            Experience the pearl of the Indian Ocean. Book luxury hotels, amazing tour packages, and comfortable vehicles all in one place.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/hotels" className="bg-yellow-500 text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-yellow-400 transition transform hover:scale-105">
              Find Hotels 🏨
            </Link>
            <Link to="/tours" className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-gray-900 transition">
              Explore Tours 🚐
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 py-16">
        
        {/* 2. FEATURED HOTELS SECTION */}
        <div className="mb-16">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Top Rated Hotels 🏨</h2>
              <p className="text-gray-500 mt-2">Stay in the best places across the island.</p>
            </div>
            <Link to="/hotels" className="text-blue-600 font-semibold hover:underline">View All &rarr;</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {hotels.map((hotel) => (
              <div key={hotel._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition group">
                <div className="h-48 overflow-hidden">
                  <img src={getImageUrl(hotel.image)} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-xl mb-1">{hotel.name}</h3>
                  <p className="text-gray-500 text-sm mb-3">📍 {hotel.location}</p>
                  <p className="text-blue-600 font-bold">LKR {hotel.pricePerNight} <span className="text-xs text-gray-400">/ night</span></p>
                  <Link to={`/hotels/${hotel._id}`} className="mt-4 block text-center w-full border border-blue-600 text-blue-600 py-2 rounded hover:bg-blue-600 hover:text-white transition">View Details</Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. TRENDING TOURS SECTION */}
        <div>
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Trending Packages 🚐</h2>
              <p className="text-gray-500 mt-2">Unforgettable journeys curated for you.</p>
            </div>
            <Link to="/tours" className="text-green-600 font-semibold hover:underline">View All &rarr;</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tours.map((tour) => (
              <div key={tour._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition group">
                <div className="h-48 overflow-hidden relative">
                  <img src={getImageUrl(tour.image)} alt={tour.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                  <div className="absolute top-0 right-0 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">{tour.duration}</div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-xl mb-1">{tour.name}</h3>
                  <p className="text-gray-500 text-sm mb-3">📍 {tour.destinations}</p>
                  <p className="text-green-600 font-bold">LKR {tour.price} <span className="text-xs text-gray-400">/ person</span></p>
                  <Link to={`/tours/${tour._id}`} className="mt-4 block text-center w-full border border-green-600 text-green-600 py-2 rounded hover:bg-green-600 hover:text-white transition">View Package</Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;