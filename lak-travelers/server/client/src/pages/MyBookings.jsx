import { useEffect, useState } from 'react';
import API from '../services/api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking Data ගන්න Function එක
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

  // 👇 Booking Cancel කරන Function එක
  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this booking? ❌")) {
      try {
        await API.delete(`/bookings/${id}`);
        alert("Booking Cancelled Successfully!");
        // Table එක Update කරන්න ආයේ Data ගන්නවා (නැත්නම් Refresh කරන්න ඕනේ)
        fetchBookings(); 
      } catch (error) {
        console.error(error);
        alert("Failed to cancel booking");
      }
    }
  };

  if (loading) return <div className="text-center mt-10">Loading your bookings...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Bookings 📅</h1>

      {bookings.length === 0 ? (
        <div className="bg-yellow-100 p-4 rounded text-yellow-700">
          You haven't booked any hotels yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Hotel Name</th>
                <th className="py-3 px-4 text-left">Location</th>
                <th className="py-3 px-4 text-left">Check-In</th>
                <th className="py-3 px-4 text-left">Check-Out</th>
                <th className="py-3 px-4 text-left">Action</th> {/* Action Column එක */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-semibold">{booking.hotel?.name || "Hotel Removed"}</td>
                  <td className="py-3 px-4 text-gray-600">{booking.hotel?.location}</td>
                  <td className="py-3 px-4 text-blue-600">
                    {new Date(booking.checkInDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-red-600">
                    {new Date(booking.checkOutDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    {/* 👇 Cancel Button */}
                    <button 
                      onClick={() => handleCancel(booking._id)}
                      className="bg-red-100 text-red-600 py-1 px-3 rounded hover:bg-red-200 text-sm font-bold border border-red-200"
                    >
                      Cancel ❌
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyBookings;