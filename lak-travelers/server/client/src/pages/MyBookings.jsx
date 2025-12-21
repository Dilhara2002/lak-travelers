import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api'; 

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/bookings/mybookings');
      
      // දත්ත ලැබෙන ආකාරය Console එකේ පරීක්ෂා කරන්න
      console.log("Response Data:", data);
      
      setBookings(data);
    } catch (error) {
      console.error("Fetch error:", error);
      if (error.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []); 

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this reservation?")) {
      try {
        await API.put(`/bookings/${id}/cancel`);
        fetchMyBookings();
        alert("Booking cancelled successfully!");
      } catch (error) {
        alert(error.response?.data?.message || "Action failed");
      }
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/400x300?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;
    const backendURL = "http://localhost:5001";
    return `${backendURL}${imagePath.startsWith("/") ? imagePath : `/${imagePath}`}`;
  };

  if (loading) return (
    <div className="min-h-screen flex justify-center items-center bg-slate-50">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-slate-900"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 mt-12">
      <div className="max-w-7xl mx-auto">
        
        <header className="mb-8 border-b pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Reservations 🎒</h1>
            <p className="text-slate-500 mt-1">Track and manage your upcoming trips in Sri Lanka.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 font-bold text-blue-600 shadow-sm">
            Total: {bookings.length}
          </div>
        </header>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-xl mx-auto mt-10">
            <p className="text-gray-400 font-bold mb-4">No active bookings found.</p>
            <Link to="/" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold inline-block hover:bg-blue-700 transition shadow-lg">
              Explore Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bookings.map((booking) => {
              // 🛡️ ආරක්ෂිතව දත්ත ලබා ගැනීම (Populated Item)
              const item = booking.hotel || booking.tour || booking.vehicle;
              
              // Status formatting
              const statusKey = booking.status ? booking.status.toLowerCase() : 'pending';
              const statusStyles = {
                confirmed: "bg-emerald-500 text-white",
                pending: "bg-amber-500 text-white",
                cancelled: "bg-rose-500 text-white",
                rejected: "bg-slate-400 text-white"
              };

              // ⚠️ පවතින දත්තවල item එක නැතිනම් (Console එකේ තිබූ ගැටලුව)
              if (!item) {
                return (
                  <div key={booking._id} className="bg-white rounded-3xl p-6 border border-dashed border-slate-300 flex flex-col items-center justify-center text-center">
                    <span className="text-4xl mb-3">⚠️</span>
                    <h3 className="font-bold text-slate-800">Incomplete Booking</h3>
                    <p className="text-xs text-slate-400 mt-1">Ref ID: {booking._id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-rose-500 mt-2">මෙම බුකින් එකේ විස්තර නිවැරදිව සේව් වී නැත. අලුතින් බුකින් එකක් සිදුකර පරීක්ෂා කරන්න.</p>
                    <div className="mt-4 text-left w-full space-y-1 bg-slate-50 p-3 rounded-lg">
                        <p className="text-[10px] text-slate-500"><b>Price:</b> Rs.{booking.totalPrice?.toLocaleString()}</p>
                        <p className="text-[10px] text-slate-500"><b>Date:</b> {booking.checkInDate || booking.tourDate || booking.pickupDate || 'N/A'}</p>
                    </div>
                  </div>
                );
              }

              // item එක තිබේ නම් සාමාන්‍ය පරිදි පෙන්වීම
              const title = item.name || item.vehicleModel || "Booking Item";
              const imageSrc = Array.isArray(item.images) ? item.images[0] : (item.image || item.images);

              return (
                <div key={booking._id} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full group">
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img 
                      src={getImageUrl(imageSrc)} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      alt={title} 
                    />
                    
                    <div className={`absolute top-4 left-4 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm border border-white/20 ${statusStyles[statusKey] || 'bg-gray-500'}`}>
                      {statusKey}
                    </div>
                  </div>

                  <div className="p-6 flex-grow">
                    <h3 className="text-lg font-black text-slate-900 mb-4 truncate">{title}</h3>
                    
                    <div className="space-y-2 text-xs font-bold text-slate-500">
                      <p className="flex justify-between border-b border-slate-50 pb-2">
                        <span>Total Price:</span>
                        <span className="text-slate-900">Rs.{booking.totalPrice?.toLocaleString()}</span>
                      </p>
                      
                      {booking.hotel && <p className="flex justify-between"><span>Check-in:</span> <span className="text-slate-700">{booking.checkInDate}</span></p>}
                      {booking.tour && <p className="flex justify-between"><span>Date:</span> <span className="text-slate-700">{booking.tourDate}</span></p>}
                      {booking.vehicle && <p className="flex justify-between"><span>Pickup:</span> <span className="text-slate-700">{booking.pickupDate}</span></p>}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      REF: {booking._id.slice(-6).toUpperCase()}
                    </span>
                    
                    {statusKey === 'pending' && (
                      <button 
                        onClick={() => handleCancel(booking._id)} 
                        className="text-rose-600 hover:bg-rose-100 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase"
                      >
                        Cancel
                      </button>
                    )}
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