import { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data
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

  // 2. Cancel Logic
  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this booking? ❌")) {
      try {
        await API.delete(`/bookings/${id}`);
        // Optimistic UI Update (Remove from list immediately)
        setBookings(bookings.filter((b) => b._id !== id));
      } catch (error) {
        console.error(error);
        alert("Failed to cancel booking");
      }
    }
  };

  // Image URL Helper
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/400x300?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;
    const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    return `http://localhost:5001${cleanPath}`;
  };

  // Loading State
  if (loading) return (
    <div className="min-h-screen flex justify-center items-center bg-slate-50">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-slate-900"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Bookings</h1>
            <p className="text-slate-500 mt-1">Manage your upcoming trips and rentals.</p>
          </div>
          <div className="text-sm font-medium text-slate-500 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm mt-4 md:mt-0">
            Total Bookings: <span className="text-slate-900 font-bold">{bookings.length}</span>
          </div>
        </div>
      
        {bookings.length === 0 ? (
          // Empty State
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center max-w-2xl mx-auto mt-10">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
              📅
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No bookings found</h2>
            <p className="text-slate-500 mb-8">You haven't made any reservations yet. Start planning your next adventure!</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/hotels" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition shadow-md">Find Hotels 🏨</Link>
              <Link to="/tours" className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition shadow-md">Explore Tours 🚐</Link>
              <Link to="/vehicles" className="px-6 py-3 bg-amber-500 text-white rounded-lg font-bold hover:bg-amber-600 transition shadow-md">Rent Vehicles 🚗</Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bookings.map((booking) => {
              
              // 👇 Logic to determine booking type and get correct item data
              let item = null;
              let typeLabel = "";
              let badgeColor = "";
              let bookingDetails = null;

              if (booking.bookingType === 'hotel' && booking.hotel) {
                item = booking.hotel;
                typeLabel = "Hotel Stay";
                badgeColor = "bg-blue-600";
                bookingDetails = (
                  <>
                    <p className="flex justify-between"><span className="text-slate-400">Check-in:</span> <span className="font-medium text-slate-700">{booking.checkInDate}</span></p>
                    <p className="flex justify-between"><span className="text-slate-400">Check-out:</span> <span className="font-medium text-slate-700">{booking.checkOutDate}</span></p>
                  </>
                );
              } else if (booking.bookingType === 'tour' && booking.tour) {
                item = booking.tour;
                typeLabel = "Tour Package";
                badgeColor = "bg-emerald-600";
                bookingDetails = (
                  <>
                    <p className="flex justify-between"><span className="text-slate-400">Date:</span> <span className="font-medium text-slate-700">{booking.tourDate}</span></p>
                    <p className="flex justify-between"><span className="text-slate-400">Travelers:</span> <span className="font-medium text-slate-700">{booking.peopleCount} People</span></p>
                  </>
                );
              } else if (booking.bookingType === 'vehicle' && booking.vehicle) {
                item = booking.vehicle;
                typeLabel = "Vehicle Rental";
                badgeColor = "bg-amber-500";
                bookingDetails = (
                  <>
                    <p className="flex justify-between"><span className="text-slate-400">Pickup Date:</span> <span className="font-medium text-slate-700">{booking.pickupDate}</span></p>
                    <p className="flex justify-between"><span className="text-slate-400">Location:</span> <span className="font-medium text-slate-700 truncate ml-2">{booking.pickupLocation}</span></p>
                  </>
                );
              }

              // If the related item was deleted from DB, skip rendering
              if (!item) return null;

              // Determine image source (array for vehicle, string for others)
              const imageSrc = Array.isArray(item.images) && item.images.length > 0 
                ? item.images[0] 
                : item.image;

              return (
                <div key={booking._id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full group">
                  
                  {/* Image Header */}
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img 
                      src={getImageUrl(imageSrc)} 
                      alt={item.name || item.vehicleModel} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Status Badge */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-green-600 shadow-sm flex items-center gap-1">
                      <span>✅</span> Confirmed
                    </div>
                    {/* Type Badge */}
                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wider shadow-sm ${badgeColor}`}>
                      {typeLabel}
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="p-6 flex-grow">
                    <h3 className="text-lg font-bold text-slate-900 mb-1 truncate">
                      {item.name || item.vehicleModel}
                    </h3>
                    
                    <div className="flex items-center text-slate-500 text-xs mb-4">
                      <span className="mr-1">📍</span>
                      <span className="truncate">{item.location || item.destinations || "Sri Lanka"}</span>
                    </div>

                    <div className="space-y-2 text-sm border-t border-slate-100 pt-4">
                      {bookingDetails}
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                       ID: <span className="font-mono font-normal">{booking._id.slice(-6)}</span>
                     </span>
                     
                     <button 
                        onClick={() => handleCancel(booking._id)}
                        className="text-red-600 hover:text-red-700 text-sm font-bold flex items-center gap-1 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                      >
                         Cancel <span className="text-lg leading-none">×</span>
                     </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;