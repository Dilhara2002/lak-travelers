import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";
import logoImage from "../assets/logo.png"; 

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await API.post("/users/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("userInfo");
      navigate("/login");
      window.location.reload();
    }
  };

  const closeDropdown = () => setIsDropdownOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md shadow-sm transition-all duration-300">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* BRAND LOGO */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="h-12 w-12 overflow-hidden rounded-full border border-gray-100 shadow-sm group-hover:shadow-md transition">
            <img 
              src={logoImage} 
              alt="LakTravelers Logo" 
              className="h-full w-full object-cover"
              onError={(e) => {e.target.onerror = null; e.target.src="https://via.placeholder.com/50?text=LT"}}
            />
          </div>
          
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-gray-900 leading-none">
              Lak<span className="text-blue-600">Travelers</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 leading-none mt-1">
              Explore Sri Lanka
            </span>
          </div>
        </Link>

        {/* CENTER NAV LINKS */}
        <div className="hidden md:flex items-center space-x-8">
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

        {/* AUTH / USER SECTION */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              
              {/* 👇 PROFILE BUTTON WITH ARROW */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 rounded-full p-1 pr-3 bg-gray-50 border border-gray-200 hover:bg-white hover:shadow-md transition duration-200 focus:outline-none"
              >
                {/* Avatar */}
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm shadow-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>

                {/* 👇 Down Arrow Icon (Rotates on Click) */}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={2.5} 
                  stroke="currentColor" 
                  className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {/* Click Overlay */}
              {isDropdownOpen && (
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsDropdownOpen(false)}
                />
              )}

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 z-20 mt-3 w-64 origin-top-right rounded-xl border border-gray-100 bg-white shadow-xl ring-1 ring-black/5 animate-fade-in-up overflow-hidden">
                  
                  {/* User Info Header inside Dropdown */}
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide mt-0.5">
                      {user.role}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {user.email}
                    </p>
                  </div>

                  <div className="p-2">
                    {(user.role === "vendor" || user.role === "admin") && (
                      <Link
                        to="/dashboard"
                        onClick={closeDropdown}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25z" />
                        </svg>
                        Dashboard
                      </Link>
                    )}

                    {user.role === "user" && (
                      <Link
                        to="/my-bookings"
                        onClick={closeDropdown}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v4.5c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-4.5c0-.621-.504-1.125-1.125-1.125H3.375z" />
                        </svg>
                        My Bookings
                      </Link>
                    )}

                    <Link
                      to="/profile"
                      onClick={closeDropdown}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                      My Profile
                    </Link>

                    <div className="my-1 h-px bg-gray-100" />

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // ❌ Logged Out Buttons
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="rounded-full px-5 py-2 text-sm font-bold text-gray-600 hover:text-blue-600 transition"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-blue-700 hover:shadow-lg transition-transform hover:-translate-y-0.5"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;