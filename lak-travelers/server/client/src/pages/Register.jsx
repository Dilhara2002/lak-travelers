import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { toast } from 'react-toastify';
import registerImage from '../assets/Register.jpg';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });

  const [isLoading, setIsLoading] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  /* ===============================
     Redirect if already logged in
  ================================ */
  useEffect(() => {
    if (userInfo) {
      if (userInfo.role === 'vendor' && !userInfo.isApproved) {
        navigate('/vendor-setup');
      } else {
        navigate('/');
      }
    }
  }, [userInfo, navigate]);

  /* ===============================
     Handle input change
  ================================ */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ===============================
     Handle register submit
  ================================ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, role } = formData;

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await API.post('/users', {
        name,
        email,
        password,
        role,
      });

      localStorage.setItem('userInfo', JSON.stringify(data));

      if (data.role === 'vendor') {
        toast.success('Account created! Please complete vendor setup.');
        navigate('/vendor-setup');
      } else {
        toast.success('Registration successful! 🎉');
        navigate('/');
      }

      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl w-full flex flex-col md:flex-row">

        {/* LEFT: FORM */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Create Account 🚀
          </h2>
          <p className="text-gray-500 mb-6">
            Join LakTravelers and explore Sri Lanka
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* ROLE SELECTION */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'user' })}
                  className={`py-3 rounded-xl font-semibold border transition
                    ${formData.role === 'user'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white border-gray-300 text-gray-600'}
                  `}
                >
                   Traveler
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'vendor' })}
                  className={`py-3 rounded-xl font-semibold border transition
                    ${formData.role === 'vendor'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white border-gray-300 text-gray-600'}
                  `}
                >
                   Vendor
                </button>
              </div>
            </div>

            {/* NAME */}
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />

            {/* EMAIL */}
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />

            {/* PASSWORD */}
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />

            {/* CONFIRM PASSWORD */}
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-xl font-bold text-white transition
                ${isLoading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : formData.role === 'vendor'
                    ? 'bg-slate-900 hover:bg-slate-800'
                    : 'bg-blue-600 hover:bg-blue-700'}
              `}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>

        {/* RIGHT: IMAGE */}
        <div className="hidden md:block w-1/2 relative">
          <img
            src={registerImage}
            alt="Sri Lanka Travel"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-10 text-white">
            <h3 className="text-3xl font-bold">Start Your Journey</h3>
            <p className="text-gray-200 mt-2">
              Discover hotels, tours & adventures across Sri Lanka 🌴
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
