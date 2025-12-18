import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api"; // අපගේ සාදාගත් API instance එක

const VendorSetup = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("userInfo");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Form Data State
  const [formData, setFormData] = useState({
    businessName: "",
    serviceType: "hotel",
    registrationNumber: "",
    phone: "",
    address: "",
    description: "",
    hotelStarRating: "",
    vehicleFleetSize: "",
    guideLanguages: "",
    experienceYears: "",
    profileImage: "",
    idFront: "",
    idBack: ""
  });

  const [docType, setDocType] = useState("nic"); 
  const [uploadingState, setUploadingState] = useState({
    profile: false,
    idFront: false,
    idBack: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // 🔐 Authorization Guard
  useEffect(() => {
    if (!user) navigate("/login");
    else if (user.role !== "vendor") navigate("/");
    else if (user.isApproved) navigate("/dashboard");
    else if (user.vendorDetails?.businessName) setIsPending(true);
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * 🖼️ ලේඛන Cloudinary වෙත උඩුගත කිරීම
   */
  const handleFileUpload = async (file, fieldName) => {
    if (!file) return;

    // Field එකට අදාළව Loading පෙන්වීම
    const stateKey = fieldName === 'profileImage' ? 'profile' : fieldName;
    setUploadingState(prev => ({ ...prev, [stateKey]: true }));

    const data = new FormData();
    data.append('image', file);

    try {
      // ⚠️ API භාවිතා කිරීමෙන් CORS සහ Cookies ප්‍රශ්නය විසඳේ
      const res = await API.post('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData(prev => ({ ...prev, [fieldName]: res.data }));
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Document upload failed. Please try again.");
    } finally {
      setUploadingState(prev => ({ ...prev, [stateKey]: false }));
    }
  };

  /**
   * 🚀 Vendor Profile එක Submit කිරීම
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.profileImage) return alert("Profile Image is required!");
    if (!formData.idFront) return alert("Identity Document (Front) is required!");
    if (docType !== 'passport' && !formData.idBack) return alert("Identity Document (Back) is required!");

    setIsSubmitting(true);

    try {
      // Backend එකේ /api/users/vendor-profile වෙත දත්ත යවයි
      const { data } = await API.put("/users/vendor-profile", formData);
      
      // Local storage එකේ ඇති User දත්ත අලුත් විස්තර සමඟ Update කිරීම
      const updatedUser = { ...user, vendorDetails: data.vendorDetails };
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsPending(true);
      alert("Application submitted successfully! ✅");
    } catch (error) {
      console.error("Setup Error:", error);
      alert(error.response?.data?.message || "Failed to save details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * ⏳ Verification පෙන්වන අවස්ථාව
   */
  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
          <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl animate-bounce">⏳</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Pending</h2>
          <p className="text-gray-500 mb-6">
            Hi {user?.name}, we have received your details. Our team is reviewing your documents to ensure safety. This usually takes 24-48 hours.
          </p>
          <button 
            onClick={() => { localStorage.removeItem("userInfo"); navigate("/login"); }} 
            className="text-blue-600 font-bold hover:underline"
          >
            Log Out & Check Later
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 font-sans mt-12">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-slate-900 px-8 py-6">
          <h2 className="text-2xl font-bold text-white text-shadow-sm">Vendor Registration</h2>
          <p className="text-slate-400 mt-1">Complete your profile to start providing services on Lak Travelers.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* 1. SERVICE TYPE */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Select Service Category</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {['hotel', 'vehicle', 'tour'].map((type) => (
                <div 
                  key={type}
                  onClick={() => setFormData({...formData, serviceType: type})}
                  className={`cursor-pointer border-2 rounded-xl p-5 flex flex-col items-center justify-center transition-all transform active:scale-95 ${
                    formData.serviceType === type 
                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md ring-2 ring-blue-100' 
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <span className="text-2xl mb-1">{type === 'hotel' ? '🏨' : type === 'vehicle' ? '🚗' : '🚐'}</span>
                  <span className="capitalize font-extrabold">{type === 'tour' ? 'Tour Guide' : type}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. BUSINESS DETAILS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">Business / Brand Name</label>
              <input type="text" name="businessName" value={formData.businessName} required onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g. Ella Nature Resort" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
              <input type="text" name="phone" value={formData.phone} required onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+94 77 ..." />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Business Address</label>
              <input type="text" name="address" value={formData.address} required onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="City, District" />
            </div>
          </div>

          {/* 3. DYNAMIC FIELDS */}
          <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
            <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-4 border-b border-blue-100 pb-2">
              {formData.serviceType === 'hotel' ? '🏨 Hotel Specifics' : 
               formData.serviceType === 'vehicle' ? '🚗 Vehicle Fleet' : '🚐 Guide Experience'}
            </h3>

            {formData.serviceType === 'hotel' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Star Rating</label>
                    <select name="hotelStarRating" value={formData.hotelStarRating} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white">
                      <option value="">Select Rating</option>
                      <option value="1">1 Star</option>
                      <option value="3">3 Star</option>
                      <option value="5">5 Star</option>
                      <option value="boutique">Boutique / Villa</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Registration Number</label>
                    <input type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300" placeholder="SLTDA Number" />
                 </div>
              </div>
            )}

            {formData.serviceType === 'vehicle' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Fleet Size</label>
                    <input type="number" name="vehicleFleetSize" value={formData.vehicleFleetSize} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300" placeholder="Number of vehicles" />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Owner License No</label>
                    <input type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300" placeholder="License Number" />
                 </div>
              </div>
            )}

            {formData.serviceType === 'tour' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Languages Spoken</label>
                    <input type="text" name="guideLanguages" value={formData.guideLanguages} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300" placeholder="English, Sinhala, German..." />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Years of Experience</label>
                    <input type="number" name="experienceYears" value={formData.experienceYears} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300" placeholder="e.g. 5" />
                 </div>
              </div>
            )}

            <div className="mt-4">
              <label className="block text-sm font-bold text-gray-700 mb-1">Brief Description</label>
              <textarea name="description" value={formData.description} rows="3" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 resize-none" placeholder="Tell travelers about your service..."></textarea>
            </div>
          </div>

          {/* 4. IDENTITY VERIFICATION */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 border-b border-gray-100 pb-2">Identity Verification</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700">Select Document Type</label>
                    <select 
                        value={docType}
                        onChange={(e) => setDocType(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white font-medium focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="nic">National Identity Card (NIC)</option>
                        <option value="license">Driving License</option>
                        <option value="passport">Passport</option>
                    </select>
                    <p className="text-xs text-blue-600 font-medium">
                        {docType === 'passport' 
                            ? "* Upload the main photo page." 
                            : "* Upload front and back sides clearly."}
                    </p>
                 </div>
              
                <UploadBox 
                    label="Official Profile Photo" 
                    image={formData.profileImage} 
                    loading={uploadingState.profile}
                    onUpload={(e) => handleFileUpload(e.target.files[0], 'profileImage')} 
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UploadBox 
                label={docType === 'passport' ? "Passport Info Page" : "ID Front Side"} 
                image={formData.idFront} 
                loading={uploadingState.idFront}
                onUpload={(e) => handleFileUpload(e.target.files[0], 'idFront')} 
              />

              {docType !== 'passport' && (
                <UploadBox 
                  label="ID Back Side" 
                  image={formData.idBack} 
                  loading={uploadingState.idBack}
                  onUpload={(e) => handleFileUpload(e.target.files[0], 'idBack')} 
                />
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-slate-900 text-white font-extrabold py-4 rounded-xl hover:bg-slate-800 transition-all shadow-xl disabled:bg-gray-400 transform active:scale-[0.98]"
          >
            {isSubmitting ? "Submitting Application..." : "Submit for Verification ✅"}
          </button>

        </form>
      </div>
    </div>
  );
};

// Helper Component for Upload Boxes
const UploadBox = ({ label, image, loading, onUpload }) => {
    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const backendURL = "https://lak-travelers-api.vercel.app"; // ඔබේ Vercel URL
        return `${backendURL}${path.startsWith('/') ? path : `/${path}`}`;
    };

    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700">{label}</label>
            <div className={`relative h-40 w-full border-2 border-dashed rounded-2xl flex items-center justify-center overflow-hidden transition-all duration-300 
            ${image ? 'border-blue-500 bg-blue-50 shadow-inner' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}>
            
            {loading ? (
                <div className="flex flex-col items-center gap-2">
                    <div className="h-6 w-6 border-2 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
                    <span className="text-[10px] font-bold text-blue-600">Uploading...</span>
                </div>
            ) : image ? (
                <img src={getImageUrl(image)} alt="Preview" className="w-full h-full object-cover" />
            ) : (
                <div className="text-center p-4">
                <div className="text-2xl mb-1">📸</div>
                <p className="text-xs text-gray-500 font-bold">Click to Upload</p>
                </div>
            )}
            
            <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={onUpload} accept="image/*" />
            </div>
        </div>
    );
};

export default VendorSetup;