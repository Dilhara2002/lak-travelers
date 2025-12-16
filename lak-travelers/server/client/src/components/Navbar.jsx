import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

const Navbar = () => {
  const navigate = useNavigate();

  // LocalStorage එකෙන් user info ගන්නවා
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const handleLogout = async () => {
    try {
      await API.post("/users/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Backend error ආවත් Frontend logout කරවනවා
      localStorage.removeItem("userInfo");
      navigate("/login");
      window.location.reload();
    }
  };

  return (
    <nav className="bg-blue-600 p-4 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold flex items-center gap-2 hover:text-blue-100 transition"
        >
          <span>🌍</span> ලක් Travelers 🇱🇰
        </Link>

        {/* Navigation Links */}
        <div className="space-x-6 flex items-center">
          <Link to="/" className="hover:text-blue-200 font-medium transition">
            Home
          </Link>
          <Link to="/hotels" className="hover:text-blue-200 font-medium transition">
            Hotels
          </Link>
          <Link to="/tours" className="hover:text-blue-200 font-medium transition">
            Tours
          </Link>
          <Link to="/vehicles" className="hover:text-blue-200 font-medium transition">
            Vehicles
          </Link>

          {user ? (
            // ✅ Logged In State
            <div className="flex items-center gap-4">
              
              {/* Vendor / Admin Dashboard */}
              {(user.role === "vendor" || user.role === "admin") && (
                <Link
                  to="/dashboard"
                  className="bg-yellow-400 text-gray-900 px-3 py-1 rounded font-bold hover:bg-yellow-300 transition"
                >
                  Dashboard ⚙️
                </Link>
              )}

              {/* Normal User */}
              {user.role === "user" && (
                <Link
                  to="/my-bookings"
                  className="hover:text-yellow-300 font-medium transition"
                >
                  My Bookings
                </Link>
              )}

              {/* Profile */}
              <Link
                to="/profile"
                className="flex items-center gap-2 font-semibold text-yellow-300 border-l pl-4 border-blue-400 hover:text-white transition"
              >
                👤 {user.name} ({user.role})
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="bg-red-500 px-4 py-1.5 rounded-full text-sm font-bold hover:bg-red-600 shadow-md transition transform hover:scale-105"
              >
                Logout
              </button>
            </div>
          ) : (
            // ❌ Logged Out State
            <div className="flex items-center gap-4">
              <Link to="/login" className="hover:text-blue-200 font-medium transition">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-blue-600 px-4 py-2 rounded-full font-bold hover:bg-gray-100 shadow transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
