import { useState, useEffect } from 'react';
import API from '../services/api'; // ✅ නිවැරදි Path එක (එක තිතයි අඩු කළේ)
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  // 1. Page එක Load වෙනකොටම User Data ගන්නවා
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await API.get('/users/profile');
        setName(data.name);
        setEmail(data.email);
      } catch (error) {
        console.error(error);
        // Error එකක් ආවොත් (Token Expire නම්) Login එකට යවන්න
        // navigate('/login');
      }
    };
    fetchUserData();
  }, []);

  // 2. Update Submit කරන Function එක
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match! ❌");
      return;
    }

    try {
      const { data } = await API.put('/users/profile', {
        name,
        password, 
      });
      
      // LocalStorage එකේ නම Update කරනවා
      localStorage.setItem('userInfo', JSON.stringify(data));
      setMessage("Profile Updated Successfully! ✅");
      setPassword('');
      setConfirmPassword('');
      // Page එක reload කරන්න පුළුවන් නම update වෙන්න
      window.location.reload();
    } catch (error) {
      setMessage("Update Failed ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">User Profile 👤</h2>
        
        {message && (
          <div className={`p-3 mb-4 rounded ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" 
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">Email Address (Cannot Change)</label>
            <input 
              type="email" 
              value={email} 
              disabled 
              className="w-full p-2 border rounded bg-gray-200 cursor-not-allowed" 
            />
          </div>

          <div className="border-t pt-4 mt-4">
            <p className="text-sm text-gray-500 mb-2">Change Password (Leave blank to keep current)</p>
            
            <div className="mb-3">
              <label className="block text-gray-700 text-sm font-bold mb-1">New Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" 
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-1">Confirm New Password</label>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" 
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 transition mt-4">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;