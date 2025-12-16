import { useState, useEffect } from 'react';
import API from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditHotel = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    pricePerNight: '',
    image: '',
    mapUrl: '',
  });

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null); // Track local preview for new file

  const user = JSON.parse(localStorage.getItem('userInfo'));

  // 🔐 Authorization Check
  useEffect(() => {
    if (!user || (user.role !== 'vendor' && user.role !== 'admin')) {
      alert('Unauthorized Access');
      navigate('/');
    }
  }, [user, navigate]);

  // 1. Fetch Existing Data
  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const { data } = await API.get(`/hotels/${id}`);
        // Ensure user is authorized to edit THIS hotel (if vendor)
        if (user.role === 'vendor' && data.user !== user._id) {
            alert("You are not authorized to edit this property.");
            navigate('/hotels');
            return;
        }
        setFormData({
            name: data.name,
            location: data.location,
            description: data.description,
            pricePerNight: data.pricePerNight,
            image: data.image,
            mapUrl: data.mapUrl || ''
        });
        setLoading(false);
      } catch (error) {
        console.error(error);
        alert("Error loading hotel data");
        navigate('/hotels');
      }
    };
    if(user) {
        fetchHotel();
    }
  }, [id, navigate, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Image Upload Logic
  const handleFileUpload = async (file) => {
    if (!file) return;
    
    // Show local preview immediately
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    const data = new FormData();
    data.append('image', file);

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const res = await axios.post('http://localhost:5001/api/upload', data, config);
      
      // Update state with new image path from server
      setFormData((prev) => ({ ...prev, image: res.data }));
    } catch (error) {
      console.error(error);
      alert('Image upload failed! ❌');
      setPreview(null); // Revert preview on failure
    } finally {
      setUploading(false);
    }
  };

  const onFileSelect = (e) => handleFileUpload(e.target.files[0]);
  
  // Drag & Drop Handlers
  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files[0]);
  };

  // Helper to render image URL (either local preview or server path)
  const getDisplayImage = () => {
    if (preview) return preview; // Show new local file if selected
    if (formData.image) {
        return formData.image.startsWith("http") ? formData.image : `http://localhost:5001${formData.image}`;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) return alert("Property image is required.");
    if (!formData.mapUrl) return alert("Map URL is required.");

    try {
      await API.put(`/hotels/${id}`, formData);
      alert('Hotel Updated Successfully! 📝');
      navigate(`/hotels/${id}`); // Redirect to details page
    } catch (error) {
      console.error(error);
      alert('Failed to update hotel');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex justify-center items-center bg-slate-50">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-slate-800"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Professional Header */}
        <div className="bg-slate-900 px-8 py-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-white tracking-wide">Edit Property</h2>
            <p className="text-slate-400 text-sm mt-1">Update details for {formData.name}</p>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="text-slate-300 hover:text-white transition text-sm font-medium flex items-center gap-2"
          >
            ✕ Cancel
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-8">
            
            {/* SECTION 1: CORE DETAILS */}
            <div>
               <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 border-b border-slate-100 pb-2">Property Details</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 
                 {/* Name */}
                 <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Property Name</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all text-slate-800 placeholder-slate-400"
                        required
                    />
                 </div>

                 {/* Location */}
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-slate-400">📍</span>
                        <input 
                            type="text" 
                            name="location" 
                            value={formData.location} 
                            onChange={handleChange} 
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                            required
                        />
                    </div>
                 </div>

                 {/* Price */}
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Price Per Night (LKR)</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-slate-400 font-bold text-xs">LKR</span>
                        <input 
                            type="number" 
                            name="pricePerNight" 
                            value={formData.pricePerNight} 
                            onChange={handleChange} 
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                            required
                        />
                    </div>
                 </div>
               </div>
            </div>

            {/* SECTION 2: DESCRIPTION & MAP */}
            <div>
               <div className="mb-6">
                 <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                 <textarea 
                    name="description" 
                    rows="5" 
                    value={formData.description} 
                    onChange={handleChange} 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none transition-all resize-none"
                    required
                 />
               </div>

               <div className="mb-6">
                 <label className="block text-sm font-medium text-slate-700 mb-2">Location Map</label>
                 {/* Professional Map Info Box */}
                 <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg mb-3">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-blue-800">
                          Ensure this is the <strong>src URL</strong> from the Google Maps embed code.
                        </p>
                      </div>
                    </div>
                 </div>
                 <input 
                    type="text" 
                    name="mapUrl" 
                    value={formData.mapUrl} 
                    onChange={handleChange} 
                    placeholder='https://www.google.com/maps/embed?..."' 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none transition-all text-sm font-mono text-slate-600"
                    required
                 />
               </div>
            </div>

            {/* SECTION 3: IMAGE UPDATE */}
            <div>
               <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 border-b border-slate-100 pb-2">Property Image</h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  
                  {/* Upload Area */}
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
                    <p className="text-slate-900 font-medium text-sm">Click to change image</p>
                    <p className="text-slate-400 text-xs mt-1">JPG, PNG (Max 5MB)</p>
                    <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={onFileSelect} />
                  </div>

                  {/* Preview Area */}
                  <div className="relative h-48 w-full rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-slate-50">
                    {getDisplayImage() ? (
                        <>
                           <img src={getDisplayImage()} alt="Preview" className="w-full h-full object-cover" />
                           {/* Label showing if it's current or new */}
                           <div className="absolute top-2 right-2 bg-slate-900/70 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                             {preview ? "New Selection" : "Current Image"}
                           </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-400 font-medium">No Image Available</div>
                    )}
                    
                    {/* Uploading Overlay */}
                    {uploading && (
                      <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center text-white backdrop-blur">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent mb-2"></div>
                        <span className="text-sm font-medium">Uploading...</span>
                      </div>
                    )}
                  </div>
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
                    {uploading ? 'Processing...' : 'Save Changes'}
                </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHotel;