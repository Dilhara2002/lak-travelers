import { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Data ගන්න Function එක
  const fetchBookings = async () => {
    try {
      const { data } = await API.get('/bookings/mybookings');
      setBookings(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // 2. 👇 ඔයාගේ පරණ Cancel Function එකමයි (පොඩ්ඩක්වත් වෙනස් නෑ)
  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this booking? ❌")) {
      try {
        await API.delete(`/bookings/${id}`);
        alert("Booking Cancelled Successfully! 🗑️");
        // List එක update කරන්න (Server එකට ආයේ request නොකර filter කරනවා - Faster UX)
        setBookings(bookings.filter((b) => b._id !== id));
      } catch (error) {
        console.error(error);
        alert("Failed to cancel booking");
      }
    }
  };

  // Image URL Helper
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/300";
    if (imagePath.startsWith("http")) return imagePath;
    const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    return `http://localhost:5001${cleanPath}`;
  };

  if (loading) return <div className="text-center mt-20 text-lg">Loading your bookings... ⏳</div>;

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Bookings 📅</h1>
      
      {bookings.length === 0 ? (
        <div className="bg-white p-10 rounded-lg shadow-md text-center border border-gray-200">
          <h2 className="text-xl text-gray-600 mb-4">You haven't booked anything yet. 😕</h2>
          <div className="flex justify-center gap-4">
            <Link to="/hotels" className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">Browse Hotels 🏨</Link>
            <Link to="/tours" className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition">Browse Tours 🚐</Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bookings.map((booking) => {
            
            // 👇 Hotel ද Tour ද කියලා තෝරාගැනීම
            const isTour = booking.bookingType === 'tour';
            const item = isTour ? booking.tour : booking.hotel;
            
            // Booking එක තිබුනට අදාල Hotel/Tour එක Delete කරලා නම්
            if (!item) return null;

            return (
              <div key={booking._id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 flex flex-col hover:shadow-xl transition-shadow duration-300">
                
                {/* Image Section */}
                <div className="relative h-48">
                  <img 
                    src={getImageUrl(item.image)} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                  {/* Badge */}
                  <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-lg text-white text-xs font-bold uppercase tracking-wider ${isTour ? 'bg-green-600' : 'bg-blue-600'}`}>
                    {isTour ? 'Tour Package' : 'Hotel Stay'}
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-5 flex-grow">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 truncate">{item.name}</h3>
                  
                  {isTour ? (
                    // 👉 Tour Details
                    <div className="text-sm text-gray-600 space-y-2">
                      <p className="flex items-center gap-2">📍 <span className="truncate">{item.destinations || item.location}</span></p>
                      <p>📅 <span className="font-semibold">Date:</span> {booking.tourDate}</p>
                      <p>👥 <span className="font-semibold">People:</span> {booking.peopleCount}</p>
                      <p>⏳ <span className="font-semibold">Duration:</span> {item.duration}</p>
                    </div>
                  ) : (
                    // 👉 Hotel Details
                    <div className="text-sm text-gray-600 space-y-2">
                      <p>📍 {item.location}</p>
                      <p>📥 <span className="font-semibold">Check-in:</span> {booking.checkInDate}</p>
                      <p>📤 <span className="font-semibold">Check-out:</span> {booking.checkOutDate}</p>
                    </div>
                  )}
                </div>

                {/* Footer with Cancel Button */}
                <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between items-center">
                   <span className="text-green-600 text-sm font-bold bg-green-100 px-2 py-1 rounded">Confirmed ✅</span>
                   
                   {/* 👇 Cancel Button */}
                   <button 
                      onClick={() => handleCancel(booking._id)}
                      className="bg-red-100 text-red-600 py-1.5 px-4 rounded-lg hover:bg-red-200 text-sm font-bold border border-red-200 transition-colors"
                    >
                       ❌
                   </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookings;