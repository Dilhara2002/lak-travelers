import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

const HotelDetails = () => {
  const { id } = useParams(); // URL එකෙන් ID එක ගන්නවා
  const navigate = useNavigate();
  
  const [hotel, setHotel] = useState(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  // 1. හෝටලයේ විස්තර Backend එකෙන් ගන්නවා (අපි මේ Route එක කලින් හැදුවේ නෑ, ඒත් ID එකෙන් ගන්න පුළුවන්)
  // පොඩි වැඩක්: අපි Backend එකේ ID එකෙන් ගන්න Route එකක් හැදුවේ නෑනේ? 
  // කමක් නෑ, අපි දැනට තියෙන List එකෙන් Filter කරගමු හෝ අලුත් Route එකක් හදමු.
  // ලේසිම විදිය: අපි පොඩි වෙනසක් කරමු Backend එකේ ඊළඟ පියවරේදී. 
  // දැනට අපි Frontend එක ලියලා ඉමු.

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        // Backend එකේ අපි තවම Single Hotel Route එක ගැහුවේ නෑ.
        // ඒ නිසා අපි දැනට ඔක්කොම අරගෙන මෙතනදි පෙරාගමු (Temporary Fix)
        const { data } = await API.get('/hotels');
        const foundHotel = data.find((h) => h._id === id);
        setHotel(foundHotel);
      } catch (error) {
        console.error(error);
      }
    };
    fetchHotel();
  }, [id]);

  // Image URL Helper
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/300";
    if (imagePath.startsWith("http")) return imagePath;
    const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    return `http://localhost:5001${cleanPath}`;
  };

  // Booking Submit Function
  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      await API.post('/bookings', {
        hotelId: id,
        checkInDate: checkIn,
        checkOutDate: checkOut
      });
      alert("Booking Successful! 🎉");
      navigate('/'); // ගෙදර යන්න
    } catch (error) {
      console.error(error);
      alert("Booking Failed! Please Login first.");
      navigate('/login');
    }
  };

  if (!hotel) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
        
        {/* Left: Image */}
        <div className="md:w-1/2">
          <img 
            src={getImageUrl(hotel.image)} 
            alt={hotel.name} 
            className="w-full h-96 object-cover"
          />
        </div>

        {/* Right: Details & Booking Form */}
        <div className="md:w-1/2 p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{hotel.name}</h1>
          <p className="text-gray-500 mb-4">📍 {hotel.location}</p>
          <p className="text-gray-700 mb-6">{hotel.description}</p>
          <p className="text-blue-600 text-2xl font-bold mb-8">LKR {hotel.pricePerNight} <span className="text-sm text-gray-400">/ night</span></p>

          {/* Booking Form */}
          <form onSubmit={handleBooking} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-bold mb-4">Book Your Stay 📅</h3>
            
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">Check-in Date</label>
              <input 
                type="date" 
                className="w-full p-2 border rounded"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm text-gray-600 mb-1">Check-out Date</label>
              <input 
                type="date" 
                className="w-full p-2 border rounded"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 transition">
              Confirm Booking
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;