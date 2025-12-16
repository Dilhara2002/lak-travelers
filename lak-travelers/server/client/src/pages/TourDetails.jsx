import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import axios from 'axios';

const TourDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Booking State
  const [tourDate, setTourDate] = useState('');
  const [peopleCount, setPeopleCount] = useState(1);

  // Review State
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewImage, setReviewImage] = useState('');
  const [uploading, setUploading] = useState(false);

  const user = JSON.parse(localStorage.getItem('userInfo'));

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

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this tour package? ⚠️")) {
      try {
        await API.delete(`/tours/${id}`);
        alert("Tour Deleted! 🗑️");
        navigate('/tours');
      } catch (error) {
        alert("Failed to delete tour");
      }
    }
  };

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
      alert("Booking Failed! Please Login.");
      navigate('/login');
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
    if (rating === 0) return alert("Please select a star rating! ⭐");

    try {
      await API.post(`/tours/${id}/reviews`, { rating, comment, image: reviewImage });
      alert('Review Submitted! ⭐');
      setComment('');
      setRating(0);
      setReviewImage('');
      
      const { data } = await API.get(`/tours/${id}`);
      setTour(data);
    } catch (error) {
      alert(error.response?.data?.message || "Review Failed");
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/800x400?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;
    const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    return `http://localhost:5001${cleanPath}`;
  };

  // Helper for Rating Labels
  const getRatingLabel = (r) => {
    switch (r) {
      case 5: return "Excellent 😍";
      case 4: return "Very Good 😄";
      case 3: return "Good 🙂";
      case 2: return "Fair 😐";
      case 1: return "Poor 😞";
      default: return "Select rating";
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div></div>;
  if (!tour) return <div className="text-center mt-20 text-xl font-bold text-gray-600">Tour not found 😕</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-10">

      {/* 1. HERO BANNER */}
      <div className="relative h-[400px] md:h-[500px]">
        <img 
          src={getImageUrl(tour.image)} 
          alt={tour.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 p-6 md:p-12 text-white max-w-5xl mx-auto w-full">
           <div className="flex items-center gap-3 mb-2">
              <span className="bg-green-600 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                {tour.duration}
              </span>
              <span className="flex items-center gap-1 text-sm bg-black/40 px-2 py-1 rounded backdrop-blur-sm border border-white/20">
                📍 {tour.destinations}
              </span>
           </div>
           <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-shadow-lg">{tour.name}</h1>
           <div className="flex items-center gap-4 text-lg">
             <span className="text-yellow-400 font-bold text-xl">⭐ {tour.rating ? tour.rating.toFixed(1) : "New"}</span>
             <span className="opacity-80">| {tour.numReviews} Reviews</span>
           </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 -mt-8 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. MAIN CONTENT (Left) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* About Section */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Tour Overview</h2>
              {/* Admin Actions */}
              {user && (user.role === 'admin' || (tour.user && user._id === tour.user.toString())) && (
                <div className="flex gap-3">
                  <button onClick={() => navigate(`/edit-tour/${tour._id}`)} className="text-blue-600 font-bold hover:underline">Edit</button>
                  <button onClick={handleDelete} className="text-red-500 font-bold hover:underline">Delete</button>
                </div>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">{tour.description}</p>
          </div>

          {/* Map Section */}
          {tour.mapUrl && (
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Route Map 🗺️</h3>
              <div className="w-full h-80 rounded-xl overflow-hidden bg-gray-100">
                <iframe src={tour.mapUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy"></iframe>
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
             <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
               <div className="text-center">
                 <div className="text-5xl font-extrabold text-gray-900">{tour.rating ? tour.rating.toFixed(1) : "0.0"}</div>
                 <div className="text-yellow-500 text-lg">⭐⭐⭐⭐⭐</div>
               </div>
               <div className="h-12 w-px bg-gray-200"></div>
               <div>
                 <h2 className="text-2xl font-bold text-gray-900">Traveler Reviews</h2>
                 <p className="text-gray-500">{tour.numReviews} verified ratings</p>
               </div>
            </div>

            {/* Reviews List */}
            {tour.reviews.length === 0 ? (
               <div className="text-center py-10">
                 <p className="text-gray-400 italic">No reviews yet.</p>
               </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                {tour.reviews.map((review) => (
                  <div key={review._id} className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold border border-green-200">
                         {review.name.charAt(0).toUpperCase()}
                       </div>
                       <div>
                         <p className="font-bold text-gray-900 leading-tight">{review.name}</p>
                         <div className="flex text-yellow-400 text-xs">
                            {[...Array(5)].map((_, i) => (
                              <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                            ))}
                         </div>
                       </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                    {review.image && (
                      <img src={getImageUrl(review.image)} alt="Review" className="h-16 w-16 object-cover rounded-lg border border-gray-200" />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Write Review Form */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
              <h3 className="text-lg font-bold mb-4">Write a Review ✍️</h3>
              {user ? (
                <form onSubmit={submitReviewHandler} className="space-y-4">
                  {/* Star Rating */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Rating: <span className="text-green-600 font-normal ml-1">{getRatingLabel(hoverRating || rating)}</span>
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-8 h-8 transition-colors ${star <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea 
                    rows="3" 
                    className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500" 
                    placeholder="Share your tour experience..." 
                    value={comment} 
                    onChange={(e) => setComment(e.target.value)} 
                    required
                  ></textarea>

                  <div className="flex justify-between items-center">
                    <input type="file" onChange={handleReviewImageUpload} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-white file:text-green-700 hover:file:bg-green-50"/>
                    <button type="submit" disabled={uploading} className="bg-gray-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 transition">
                      {uploading ? 'Wait...' : 'Submit'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-sm text-gray-500">Please <a href="/login" className="text-blue-600 font-bold hover:underline">log in</a> to review.</div>
              )}
            </div>
          </div>
        </div>

        {/* 3. SIDEBAR (Sticky Booking) */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 sticky top-28">
            <div className="mb-6">
              <span className="text-gray-500 text-sm line-through block">Rs {Math.round(tour.price * 1.1)}</span>
              <span className="text-3xl font-extrabold text-green-600">Rs {tour.price.toLocaleString()}</span>
              <span className="text-gray-500 font-medium"> / person</span>
            </div>

            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Select Date</label>
                <input 
                  type="date" 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500" 
                  value={tourDate} 
                  onChange={(e) => setTourDate(e.target.value)} 
                  required 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Number of People</label>
                <input 
                  type="number" 
                  min="1" 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500" 
                  value={peopleCount} 
                  onChange={(e) => setPeopleCount(e.target.value)} 
                  required 
                />
              </div>

              {/* Total Calculation */}
              <div className="flex justify-between items-center py-2 border-t border-gray-100 mt-2">
                 <span className="font-bold text-gray-700">Total Price:</span>
                 <span className="font-bold text-lg text-green-700">LKR {(tour.price * peopleCount).toLocaleString()}</span>
              </div>

              <button type="submit" className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:bg-green-700 transition transform active:scale-95">
                Book Adventure 🚐
              </button>
              
              <p className="text-center text-xs text-gray-400 mt-2">No hidden booking fees</p>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100 space-y-2 text-xs text-gray-500">
               <div className="flex items-center gap-2"><span className="text-green-500">✔</span> Experienced Guide</div>
               <div className="flex items-center gap-2"><span className="text-green-500">✔</span> Transport Included</div>
               <div className="flex items-center gap-2"><span className="text-green-500">✔</span> Free Cancellation (24h)</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TourDetails;