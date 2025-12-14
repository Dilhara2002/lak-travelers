import { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddHotel = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    pricePerNight: '',
    image: '',
  });
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Image Upload Logic
  const handleFileUpload = async (file) => {
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    const data = new FormData();
    data.append('image', file);
    setUploading(true);

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const res = await axios.post('http://localhost:5001/api/upload', data, config);
      setFormData((prev) => ({ ...prev, image: res.data }));
      setUploading(false);
      // alert removed to make it smoother
    } catch (error) {
      console.error(error);
      setUploading(false);
      alert('Image upload failed! ❌');
    }
  };

  const onFileSelect = (e) => {
    handleFileUpload(e.target.files[0]);
  };

  // Drag Events
  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  // Remove Image Function
  const removeImage = () => {
    setPreview(null);
    setFormData((prev) => ({ ...prev, image: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      alert("Please upload an image first!");
      return;
    }
    
    try {
      await API.post('/hotels', formData);
      alert('Hotel Added Successfully! 🏨');
      navigate('/hotels');
    } catch (error) {
      console.error(error);
      alert('Failed to add hotel');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg border border-gray-100">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Add New Hotel 🏨</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Inputs */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Hotel Name</label>
            <input type="text" name="name" placeholder="Ex: Grand Hotel" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Location</label>
              <input type="text" name="location" placeholder="Ex: Kandy" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Price (LKR)</label>
              <input type="number" name="pricePerNight" placeholder="Ex: 5000" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Description</label>
            <textarea name="description" rows="3" placeholder="Tell us about the hotel..." onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" required></textarea>
          </div>

          {/* 👇 IMPROVED DRAG & DROP UI */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Hotel Image</label>
            
            {!preview ? (
              // 1. පින්තූරයක් නැති විට පෙන්වන කොටස (Drop Zone)
              <div 
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer
                  ${isDragging ? 'border-blue-500 bg-blue-50 scale-105' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}
                `}
              >
                {/* Visual Icon */}
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center pointer-events-none">
                  <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF</p>
                </div>

                {/* Hidden Input for Click */}
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={onFileSelect}
                />
              </div>
            ) : (
              // 2. පින්තූරයක් තෝරාගත් විට පෙන්වන කොටස (Preview with Remove Button)
              <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-md group">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                />
                
                {/* Remove Button (X) */}
                <button 
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>

                {/* Upload Status */}
                {uploading ? (
                   <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-bold">
                     Uploading...
                   </div>
                ) : (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 text-center">
                    <p className="text-white text-xs font-semibold">Image Ready ✅</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <button 
            type="submit" 
            disabled={uploading}
            className={`w-full text-white p-3 rounded-lg font-bold text-lg shadow-lg transition-transform transform active:scale-95
              ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600'}
            `}
          >
            {uploading ? 'Please Wait...' : 'Add Hotel'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddHotel;