import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [hotel, setHotel] = useState(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [loading, setLoading] = useState(true);

  // Review සදහා අලුත් State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  
  // User Login වී ඇත්දැයි බැලීමට (localStorage පරීක්ෂා කිරීම)
  const userInfo = localStorage.getItem('userInfo');

  // හෝටලය Load කරන Function එක (වෙනමම ගත්තා, මොකද Review එකක් දැම්මම ආයේ Load කරන්න ඕනේ)
  const fetchHotel = async () => {
    try {
      const { data } = await API.get(`/hotels/${id}`);
      setHotel(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotel();
  }, [id]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/300";
    if (imagePath.startsWith("http")) return imagePath;
    const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    return `http://localhost:5001${cleanPath}`;
  };

  // Booking Submit
  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      await API.post('/bookings', { hotelId: id, checkInDate: checkIn, checkOutDate: checkOut });
      alert("Booking Successful! 🎉");
      navigate('/my-bookings');
    } catch (error) {
      console.error(error);
      alert("Booking Failed! Please Login first.");
      navigate('/login');
    }
  };

  // Delete Hotel
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to DELETE this hotel? ⚠️")) {
      try {
        await API.delete(`/hotels/${id}`);
        alert("Hotel Deleted! 🗑️");
        navigate('/');
      } catch (error) {
        alert("Failed to delete hotel");
      }
    }
  };

  // 👇 REVIEW SUBMIT FUNCTION (අලුත් කොටස)
  const submitReviewHandler = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/hotels/${id}/reviews`, {
        rating,
        comment,
      });
      alert('Review Submitted! ⭐');
      setComment('');
      setRating(5);
      fetchHotel(); // හෝටලය ආයේ Load කරනවා (අලුත් Review එක පේන්න)
    } catch (error) {
      alert(error.response?.data?.message || "Review Failed");
    }
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!hotel) return <div className="text-center mt-20">Hotel not found 😕</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row mb-10">
        
        {/* Left: Image */}
        <div className="md:w-1/2 relative">
          <img 
            src={getImageUrl(hotel.image)} 
            alt={hotel.name} 
            className="w-full h-full object-cover min-h-[400px]"
          />
        </div>

        {/* Right: Details & Booking */}
        <div className="md:w-1/2 p-8">
          <div className="flex justify-between items-start">
             <h1 className="text-3xl font-bold text-gray-800 mb-2">{hotel.name}</h1>
             <div className="flex gap-2">
               <button onClick={() => navigate(`/edit-hotel/${hotel._id}`)} className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded text-sm font-bold border border-yellow-200">Edit ✏️</button>
               <button onClick={handleDelete} className="bg-red-100 text-red-600 px-3 py-1 rounded text-sm font-bold border border-red-200">Delete 🗑️</button>
             </div>
          </div>

          {/* Rating Display */}
          <div className="flex items-center mb-4 text-yellow-500 font-bold text-lg">
             ⭐ {hotel.rating.toFixed(1)} <span className="text-gray-400 text-sm ml-2">({hotel.numReviews} Reviews)</span>
          </div>

          <p className="text-gray-500 mb-4">📍 {hotel.location}</p>
          <p className="text-gray-700 mb-6">{hotel.description}</p>
          <p className="text-blue-600 text-2xl font-bold mb-8">LKR {hotel.pricePerNight} <span className="text-sm text-gray-400">/ night</span></p>

          <form onSubmit={handleBooking} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-bold mb-4">Book Your Stay 📅</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Check-in</label>
                <input type="date" className="w-full p-2 border rounded" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Check-out</label>
                <input type="date" className="w-full p-2 border rounded" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required />
              </div>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 transition">
              Confirm Booking
            </button>
          </form>
        </div>
      </div>

      {/* 👇 REVIEWS SECTION (අලුත් කොටස) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
        
        {/* 1. තියෙන Reviews පෙන්වීම */}
        <div>
          <h2 className="text-2xl font-bold mb-5">Reviews 💬</h2>
          {hotel.reviews.length === 0 && <div className="bg-blue-50 p-4 rounded text-blue-700">No reviews yet. Be the first!</div>}
          
          <div className="space-y-4">
            {hotel.reviews.map((review) => (
              <div key={review._id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between mb-2">
                  <strong className="text-gray-800">{review.name}</strong>
                  <span className="text-yellow-500 font-bold">{review.rating} ⭐</span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. අලුත් Review එකක් ලිවීම */}
        <div>
          <h2 className="text-2xl font-bold mb-5">Write a Review ✍️</h2>
          
          {userInfo ? (
            <form onSubmit={submitReviewHandler} className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Rating</label>
                <select 
                  className="w-full p-3 border rounded bg-gray-50"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value="1">1 - Poor 😞</option>
                  <option value="2">2 - Fair 😐</option>
                  <option value="3">3 - Good 🙂</option>
                  <option value="4">4 - Very Good 😄</option>
                  <option value="5">5 - Excellent 😍</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Comment</label>
                <textarea 
                  rows="3"
                  className="w-full p-3 border rounded bg-gray-50"
                  placeholder="Share your experience..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                ></textarea>
              </div>

              <button type="submit" className="w-full bg-black text-white py-3 rounded font-bold hover:bg-gray-800 transition">
                Submit Review
              </button>
            </form>
          ) : (
            <div className="bg-yellow-100 p-4 rounded text-yellow-800 border border-yellow-200">
              Please <a href="/login" className="font-bold underline">Login</a> to write a review.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default HotelDetails;