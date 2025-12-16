import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Image Gallery State
  const [mainImage, setMainImage] = useState("");

  // Booking Form State
  const [pickupDate, setPickupDate] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");

  // Data Fetching
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const { data } = await API.get(`/vehicles/${id}`);
        setVehicle(data);
        // මුලින්ම පේන්න ඕනේ පළවෙනි පින්තූරය
        if (data.images && data.images.length > 0) {
          setMainImage(data.images[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      await API.post('/bookings', {
        bookingType: 'vehicle',
        vehicleId: id,
        pickupDate,
        pickupLocation
      });
      alert("Vehicle Booked Successfully! 🚗✅");
      navigate('/my-bookings');
    } catch (error) {
      console.error(error);
      alert("Booking Failed! Please Login.");
      navigate('/login');
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/300";
    if (imagePath.startsWith("http")) return imagePath;
    return `http://localhost:5001${imagePath}`;
  };

  if (loading) return <div className="text-center mt-20">Loading... ⏳</div>;
  if (!vehicle) return <div className="text-center mt-20">Vehicle not found 😕</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row gap-8 p-6">
        
        {/* LEFT: IMAGE GALLERY 📸 */}
        <div className="md:w-1/2">
          {/* Main Large Image */}
          <div className="h-80 w-full mb-4 rounded-lg overflow-hidden border">
            <img src={getImageUrl(mainImage)} alt="Main" className="w-full h-full object-cover" />
          </div>

          {/* Thumbnails (Small Images) */}
          <div className="flex gap-2 overflow-x-auto">
            {vehicle.images.map((img, index) => (
              <img 
                key={index}
                src={getImageUrl(img)}
                alt={`thumb-${index}`}
                onClick={() => setMainImage(img)} // Click කළාම Main Image එක මාරු වෙනවා
                className={`w-20 h-20 object-cover rounded cursor-pointer border-2 transition ${mainImage === img ? 'border-blue-600 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT: DETAILS & BOOKING */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{vehicle.vehicleModel}</h1>
          <div className="flex items-center gap-4 mb-4">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm font-bold">{vehicle.type}</span>
            <span className="text-gray-500 text-sm border px-2 py-1 rounded">{vehicle.licensePlate}</span>
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed">{vehicle.description}</p>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
            <p>👨‍✈️ <strong>Driver:</strong> {vehicle.driverName}</p>
            <p>👥 <strong>Capacity:</strong> {vehicle.capacity} Seats</p>
            <p>📞 <strong>Contact:</strong> {vehicle.contactNumber}</p>
          </div>

          {/* Booking Form Box */}
          <div className="bg-gray-50 p-6 rounded-xl border shadow-sm">
            <p className="text-gray-500 mb-1">Price per Day</p>
            <h3 className="text-3xl font-bold text-blue-600 mb-4">LKR {vehicle.pricePerDay}</h3>

            <form onSubmit={handleBooking} className="space-y-3">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Pickup Date 📅</label>
                <input type="date" required value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="w-full p-2 border rounded" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Pickup Location 📍</label>
                <input type="text" placeholder="Ex: Colombo Airport" required value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} className="w-full p-2 border rounded" />
              </div>

              <button type="submit" className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition">
                Book Vehicle 🚗
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VehicleDetails;