import React from 'react';
import { Link } from 'react-router-dom';

const HotelCard = ({ hotel }) => {
  
  // 👇 පින්තූරයේ URL එක හරියට හදාගන්න විශේෂ ෆන්ක්ෂන් එක
  const getImageUrl = (imagePath) => {
    // 1. පින්තූරයක් නැත්නම් හෝ හිස් නම් Default එකක් පෙන්නන්න
    if (!imagePath) return "https://via.placeholder.com/300?text=No+Image";

    // 2. පින්තූරය අන්තර්ජාලයෙන් ගත් එකක් නම් (http වලින් පටන් ගනී නම්) කෙලින්ම පෙන්නන්න
    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    // 3. අපේ Server එකට Upload කළ එකක් නම්, Backend URL එක එකතු කරන්න
    // සමහර විට path එකේ මුලට '/' තියෙන්නත් පුළුවන්, නැති වෙන්නත් පුළුවන්.
    const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    
    // Backend එක දුවන්නේ Port 5001 වල
    return `http://localhost:5001${cleanPath}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img 
          src={getImageUrl(hotel.image)} 
          alt={hotel.name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          onError={(e) => {
            // පින්තූරය ලෝඩ් වුනේ නැත්නම් (Broken Link), මේ Default පින්තූරය දාන්න
            e.target.onerror = null; // Infinite loop නවත්වන්න
            e.target.src = "https://via.placeholder.com/300?text=Image+Not+Found";
          }}
        />
        <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 rounded-bl-lg font-bold text-sm">
           ★ 4.5
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-800 truncate">{hotel.name}</h3>
        </div>
        
        <p className="text-gray-500 text-sm flex items-center mb-3">
          📍 <span className="ml-1 truncate">{hotel.location}</span>
        </p>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-4 h-10">
          {hotel.description}
        </p>
        
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div>
            <span className="text-xs text-gray-400">Price per night</span>
            <p className="text-blue-600 font-bold text-lg">LKR {hotel.pricePerNight}</p>
          </div>
          
          <Link 
            to={`/hotels/${hotel._id}`} 
            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 text-sm font-medium transition-colors shadow-lg shadow-blue-500/30"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;