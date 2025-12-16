import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import axios from 'axios';

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [hotel, setHotel] = useState(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [loading, setLoading] = useState(true);

  // Review State
  const [rating, setRating] = useState(0); // Default 0 to force user to pick
  const [hoverRating, setHoverRating] = useState(0); // For hover effect
  const [comment, setComment] = useState('');
  const [reviewImage, setReviewImage] = useState(''); 
  const [uploading, setUploading] = useState(false); 
  
  const user = JSON.parse(localStorage.getItem('userInfo'));

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
    if (!imagePath) return "https://via.placeholder.com/800x400";
    if (imagePath.startsWith("http")) return imagePath;
    const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    return `http://localhost:5001${cleanPath}`;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      await API.post('/bookings', { 
        bookingType: 'hotel', 
        hotelId: id, 
        checkInDate: checkIn, 
        checkOutDate: checkOut 
      });
      alert("Booking Successful! 🎉");
      navigate('/my-bookings');
    } catch (error) {
      console.error(error);
      alert("Booking Failed! Please Login first.");
      navigate('/login');
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to DELETE this hotel? ⚠️")) {
      try {
        await API.delete(`/hotels/${id}`);
        alert("Hotel Deleted! 🗑️");
        navigate('/hotels');
      } catch (error) {
        alert("Failed to delete hotel");
      }
    }
  };

  const handleReviewImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const { data } = await axios.post('http://localhost:5001/api/upload', formData, config);
      setReviewImage(data);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
      alert('Image upload failed');
    }
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a star rating! ⭐");
      return;
    }
    try {
      await API.post(`/hotels/${id}/reviews`, { rating, comment, image: reviewImage });
      alert('Review Submitted! ⭐');
      setComment('');
      setRating(0); // Reset rating
      setReviewImage(''); 
      fetchHotel(); 
    } catch (error) {
      alert(error.response?.data?.message || "Review Failed");
    }
  };

  // Helper for Rating Labels
  const getRatingLabel = (r) => {
    switch (r) {
      case 5: return "Excellent 😍";
      case 4: return "Very Good 😄";
      case 3: return "Good 🙂";
      case 2: return "Fair 😐";
      case 1: return "Poor 😞";
      default: return "Select your rating";
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div></div>;
  if (!hotel) return <div className="text-center mt-20 text-xl font-bold text-gray-600">Hotel not found 😕</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      
      {/* 1. HERO IMAGE BANNER */}
      <div className="relative h-[400px] md:h-[500px]">
        <img 
          src={getImageUrl(hotel.image)} 
          alt={hotel.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 md:p-12 text-white max-w-5xl mx-auto w-full">
           <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-shadow-lg">{hotel.name}</h1>
           <div className="flex items-center gap-4 text-lg">
             <span className="bg-white/20 backdrop-blur px-3 py-1 rounded text-sm font-bold border border-white/30">⭐ {hotel.rating ? hotel.rating.toFixed(1) : "New"}</span>
             <span className="flex items-center gap-1 opacity-90">📍 {hotel.location}</span>
           </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 -mt-8 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. MAIN CONTENT (Left Side) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* About Section */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">About this place</h2>
              {user && (user.role === 'admin' || (hotel.user && user._id === hotel.user.toString())) && (
                <div className="flex gap-3">
                  <button onClick={() => navigate(`/edit-hotel/${hotel._id}`)} className="text-blue-600 font-bold hover:underline">Edit</button>
                  <button onClick={handleDelete} className="text-red-500 font-bold hover:underline">Delete</button>
                </div>
              )}
            </div>
            <p className="text-gray-600 leading-relaxed text-lg">{hotel.description}</p>
          </div>

          {/* Map Section */}
          {hotel.mapUrl && (
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Location 📍</h3>
              <div className="w-full h-80 rounded-xl overflow-hidden bg-gray-100">
                <iframe src={hotel.mapUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy"></iframe>
              </div>
            </div>
          )}

          {/* REVIEWS SECTION */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
               <div className="text-center">
                 <div className="text-5xl font-extrabold text-gray-900">{hotel.rating ? hotel.rating.toFixed(1) : "0.0"}</div>
                 <div className="text-yellow-500 text-lg">⭐⭐⭐⭐⭐</div>
               </div>
               <div className="h-12 w-px bg-gray-200"></div>
               <div>
                 <h2 className="text-2xl font-bold text-gray-900">Guest Reviews</h2>
                 <p className="text-gray-500">{hotel.numReviews} verified ratings</p>
               </div>
            </div>
            
            {/* Reviews Grid */}
            {hotel.reviews.length === 0 ? (
               <div className="text-center py-10">
                 <p className="text-gray-400 italic">No reviews yet.</p>
               </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                {hotel.reviews.map((review) => (
                  <div key={review._id} className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                       <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-lg border border-gray-200">
                         {review.name.charAt(0).toUpperCase()}
                       </div>
                       <div>
                         <p className="font-bold text-gray-900 leading-tight">{review.name}</p>
                         <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                       </div>
                    </div>
                    <div>
                       <div className="flex text-yellow-400 text-xs mb-1">
                         {[...Array(5)].map((_, i) => (
                           <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                         ))}
                       </div>
                       <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                    </div>
                    {review.image && (
                      <img src={getImageUrl(review.image)} alt="Review" className="h-20 w-20 object-cover rounded-lg border border-gray-200" />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* WRITE REVIEW FORM */}
            <div className="mt-12 bg-gray-50 p-6 rounded-2xl border border-gray-200">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                Write a Review ✍️
              </h3>
              
              {user ? (
                <form onSubmit={submitReviewHandler} className="space-y-6">
                  
                  {/* ⭐ NEW: Star Rating Selector */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Your Rating: <span className="text-blue-600 ml-2 font-normal text-xs uppercase tracking-wide">{getRatingLabel(hoverRating || rating)}</span>
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button" // Prevent form submit
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="currentColor" 
                            className={`w-8 h-8 transition-colors duration-200 ${
                              star <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          >
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment & Image */}
                  <div className="space-y-4">
                     <div>
                       <label className="block text-sm font-bold text-gray-700 mb-2">Share your thoughts</label>
                       <textarea rows="3" className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 resize-none transition-shadow shadow-sm focus:shadow-md" placeholder="How was your stay? What did you like?" value={comment} onChange={(e) => setComment(e.target.value)} required></textarea>
                     </div>
                     
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Add a Photo (Optional)</label>
                        <input type="file" onChange={handleReviewImageUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-white file:text-blue-700 hover:file:bg-blue-50 border border-gray-200 rounded-xl bg-white cursor-pointer"/>
                     </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button type="submit" disabled={uploading} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                      {uploading ? 'Uploading...' : 'Post Review'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-sm text-gray-500 bg-white p-4 rounded-xl border border-dashed border-gray-300 text-center">
                  Please <a href="/login" className="text-blue-600 font-bold hover:underline">log in</a> to leave a review.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. SIDEBAR (Booking) - Kept same as before */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 sticky top-28">
            <div className="flex justify-between items-end mb-6">
              <div>
                <span className="text-gray-500 text-sm line-through block">Rs {Math.round(hotel.pricePerNight * 1.2)}</span>
                <span className="text-3xl font-extrabold text-gray-900">Rs {hotel.pricePerNight.toLocaleString()}</span>
                <span className="text-gray-500 font-medium"> / night</span>
              </div>
            </div>

            <form onSubmit={handleBooking} className="space-y-4">
              <div className="border border-gray-300 rounded-xl overflow-hidden">
                <div className="flex border-b border-gray-300">
                  <div className="w-1/2 p-3 border-r border-gray-300 bg-gray-50">
                    <label className="block text-xs font-bold text-gray-500 uppercase">Check-In</label>
                    <input type="date" className="w-full bg-transparent outline-none text-gray-700 text-sm mt-1" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required />
                  </div>
                  <div className="w-1/2 p-3 bg-gray-50">
                    <label className="block text-xs font-bold text-gray-500 uppercase">Check-Out</label>
                    <input type="date" className="w-full bg-transparent outline-none text-gray-700 text-sm mt-1" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required />
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition transform active:scale-95">
                Reserve Now
              </button>
              
              <p className="text-center text-xs text-gray-400 mt-2">You won't be charged yet</p>
            </form>
            
            <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4 text-xs text-gray-500">
               <div className="flex items-center gap-2"><span className="text-green-500">✔</span> Free Cancellation</div>
               <div className="flex items-center gap-2"><span className="text-green-500">✔</span> Instant Confirmation</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HotelDetails;