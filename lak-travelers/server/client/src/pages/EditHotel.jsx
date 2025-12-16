import { useState, useEffect } from 'react';
import API from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditHotel = () => {
  const { id } = useParams(); // URL එකෙන් ID එක ගන්නවා
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    pricePerNight: '',
    image: '',
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // 1. පරණ විස්තර Backend එකෙන් අරගන්නවා
  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const { data } = await API.get(`/hotels/${id}`);
        setFormData({
            name: data.name,
            location: data.location,
            description: data.description,
            pricePerNight: data.pricePerNight,
            image: data.image
        });
        setLoading(false);
      } catch (error) {
        console.error(error);
        alert("Error loading hotel data");
      }
    };
    fetchHotel();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Image Upload Logic (අපි AddHotel එකේ පාවිච්චි කරපු එකමයි)
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const data = new FormData();
    data.append('image', file);
    setUploading(true);

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const res = await axios.post('http://localhost:5001/api/upload', data, config);
      setFormData((prev) => ({ ...prev, image: res.data }));
      setUploading(false);
      alert('Image Updated! ✅');
    } catch (error) {
      console.error(error);
      setUploading(false);
      alert('Image upload failed! ❌');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // PUT Request එකක් යවනවා Update කරන්න
      await API.put(`/hotels/${id}`, formData);
      alert('Hotel Updated Successfully! 📝');
      navigate(`/hotels/${id}`); // ආයේ Hotel Details එකට යනවා
    } catch (error) {
      console.error(error);
      alert('Failed to update hotel');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Edit Hotel Details ✏️</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">Hotel Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded h-24"></textarea>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">Price (LKR)</label>
            <input type="number" name="pricePerNight" value={formData.pricePerNight} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>

          {/* Change Image */}
          <div className="border p-2 rounded bg-gray-50">
            <label className="block text-sm font-bold mb-2 text-gray-700">Change Image (Optional)</label>
            <input type="file" onChange={handleFileUpload} />
            {uploading && <p className="text-blue-500 text-sm">Uploading...</p>}
          </div>
          
          <button type="submit" className="w-full bg-yellow-500 text-white p-3 rounded font-bold hover:bg-yellow-600">
            Update Hotel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditHotel;