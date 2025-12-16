import { useState, useEffect } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // 1. Fetch User Data on Load
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await API.get('/users/profile');
        setName(data.name);
        setEmail(data.email);
        setLoading(false);
      } catch (error) {
        console.error(error);
        // Redirect to login if session expired
        navigate('/login');
      }
    };
    fetchUserData();
  }, [navigate]);

  // 2. Handle Update Logic
  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (password && password !== confirmPassword) {
      setMessage({ text: "Passwords do not match! ❌", type: 'error' });
      return;
    }

    try {
      const { data } = await API.put('/users/profile', {
        name,
        password, 
      });
      
      // Update LocalStorage with new name
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      setMessage({ text: "Profile Updated Successfully! ✅", type: 'success' });
      setPassword('');
      setConfirmPassword('');
      
      // Optional: specific timeout before reload or redirect
      setTimeout(() => window.location.reload(), 1000);
      
    } catch (error) {
      setMessage({ text: "Update Failed. Please try again.", type: 'error' });
    }
  };

  if (loading) return (
    <div className="min-h-screen flex justify-center items-center bg-slate-50">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-slate-800"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Professional Header */}
        <div className="bg-slate-900 px-8 py-6">
          <h2 className="text-xl font-semibold text-white tracking-wide">Account Settings</h2>
          <p className="text-slate-400 text-sm mt-1">Manage your profile information and security.</p>
        </div>

        <form onSubmit={handleUpdate} className="p-8 space-y-8">
          
          {/* Notification Banner */}
          {message.text && (
            <div className={`p-4 rounded-lg text-sm font-medium flex items-center gap-2 ${
              message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              <span>{message.type === 'success' ? '✅' : '⚠️'}</span>
              {message.text}
            </div>
          )}

          {/* SECTION 1: PERSONAL INFO */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 border-b border-slate-100 pb-2">Personal Information</h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-400">👤</span>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none transition-all text-slate-800"
                    />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-400">✉️</span>
                    <input 
                      type="email" 
                      value={email} 
                      disabled 
                      className="w-full pl-10 pr-10 py-3 bg-gray-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed select-none"
                    />
                    <span className="absolute right-3 top-3 text-slate-400" title="Email cannot be changed">🔒</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Email address cannot be changed for security reasons.</p>
              </div>
            </div>
          </div>

          {/* SECTION 2: SECURITY */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 border-b border-slate-100 pb-2">Security & Password</h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-400">🔑</span>
                    <input 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      placeholder="Leave blank to keep current password"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none transition-all placeholder-slate-400"
                    />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
                <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-400">🔐</span>
                    <input 
                      type="password" 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                      placeholder="Confirm new password"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none transition-all placeholder-slate-400"
                    />
                </div>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-4">
            <button 
              type="button" 
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 shadow-md transition-all active:scale-95"
            >
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default UserProfile;