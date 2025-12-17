import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import axios from "axios";

const VendorSetup = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userInfo"));

  // Form Data State
  const [formData, setFormData] = useState({
    businessName: "",
    serviceType: "hotel",
    registrationNumber: "",
    phone: "",
    address: "",
    description: "",
    // Specific Fields
    hotelStarRating: "",
    vehicleFleetSize: "",
    guideLanguages: "",
    experienceYears: "",
    // Documents
    profileImage: "",
    idFront: "",
    idBack: ""
  });

  // 👇 Document Type State (Default: National ID)
  const [docType, setDocType] = useState("nic"); // Options: 'nic', 'license', 'passport'

  const [uploadingState, setUploadingState] = useState({
    profile: false,
    idFront: false,
    idBack: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (!user) navigate("/login");
    else if (user.role !== "vendor") navigate("/");
    else if (user.isApproved) navigate("/dashboard");
    else if (user.vendorDetails?.businessName) setIsPending(true);
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (file, fieldName) => {
    if (!file) return;

    setUploadingState(prev => ({ ...prev, [fieldName]: true }));

    const data = new FormData();
    data.append('image', file);

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      // Vercel Backend URL
      const res = await axios.post('https://lak-travelers-z1uk.vercel.app/api/upload', data, config);
      setFormData(prev => ({ ...prev, [fieldName]: res.data }));
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Image upload failed");
    } finally {
      setUploadingState(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 👇 Validation Logic Updated
    if (!formData.profileImage) {
      alert("Profile Image is required!");
      return;
    }
    if (!formData.idFront) {
      alert("Identity Document (Front) is required!");
      return;
    }
    // Passport වලට Back side එක බලන්න ඕනේ නෑ. අනිත් ඒවාට ඕනේ.
    if (docType !== 'passport' && !formData.idBack) {
      alert("Identity Document (Back) is required!");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data } = await API.put("/users/vendor-profile", formData);
      const updatedUser = { ...user, vendorDetails: data.vendorDetails };
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));
      setIsPending(true);
    } catch (error) {
      console.error("Setup Error:", error);
      alert("Failed to save details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
          <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">⏳</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Pending</h2>
          <p className="text-gray-500 mb-6">
            We are reviewing your documents. You will be notified once approved.
          </p>
          <button onClick={() => { localStorage.removeItem("userInfo"); navigate("/login"); }} className="text-blue-600 font-bold underline">
            Log Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-slate-900 px-8 py-6">
          <h2 className="text-2xl font-bold text-white">Vendor Registration</h2>
          <p className="text-slate-400 mt-1">Complete your profile to start earning.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* 1. SERVICE TYPE SELECTION */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">Select Service Category</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {['hotel', 'vehicle', 'tour'].map((type) => (
                <div 
                  key={type}
                  onClick={() => setFormData({...formData, serviceType: type})}
                  className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center transition-all ${
                    formData.serviceType === type 
                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <span className="capitalize font-bold text-lg">{type === 'tour' ? 'Tour Guide' : type}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. BUSINESS DETAILS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Business / Brand Name</label>
              <input type="text" name="businessName" required onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-slate-900 outline-none" placeholder="Enter your business name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input type="text" name="phone" required onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none" placeholder="+94 77 ..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input type="text" name="address" required onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none" placeholder="City, District" />
            </div>
          </div>

          {/* 3. DYNAMIC FIELDS */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">
              {formData.serviceType === 'hotel' ? 'Hotel Specifics' : 
               formData.serviceType === 'vehicle' ? 'Vehicle Fleet Details' : 'Guide Experience'}
            </h3>

            {formData.serviceType === 'hotel' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Star Rating (Optional)</label>
                    <select name="hotelStarRating" onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none">
                      <option value="">Select Rating</option>
                      <option value="1">1 Star</option>
                      <option value="3">3 Star</option>
                      <option value="5">5 Star</option>
                      <option value="boutique">Boutique / Villa</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                    <input type="text" name="registrationNumber" onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none" placeholder="SLTDA Number" />
                 </div>
              </div>
            )}

            {formData.serviceType === 'vehicle' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fleet Size</label>
                    <input type="number" name="vehicleFleetSize" onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none" placeholder="How many vehicles?" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Owner License No</label>
                    <input type="text" name="registrationNumber" onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none" placeholder="License Number" />
                 </div>
              </div>
            )}

            {formData.serviceType === 'tour' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Languages Spoken</label>
                    <input type="text" name="guideLanguages" onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none" placeholder="English, German, etc." />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                    <input type="number" name="experienceYears" onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none" placeholder="e.g. 5" />
                 </div>
              </div>
            )}

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" rows="3" onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none" placeholder="Tell us more about your service..."></textarea>
            </div>
          </div>

          {/* 4. IDENTITY VERIFICATION (Updated) */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 border-b border-gray-100 pb-2">Identity Verification</h3>
            
            {/* 👇 Row 1: Profile Photo & Document Type Selector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                 <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">Select Document Type</label>
                <div className="h-40 flex flex-col justify-center">
                   <select 
                      value={docType}
                      onChange={(e) => setDocType(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 font-medium"
                   >
                     <option value="nic">National Identity Card (NIC)</option>
                     <option value="license">Driving License</option>
                     <option value="passport">Passport</option>
                   </select>
                   <p className="text-xs text-gray-500 mt-2">
                     {docType === 'passport' 
                        ? "* Please upload the main info page of your Passport." 
                        : "* Please upload both front and back sides."}
                   </p>
                </div>
              </div>
              
              {/* Profile Photo */}
              <UploadBox 
                label="Vendor Profile Photo" 
                image={formData.profileImage} 
                loading={uploadingState.profile}
                onUpload={(e) => handleFileUpload(e.target.files[0], 'profileImage')} 
              />

              {/* Document Selector */}
             
            </div>

            {/* 👇 Row 2: Document Uploads (Conditional) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Front Side (Always Visible) */}
              <UploadBox 
                label={docType === 'passport' ? "Passport Info Page" : "Front Side"} 
                image={formData.idFront} 
                loading={uploadingState.idFront}
                onUpload={(e) => handleFileUpload(e.target.files[0], 'idFront')} 
              />

              {/* Back Side (Hidden for Passport) */}
              {docType !== 'passport' && (
                <UploadBox 
                  label="Back Side" 
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
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition shadow-lg disabled:bg-gray-400"
          >
            {isSubmitting ? "Submitting Application..." : "Submit for Verification"}
          </button>

        </form>
      </div>
    </div>
  );
};

// Helper Component for Upload Boxes
const UploadBox = ({ label, image, loading, onUpload }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-bold text-gray-700">{label}</label>
    <div className={`relative h-40 w-full border-2 border-dashed rounded-xl flex items-center justify-center overflow-hidden transition-all 
      ${image ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}`}>
      
      {loading ? (
        <span className="text-xs font-bold text-slate-500">Uploading...</span>
      ) : image ? (
        <img src={image.startsWith('http') ? image : `https://lak-travelers-z1uk.vercel.app${image}`} alt="Preview" className="w-full h-full object-cover" />
      ) : (
        <div className="text-center p-4">
          <p className="text-xs text-gray-500">Click to Upload</p>
          <p className="text-[10px] text-gray-400 mt-1">JPG/PNG</p>
        </div>
      )}
      
      <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={onUpload} accept="image/*" />
    </div>
  </div>
);

export default VendorSetup;