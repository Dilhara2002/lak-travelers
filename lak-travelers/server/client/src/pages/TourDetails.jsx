import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';


const TourDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tourDate, setTourDate] = useState('');
const [peopleCount, setPeopleCount] = useState(1);

  // Tour Data Backend එකෙන් ගැනීම
  useEffect(() => {
    const fetchTour = async () => {
      try {
        const { data } = await API.get(`/tours/${id}`);
        setTour(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchTour();
  }, [id]);

  const handleBooking = async (e) => {
  e.preventDefault();
  try {
    await API.post('/bookings', {
      bookingType: 'tour',
      tourId: id,
      tourDate,
      peopleCount
    });
    alert("Tour Booked Successfully! 🚐🎉");
    navigate('/my-bookings');
  } catch (error) {
    console.error(error);
    alert("Booking Failed! Please Login first.");
    navigate('/login');
  }
};

  // Image Helper
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/300";
    if (imagePath.startsWith("http")) return imagePath;
    const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    return `http://localhost:5001${cleanPath}`;
  };

  if (loading) return <div className="text-center mt-20">Loading Tour Details... ⏳</div>;
  if (!tour) return <div className="text-center mt-20">Tour not found 😕</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* Top Image Banner */}
        <div className="relative h-96 w-full">
          <img 
            src={getImageUrl(tour.image)} 
            alt={tour.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
            <div className="p-8 text-white">
              <h1 className="text-4xl font-bold mb-2">{tour.name}</h1>
              <p className="text-xl opacity-90">📍 {tour.destinations}</p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col md:flex-row p-8 gap-8">
          
          {/* Left: Description */}
          <div className="md:w-2/3">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Overview</h2>
            <p className="text-gray-600 leading-relaxed text-lg mb-6">
              {tour.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <span className="block text-gray-500 text-sm">Duration</span>
                <span className="text-blue-700 font-bold text-lg">{tour.duration}</span>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <span className="block text-gray-500 text-sm">Max Group Size</span>
                <span className="text-green-700 font-bold text-lg">{tour.groupSize} People</span>
              </div>
            </div>
          </div>

          {/* Right: Booking Box */}
          {/* Right: Booking Box */}
<div className="md:w-1/3">
  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm sticky top-24">
    <p className="text-gray-500 mb-1">Price per person</p>
    <h3 className="text-3xl font-bold text-gray-900 mb-6">LKR {tour.price}</h3>

    <form onSubmit={handleBooking} className="space-y-4">

      {/* Date Picker */}
      <div>
        <label className="block text-gray-700 font-bold mb-1 text-sm">Select Date 📅</label>
        <input 
          type="date" 
          required
          className="w-full p-3 border rounded bg-white"
          value={tourDate}
          onChange={(e) => setTourDate(e.target.value)}
        />
      </div>

      {/* People Count */}
      <div>
        <label className="block text-gray-700 font-bold mb-1 text-sm">Number of People 👥</label>
        <input 
          type="number" 
          min="1"
          max={tour.groupSize}
          required
          className="w-full p-3 border rounded bg-white"
          value={peopleCount}
          onChange={(e) => setPeopleCount(e.target.value)}
        />
      </div>

      {/* Total Price Calculation (Optional Display) */}
      <div className="flex justify-between text-sm font-bold text-gray-600 pt-2">
        <span>Total:</span>
        <span>LKR {tour.price * peopleCount}</span>
      </div>

      <button 
        type="submit"
        className="w-full bg-black text-white py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition transform hover:-translate-y-1 shadow-lg"
      >
        Book This Tour 🚐
      </button>
    </form>

    <p className="text-xs text-gray-400 text-center mt-4">
      No credit card required for booking request.
    </p>
  </div>
</div>
        </div>
      </div>
    </div>
  );
};

export default TourDetails;