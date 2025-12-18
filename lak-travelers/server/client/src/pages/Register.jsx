import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import API from '../services/api';
import { toast } from 'react-toastify';
import registerImage from '../assets/Register.jpg';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });

  const [isLoading, setIsLoading] = useState(false);

  // localStorage වෙතින් ආරක්ෂිතව දත්ත ලබා ගැනීම
  const userInfo = useMemo(() => {
    const saved = localStorage.getItem('userInfo');
    return saved ? JSON.parse(saved) : null;
  }, []);

  // 1. පිටුව පූරණය වූ විගස මුදුනට Scroll කිරීම
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 2. URL එකේ ?role=vendor තිබේ නම් එය Auto-select කිරීම
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const roleFromUrl = queryParams.get('role');
    
    if (roleFromUrl === 'vendor') {
      setFormData((prev) => ({ ...prev, role: 'vendor' }));
    }
  }, [location]);

  // 3. දැනටමත් ලොග් වී ඇත්නම් Redirect කිරීම
  useEffect(() => {
    if (userInfo) {
      if (userInfo.role === 'vendor' && !userInfo.isApproved) {
        navigate('/vendor-setup');
      } else {
        navigate('/');
      }
    }
  }, [userInfo, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * 🚀 ලියාපදිංචි වීමේ (Submit) ක්‍රියාවලිය
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, role } = formData;

    // Frontend Validation
    if (password !== confirmPassword) {
      toast.error('Passwords do not match! ❌');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      // Backend එකට දත්ත යැවීම
      const { data } = await API.post('/users', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
      });

      // සාර්ථක වූ පසු LocalStorage එකේ තැන්පත් කිරීම
      localStorage.setItem('userInfo', JSON.stringify(data));

      if (data.role === 'vendor') {
        toast.success('Vendor account created! Please complete setup. 🏢');
        navigate('/vendor-setup');
      } else {
        toast.success('Welcome to LakTravelers! 🎉');
        navigate('/');
      }

      // Navbar Refresh කිරීමට අවශ්‍යයි
      window.location.reload();
    } catch (error) {
      console.error("Register Error:", error);
      // ⚠️ මෙහිදී Backend එකෙන් එන 500 Error එකට හේතුව පෙන්වයි
      toast.error(error.response?.data?.message || 'Server error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50 p-4 pt-10">
      <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden max-w-5xl w-full flex flex-col md:flex-row mt-4 border border-gray-100">

        {/* LEFT: FORM SECTION */}
        <div className="w-full md:w-1/2 p-8 md:p-14">
          <div className="mb-10">
            <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">
              Create Account 🚀
            </h2>
            <p className="text-slate-500 font-medium">
              Join LakTravelers and explore the beauty of Sri Lanka
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-400 mb-3 uppercase tracking-widest">
                Registering as:
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'user' })}
                  className={`py-4 rounded-2xl font-bold border-2 transition-all duration-300
                    ${formData.role === 'user'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xl scale-[1.02]'
                      : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'}
                  `}
                >
                   Traveler
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'vendor' })}
                  className={`py-4 rounded-2xl font-bold border-2 transition-all duration-300
                    ${formData.role === 'vendor'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xl scale-[1.02]'
                      : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'}
                  `}
                >
                   Vendor
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="group">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              />

              <input
                type="password"
                name="password"
                placeholder="Create Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-2xl font-black text-lg text-white transition-all shadow-xl transform active:scale-95
                ${isLoading
                  ? 'bg-slate-300 cursor-not-allowed'
                  : formData.role === 'vendor'
                    ? 'bg-slate-900 hover:bg-black shadow-slate-900/20'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'}
              `}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                  Processing...
                </span>
              ) : (
                formData.role === 'vendor' ? 'Register as Vendor' : 'Create My Account'
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-sm font-medium text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>

        {/* RIGHT: IMAGE SECTION */}
        <div className="hidden md:block w-1/2 relative">
          <img
            src={registerImage}
            alt="Sigiriya Sri Lanka"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex flex-col justify-end p-16 text-white">
            <h3 className="text-4xl font-black mb-4 leading-tight">Your Adventure<br/>Begins Here.</h3>
            <p className="text-slate-200 text-lg font-medium opacity-90 leading-relaxed">
              Join thousands of travelers exploring the paradise island of Sri Lanka. 🏝️
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;