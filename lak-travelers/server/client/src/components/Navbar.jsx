import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

const Navbar = () => {
  const navigate = useNavigate();
  
  // LocalStorage එකෙන් user විස්තර ගන්නවා
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const handleLogout = async () => {
    try {
      await API.post("/users/logout"); // Backend logout
      localStorage.removeItem("userInfo"); // Frontend logout
      navigate("/login");
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="bg-blue-600 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          ලක් Travelers 🇱🇰
        </Link>

        {/* Links */}
        <div className="space-x-6 flex items-center">
          <Link to="/" className="hover:text-blue-200">Home</Link>
          <Link to="/hotels" className="hover:text-blue-200">Hotels</Link>

          {user ? (
            // User Login වී ඇත්නම් මේක පෙන්නනවා
            // කලින් තිබුණ "Hi, User" කොටස වෙනුවට මේක දාන්න:

<div className="flex items-center gap-4">
  <Link to="/my-bookings" className="text-white hover:text-yellow-300 font-medium">
    My Bookings
  </Link>
  <span className="font-semibold text-yellow-300 border-l pl-4 border-blue-400">
    Hi, {user.name}
  </span>
  <button 
    onClick={handleLogout} 
    className="bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-600 shadow-md transition"
  >
    Logout
  </button>
</div>
          ) : (
            // User Login වී නැත්නම් මේක පෙන්නනවා
            <>
              <Link to="/login" className="hover:text-blue-200">Login</Link>
              <Link to="/register" className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;