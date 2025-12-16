import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../services/api';

const AddVehicle = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    driverName: '',
    vehicleModel: '',
    type: 'Car',
    licensePlate: '',
    capacity: '',
    pricePerDay: '',
    description: '',
    contactNumber: '',
    images: [],
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

  // 📝 Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🖼️ Upload multiple images (max 4)
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (formData.images.length + files.length > 4) {
      alert('You can only upload up to 4 images!');
      return;
    }

    setUploading(true);
    const uploadedUrls = [];

    try {
      for (const file of files) {
        const data = new FormData();
        data.append('image', file);

        const config = {
          headers: { 'Content-Type': 'multipart/form-data' },
        };

        const res = await axios.post(
          'http://localhost:5001/api/upload',
          data,
          config
        );

        uploadedUrls.push(res.data);
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
    } catch (error) {
      console.error(error);
      alert('Image upload failed! ❌');
    } finally {
      setUploading(false);
    }
  };

  // ❌ Remove selected image
  const removeImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  // 🚀 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.images.length === 0) {
      alert('Please upload at least one image!');
      return;
    }

    try {
      await API.post('/vehicles', formData);
      alert('Vehicle Registered Successfully! 🚗🎉');
      navigate('/vehicles');
    } catch (error) {
      console.error(error);
      alert('Failed to register vehicle.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Register a Vehicle 🚘
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Driver & Model */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-bold block mb-1">Driver Name</label>
              <input
                type="text"
                name="driverName"
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="font-bold block mb-1">Vehicle Model</label>
              <input
                type="text"
                name="vehicleModel"
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          {/* Type & License */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-bold block mb-1">Vehicle Type</label>
              <select
                name="type"
                onChange={handleChange}
                className="w-full p-2 border rounded bg-white"
              >
                <option value="Car">Car 🚗</option>
                <option value="Van">Van 🚐</option>
                <option value="SUV">SUV 🚙</option>
                <option value="Bus">Bus 🚌</option>
                <option value="TukTuk">TukTuk 🛺</option>
              </select>
            </div>

            <div>
              <label className="font-bold block mb-1">License Plate</label>
              <input
                type="text"
                name="licensePlate"
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          {/* Capacity / Price / Contact */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="font-bold block mb-1">Seats</label>
              <input
                type="number"
                name="capacity"
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="font-bold block mb-1">Price / Day</label>
              <input
                type="number"
                name="pricePerDay"
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="font-bold block mb-1">Contact No</label>
              <input
                type="text"
                name="contactNumber"
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-bold block mb-1">Description</label>
            <textarea
              name="description"
              rows="3"
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Image Upload */}
          <div className="border-2 border-dashed border-blue-300 p-6 rounded-lg bg-blue-50 text-center">
            <label className="cursor-pointer block">
              <span className="text-blue-600 font-bold text-lg">
                Click to Upload Photos 📸
              </span>
              <p className="text-sm text-gray-500 mb-2">
                Select up to 4 images
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            {uploading && (
              <p className="text-blue-500 font-bold mt-2">Uploading... ⏳</p>
            )}

            {formData.images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={`http://localhost:5001${img}`}
                      alt="Preview"
                      className="w-full h-20 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs hover:bg-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-gray-400 mt-2">
              {formData.images.length} / 4 images uploaded
            </p>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {uploading ? 'Please wait...' : 'Register Vehicle'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddVehicle;
