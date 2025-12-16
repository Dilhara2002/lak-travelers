import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../services/api';

const AddTour = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    destinations: '',
    groupSize: '',
    image: '',
  });

  const [uploading, setUploading] = useState(false);

  const user = JSON.parse(localStorage.getItem('userInfo'));

  // 🔐 Authorization check
  useEffect(() => {
    if (!user || (user.role !== 'vendor' && user.role !== 'admin')) {
      alert('You are not authorized to access this page! 🚫');
      navigate('/');
    }
  }, [user, navigate]);

  // 📝 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🖼️ Image upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
      };

      const res = await axios.post(
        'http://localhost:5001/api/upload',
        data,
        config
      );

      setFormData((prev) => ({ ...prev, image: res.data }));
      alert('Image Uploaded! ✅');
    } catch (error) {
      console.error(error);
      alert('Image upload failed! ❌');
    } finally {
      setUploading(false);
    }
  };

  // 🚀 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post('/tours', formData);
      alert('Tour Package Added Successfully! 🎉');
      navigate('/tours');
    } catch (error) {
      console.error(error);
      alert('Failed to add tour. Please fill all fields.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Add New Tour Package 🚐
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Package Name */}
          <div>
            <label className="block font-bold mb-1">Package Name</label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Destinations */}
          <div>
            <label className="block font-bold mb-1">Destinations</label>
            <input
              type="text"
              name="destinations"
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Duration & Group Size */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold mb-1">Duration</label>
              <input
                type="text"
                name="duration"
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">Max Group Size</label>
              <input
                type="number"
                name="groupSize"
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block font-bold mb-1">
              Price per Person (LKR)
            </label>
            <input
              type="number"
              name="price"
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold mb-1">Description</label>
            <textarea
              name="description"
              rows="4"
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Image Upload */}
          <div className="border p-4 rounded bg-gray-50">
            <label className="block font-bold mb-2">Upload Cover Image</label>
            <input type="file" accept="image/*" onChange={handleFileUpload} />
            {uploading && (
              <p className="text-blue-500 text-sm mt-2">Uploading...</p>
            )}
            {formData.image && (
              <p className="text-green-600 text-sm mt-2 font-bold">
                Image Selected ✅
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white p-3 rounded font-bold hover:bg-green-700 transition"
          >
            Create Tour Package
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTour;
