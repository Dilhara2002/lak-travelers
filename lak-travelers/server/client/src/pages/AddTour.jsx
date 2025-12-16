import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../services/api';

const AddTour = () => {
  const navigate = useNavigate();

  // 1. Separate State for Duration Inputs
  const [durationValue, setDurationValue] = useState('');
  const [durationUnit, setDurationUnit] = useState('Days');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    destinations: '',
    groupSize: '',
    image: '',
    mapUrl: '',
  });

  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const user = JSON.parse(localStorage.getItem('userInfo'));

  // 🔐 Authorization check
  useEffect(() => {
    if (!user || (user.role !== 'vendor' && user.role !== 'admin')) {
      alert('Unauthorized Access');
      navigate('/');
    }
  }, [user, navigate]);

  // 2. Duration Change Handlers
  const handleDurationValue = (e) => {
    const val = e.target.value;
    setDurationValue(val);
    setFormData((prev) => ({ ...prev, duration: `${val} ${durationUnit}` }));
  };

  const handleDurationUnit = (e) => {
    const unit = e.target.value;
    setDurationUnit(unit);
    setFormData((prev) => ({ ...prev, duration: `${durationValue} ${unit}` }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    const data = new FormData();
    data.append('image', file);

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const res = await axios.post('http://localhost:5001/api/upload', data, config);
      setFormData((prev) => ({ ...prev, image: res.data }));
    } catch (error) {
      console.error(error);
      alert('Image upload failed.');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const onFileSelect = (e) => handleFileUpload(e.target.files[0]);
  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files[0]);
  };
  const removeImage = () => {
    setPreview(null);
    setFormData((prev) => ({ ...prev, image: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) return alert("Cover image is required.");
    if (!durationValue) return alert("Duration value is required.");

    try {
      await API.post('/tours', formData);
      alert('Tour Package Added Successfully! 🚐');
      navigate('/tours');
    } catch (error) {
      console.error(error);
      alert('Failed to add tour.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Professional Header (Slate-900) */}
        <div className="bg-slate-900 px-8 py-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-white tracking-wide">Create Tour Package</h2>
            <p className="text-slate-400 text-sm mt-1">Curate a new adventure for travelers</p>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="text-slate-300 hover:text-white transition text-sm font-medium flex items-center gap-2"
          >
            ✕ Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          
          {/* SECTION 1: CORE INFO */}
          <div className="space-y-8">
            <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 border-b border-slate-100 pb-2">Package Details</h3>
                
                <div className="space-y-6">
                    {/* Package Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Package Name</label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-slate-400">🏷️</span>
                            <input
                                type="text"
                                name="name"
                                placeholder="e.g. Hill Country Adventure"
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    {/* Destinations */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Destinations</label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-slate-400">📍</span>
                            <input
                                type="text"
                                name="destinations"
                                placeholder="e.g. Ella, Kandy, Nuwara Eliya"
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    {/* Grid for Duration, Group, Price */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* ⏳ Duration */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Duration</label>
                            <div className="flex gap-2">
                                <div className="relative w-1/2">
                                    <span className="absolute left-3 top-3 text-slate-400">⏳</span>
                                    <input
                                        type="number"
                                        min="1"
                                        placeholder="Val"
                                        value={durationValue}
                                        onChange={handleDurationValue}
                                        className="w-full pl-9 pr-2 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div className="w-1/2">
                                    <select
                                        value={durationUnit}
                                        onChange={handleDurationUnit}
                                        className="w-full px-2 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none cursor-pointer text-sm"
                                    >
                                        <option value="Minutes">Mins</option>
                                        <option value="Hours">Hours</option>
                                        <option value="Days">Days</option>
                                        <option value="Weeks">Weeks</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Group Size */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Max Group Size</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-slate-400">👥</span>
                                <input
                                    type="number"
                                    name="groupSize"
                                    placeholder="10"
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Price (LKR)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-slate-400 font-bold text-xs">Rs</span>
                                <input
                                    type="number"
                                    name="price"
                                    placeholder="25000"
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 2: MAP & DESCRIPTION */}
            <div>
               <div className="mb-6">
                 <label className="block text-sm font-medium text-slate-700 mb-2">Tour Description</label>
                 <textarea
                   name="description"
                   rows="4"
                   placeholder="Describe the itinerary and experience..."
                   onChange={handleChange}
                   className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none transition-all resize-none"
                   required
                 />
               </div>

               <div className="mb-6">
                 <label className="block text-sm font-medium text-slate-700 mb-2">Route Map URL</label>
                 <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg mb-3">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-blue-800">
                          Paste the <strong>src URL</strong> from the Google Maps embed code.
                        </p>
                      </div>
                    </div>
                 </div>
                 <input
                   type="text"
                   name="mapUrl"
                   placeholder='https://www.google.com/maps/embed?..."'
                   onChange={handleChange}
                   className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none transition-all text-sm font-mono text-slate-600"
                 />
               </div>
            </div>

            {/* SECTION 3: MEDIA */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 border-b border-slate-100 pb-2">Cover Image</h3>
              
              <label className="block text-sm font-medium text-slate-700 mb-2">Upload Image</label>
              
              {!preview ? (
                <div
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  className={`relative group border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center transition-all cursor-pointer
                    ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'}`}
                >
                  <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </div>
                  <p className="text-slate-900 font-medium text-sm">Drag image here or click to browse</p>
                  <p className="text-slate-400 text-xs mt-1">SVG, PNG, JPG (Max 5MB)</p>
                  <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={onFileSelect} />
                </div>
              ) : (
                <div className="relative h-64 w-full rounded-xl overflow-hidden shadow-sm border border-slate-200 group">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      type="button" 
                      onClick={removeImage} 
                      className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold text-sm shadow hover:bg-slate-100 transition"
                    >
                      Change Image
                    </button>
                  </div>
                  {uploading && (
                    <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center text-white backdrop-blur">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent mb-2"></div>
                      <span className="text-sm font-medium">Uploading...</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ACTION BAR */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-4">
             <button
               type="button"
               onClick={() => navigate(-1)}
               className="px-6 py-3 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition"
             >
               Cancel
             </button>
             <button
              type="submit"
              disabled={uploading}
              className={`px-8 py-3 rounded-lg font-bold text-white shadow-md transition-all
                ${uploading 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-slate-900 hover:bg-slate-800 hover:shadow-lg active:transform active:scale-95'
                }`}
            >
              {uploading ? 'Processing...' : 'Publish Tour Package 🚐'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddTour;