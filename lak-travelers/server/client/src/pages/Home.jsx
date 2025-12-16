import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

// 👇 Import your local images
import i1 from "../assets/i1.jpg"; 
import i2 from "../assets/i2.jpg"; 
import i3 from "../assets/i3.jpg"; 
import i4 from "../assets/i4.jpg"; 
import i5 from "../assets/i5.jpg"; 
import i6 from "../assets/i6.jpg"; 
import i7 from "../assets/i7.jpg"; 

const Home = () => {
  const [hotels, setHotels] = useState([]);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 👇 State for the background slider index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 👇 Array of imported image variables
  const heroImages = [i1, i2, i3, i4, i5, i6, i7];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hotelsRes = await API.get('/hotels');
        const toursRes = await API.get('/tours');
        setHotels(hotelsRes.data.slice(0, 3));
        setTours(toursRes.data.slice(0, 3));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching home data:", error);
        setLoading(false);
      }
    };
    fetchData();

    // 👇 Background Slider Timer Logic (Change every 10s)
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000); 

    return () => clearInterval(intervalId);
  }, []);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/600x400?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;
    const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    return `http://localhost:5001${cleanPath}`;
  };

  // Skeleton Loader Component
  const CardSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-56 bg-gray-200"></div>
      <div className="p-5 space-y-3">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      
      {/* 1. HERO SECTION (Mobile Optimized) */}
      <div className="relative min-h-[600px] lg:h-[700px] flex items-center justify-center px-4 overflow-hidden">
        
        {/* Background Image Slider */}
        <div className="absolute inset-0">
          {heroImages.map((imgUrl, index) => (
            <img 
              key={index}
              src={imgUrl} 
              alt={`Slide ${index}`} 
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-in-out ${
                index === currentImageIndex ? 'opacity-100 z-0' : 'opacity-0 -z-10'
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-gray-900/90 z-10"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-4xl w-full text-center text-white space-y-6 animate-fade-in-up px-2 md:px-0">
          <span className="uppercase tracking-widest text-xs md:text-sm font-semibold bg-white/20 px-4 py-1 rounded-full backdrop-blur-md border border-white/30">
            Welcome to Paradise
          </span>
          
          {/* Responsive Font Sizes */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight drop-shadow-2xl leading-tight">
            Discover the Soul of <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              Sri Lanka
            </span>
          </h1>
          
          <p className="text-base md:text-xl text-gray-200 max-w-2xl mx-auto font-light leading-relaxed">
            Your journey begins here. Explore top-rated hotels, immersive tours, and seamless travel experiences.
          </p>

          {/* Quick Action Search Bar - Stacks on Mobile */}
          <div className="mt-8 bg-white/10 backdrop-blur-md p-3 rounded-2xl md:rounded-full border border-white/20 max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              placeholder="Where do you want to go?" 
              className="w-full bg-transparent text-white placeholder-gray-300 px-4 md:px-6 py-3 outline-none text-center sm:text-left"
            />
            <Link to="/hotels" className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-8 py-3 rounded-xl md:rounded-full font-bold transition shadow-lg flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              Search
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-20 space-y-20 md:space-y-24">
        
        {/* 2. HOTELS SECTION */}
        <section>
          {/* Header stacks centered on mobile, spreads on desktop */}
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 gap-4 text-center md:text-left">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Luxury Stays 🏨</h2>
              <p className="text-gray-500 mt-2 text-base md:text-lg">Handpicked hotels for your perfect vacation.</p>
            </div>
            <Link to="/hotels" className="group flex items-center gap-2 text-blue-600 font-semibold transition hover:text-blue-800">
              View All Hotels 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {loading ? (
              <> <CardSkeleton /> <CardSkeleton /> <CardSkeleton /> </>
            ) : (
              hotels.map((hotel) => (
                <div key={hotel._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                  <div className="h-56 md:h-64 overflow-hidden relative">
                    <img 
                      src={getImageUrl(hotel.image)} 
                      alt={hotel.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700" 
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      ⭐ 4.8 Rating
                    </div>
                  </div>
                  <div className="p-5 md:p-6">
                    <h3 className="font-bold text-xl md:text-2xl text-gray-900 mb-2 truncate">{hotel.name}</h3>
                    <p className="text-gray-500 text-sm mb-4 flex items-center gap-1">
                      <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                      {hotel.location}
                    </p>
                    <div className="flex justify-between items-center mt-6">
                      <div>
                        <span className="text-gray-400 text-xs uppercase font-semibold">Price per night</span>
                        <p className="text-blue-600 text-lg md:text-xl font-bold">LKR {hotel.pricePerNight.toLocaleString()}</p>
                      </div>
                      <Link to={`/hotels/${hotel._id}`} className="bg-gray-900 text-white px-4 md:px-5 py-2 md:py-2.5 rounded-lg font-medium hover:bg-blue-600 transition shadow-md text-sm md:text-base">
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* 3. TOURS SECTION */}
        <section>
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 gap-4 text-center md:text-left">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Trending Adventures 🚐</h2>
              <p className="text-gray-500 mt-2 text-base md:text-lg">Curated experiences you'll never forget.</p>
            </div>
            <Link to="/tours" className="group flex items-center gap-2 text-green-600 font-semibold transition hover:text-green-800">
              Explore All Tours 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {loading ? (
              <> <CardSkeleton /> <CardSkeleton /> <CardSkeleton /> </>
            ) : (
              tours.map((tour) => (
                <div key={tour._id} className="relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                  <div className="h-64 md:h-72 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                    <img 
                      src={getImageUrl(tour.image)} 
                      alt={tour.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
                    />
                    <div className="absolute bottom-4 left-4 z-20 text-white pr-4">
                      <span className="bg-green-500 text-xs font-bold px-2 py-1 rounded mb-2 inline-block">
                        {tour.duration}
                      </span>
                      <h3 className="font-bold text-xl md:text-2xl leading-tight">{tour.name}</h3>
                      <p className="text-gray-300 text-sm flex items-center gap-1 mt-1 truncate">
                        📍 {tour.destinations}
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4 md:p-5 flex justify-between items-center bg-gray-50">
                     <p className="text-gray-700 font-bold text-lg">
                       LKR {tour.price.toLocaleString()} <span className="text-xs text-gray-400 font-normal">/ person</span>
                     </p>
                     <Link to={`/tours/${tour._id}`} className="text-green-600 font-bold hover:text-green-700 transition flex items-center gap-1 text-sm">
                       View Package <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                     </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </div>

      {/* 4. TRUST BADGES (Responsive Grid) */}
      <div className="bg-white py-10 md:py-12 border-t border-gray-100">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-4 text-center">
            {[
              { label: "Verified Hotels", icon: "🏨" },
              { label: "Secure Booking", icon: "🔒" },
              { label: "24/7 Support", icon: "🎧" },
              { label: "Best Price Guarantee", icon: "🏷️" },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3">
                <span className="text-3xl md:text-4xl bg-gray-50 p-3 md:p-4 rounded-full">{item.icon}</span>
                <span className="font-bold text-gray-700 text-sm md:text-base">{item.label}</span>
              </div>
            ))}
        </div>
      </div>

    </div>
  );
};

export default Home;