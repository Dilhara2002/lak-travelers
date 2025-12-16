import { useState, useEffect } from 'react';
import API from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditTour = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    destinations: '',
    duration: '',
    price: '',
    groupSize: '',
    image: '',
  });

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // 1. පරණ Data ටික මුලින්ම Form එකට ගන්නවා
  useEffect(() => {
    const fetchTour = async () => {
      try {
        const { data } = await API.get(`/tours/${id}`);
        setFormData(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        alert("Error fetching tour data");
      }
    };
    fetchTour();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 👇 PUT Request එක යවනවා
      await API.put(`/tours/${id}`, formData);
      alert('Tour Updated Successfully! ✅');
      navigate('/tours');
    } catch (error) {
      console.error(error);
      alert('Failed to update tour');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Tour Package ✏️</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-bold mb-1">Package Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-1">Destinations</label>
            <input type="text" name="destinations" value={formData.destinations} onChange={handleChange} required className="w-full p-2 border rounded" />
          </div>

          <div className="grid grid-cols-3 gap-4">
             <div>
                <label className="block text-gray-700 font-bold mb-1">Duration</label>
                <input type="text" name="duration" value={formData.duration} onChange={handleChange} required className="w-full p-2 border rounded" />
             </div>
             <div>
                <label className="block text-gray-700 font-bold mb-1">Price</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full p-2 border rounded" />
             </div>
             <div>
                <label className="block text-gray-700 font-bold mb-1">Group Size</label>
                <input type="number" name="groupSize" value={formData.groupSize} onChange={handleChange} required className="w-full p-2 border rounded" />
             </div>
          </div>

          {/* Image Upload */}
          <div className="border p-4 rounded bg-gray-50">
             <label className="block text-gray-700 font-bold mb-2">Update Image (Optional)</label>
             <input type="file" onChange={handleFileUpload} accept="image/*" />
             {formData.image && <p className="text-xs text-gray-500 mt-2">Current: {formData.image}</p>}
          </div>

          <button type="submit" disabled={uploading} className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 transition">
             {uploading ? 'Uploading...' : 'Update Tour'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTour;