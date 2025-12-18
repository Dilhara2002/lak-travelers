import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";
import logoImage from "../assets/logo.png"; 

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // LocalStorage එකෙන් User තොරතුරු ලබා ගැනීම
  // සටහන: මෙය පසුව Redux හෝ Context API එකකට මාරු කිරීම වඩාත් සුදුසුයි
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("userInfo")));

  // පිටුව මාරු වන සෑම අවස්ථාවකම User තොරතුරු අලුත් දැයි පරීක්ෂා කරයි
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("userInfo")));
  }, [location]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /**
   * ලොග් අවුට් වීමේ ක්‍රියාවලිය
   */
  const handleLogout = async () => {
    try {
      // Backend එකට Logout request එක යවා Cookie එක ඉවත් කරයි
      await API.post("/users/logout");
      
      // LocalStorage එකෙන් දත්ත ඉවත් කරයි
      localStorage.removeItem("userInfo");
      
      // තොරතුරු reset කර ලොගින් පිටුවට යවයි
      setIsDropdownOpen(false);
      navigate("/login");
      window.location.reload(); // Auth state එක සම්පූර්ණයෙන්ම clear කිරීමට
    } catch (error) {
      console.error("Logout error:", error);
      // Backend එක අවුල් වුවත් local data අනිවාර්යයෙන් අයින් කරයි
      localStorage.removeItem("userInfo");
      navigate("/login");
    }
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md shadow-sm transition-all duration-300">
      <div className="mx-auto flex h-20 max-w-full items-center px-6 sm:px-10 lg:px-16">
        
        {/* BRAND LOGO */}
        <Link to="/" className="flex items-center gap-3 group z-50">
          <div className="h-10 w-10 md:h-12 md:w-12 overflow-hidden rounded-full border border-gray-100 shadow-sm group-hover:shadow-md transition">
            <img 
              src={logoImage} 
              alt="LakTravelers Logo" 
              className="h-full w-full object-cover"
              onError={(e) => {e.target.onerror = null; e.target.src="https://via.placeholder.com/50?text=LT"}}
            />
          </div>
          
          <div className="flex flex-col">
            <span className="text-lg md:text-xl font-extrabold tracking-tight text-gray-900 leading-none">
              Lak<span className="text-blue-600">Travelers</span>
            </span>
            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 leading-none mt-1">
              Explore Sri Lanka
            </span>
          </div>
        </Link>

        {/* NAVIGATION LINKS */}
        <div className="hidden md:flex items-center space-x-10 ml-auto mr-12">
          {["Home", "Hotels", "Tours", "Vehicles"].map((item) => {
            const path = item === "Home" ? "/" : `/${item.toLowerCase()}`;
            const isActive = location.pathname === path;

            return (
              <Link
                key={item}
                to={path}
                className={`relative text-sm font-bold transition-colors py-2 ${
                  isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                } group`}
              >
                {item}
                <span
                  className={`absolute left-0 bottom-0 h-0.5 w-full bg-blue-600 transition-transform origin-left duration-300 ${
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {/* AUTH SECTION */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 rounded-full p-1 pr-3 bg-gray-50 border border-gray-200 hover:bg-white hover:shadow-md transition duration-200 focus:outline-none"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm shadow-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm font-bold text-gray-700 max-w-[120px] truncate">{user.name}</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" 
                  className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                  <div className="absolute right-0 z-20 mt-3 w-64 origin-top-right rounded-xl border border-gray-100 bg-white shadow-xl ring-1 ring-black/5 overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide mt-0.5">{user.role}</p>
                    </div>
                    <div className="p-2">
                      {(user.role === "vendor" || user.role === "admin") && (
                        <Link to="/dashboard" onClick={closeDropdown} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">Dashboard</Link>
                      )}
                      {user.role === "user" && (
                        <Link to="/my-bookings" onClick={closeDropdown} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">My Bookings</Link>
                      )}
                      <Link to="/profile" onClick={closeDropdown} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">My Profile</Link>
                      <div className="my-1 h-px bg-gray-100" />
                      <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition text-left">Logout</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition">Log In</Link>
              <Link to="/register" className="rounded-full bg-blue-600 px-7 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-700 hover:shadow-lg transition-all hover:-translate-y-0.5">Sign Up</Link>
            </div>
          )}

          {/* MOBILE HAMBURGER */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-4 pb-6 shadow-lg">
          <div className="flex flex-col space-y-4">
            {["Home", "Hotels", "Tours", "Vehicles"].map((item) => (
              <Link key={item} to={item === "Home" ? "/" : `/${item.toLowerCase()}`} onClick={closeDropdown} className="text-lg font-bold px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50">{item}</Link>
            ))}
            {!user && (
              <div className="flex flex-col gap-3 pt-4 border-t border-gray-50">
                <Link to="/login" onClick={closeDropdown} className="text-center py-3 text-gray-600 font-bold">Log In</Link>
                <Link to="/register" onClick={closeDropdown} className="text-center py-3 bg-blue-600 text-white rounded-xl font-bold">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;