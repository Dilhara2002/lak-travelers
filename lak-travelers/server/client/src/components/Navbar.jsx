import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";
import logoImage from "../assets/logo.png"; 

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("userInfo"));
  
  // State for Desktop Profile Dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // 👇 State for Mobile Menu (Hamburger)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const closeDropdown = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false); // Close mobile menu on click too
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md shadow-sm transition-all duration-300">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
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

        {/* ---------------- DESKTOP NAV LINKS (Hidden on Mobile) ---------------- */}
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

        {/* ---------------- RIGHT SIDE (Auth + Mobile Toggle) ---------------- */}
        <div className="flex items-center gap-3">
          
          {user ? (
            // ✅ USER LOGGED IN (Show Avatar on both Desktop & Mobile)
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 rounded-full p-1 pr-3 bg-gray-50 border border-gray-200 hover:bg-white hover:shadow-md transition duration-200 focus:outline-none"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm shadow-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                {/* Hide name on small mobile, show on larger screens */}
                <span className="hidden sm:block text-sm font-bold text-gray-700 max-w-[100px] truncate">{user.name}</span>
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
                  <div className="absolute right-0 z-20 mt-3 w-64 origin-top-right rounded-xl border border-gray-100 bg-white shadow-xl ring-1 ring-black/5 animate-fade-in-up overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide mt-0.5">{user.role}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                    </div>
                    <div className="p-2">
                      {(user.role === "vendor" || user.role === "admin") && (
                        <Link to="/dashboard" onClick={closeDropdown} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
                           Dashboard
                        </Link>
                      )}
                      {user.role === "user" && (
                        <Link to="/my-bookings" onClick={closeDropdown} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
                           My Bookings
                        </Link>
                      )}
                      <Link to="/profile" onClick={closeDropdown} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
                         My Profile
                      </Link>
                      <div className="my-1 h-px bg-gray-100" />
                      <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition">
                         Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            // ❌ USER LOGGED OUT
            // On Desktop: Show Buttons. On Mobile: Hide them (move to menu)
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login" className="rounded-full px-5 py-2 text-sm font-bold text-gray-600 hover:text-blue-600 transition">Log In</Link>
              <Link to="/register" className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-blue-700 hover:shadow-lg transition-transform hover:-translate-y-0.5">Sign Up</Link>
            </div>
          )}

          {/* 👇 MOBILE MENU BUTTON (Hamburger) */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none transition"
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ---------------- MOBILE MENU DROPDOWN ---------------- */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-4 pb-6 shadow-lg animate-fade-in-down">
          <div className="flex flex-col space-y-4">
            {["Home", "Hotels", "Tours", "Vehicles"].map((item) => {
              const path = item === "Home" ? "/" : `/${item.toLowerCase()}`;
              const isActive = location.pathname === path;
              return (
                <Link
                  key={item}
                  to={path}
                  onClick={closeDropdown}
                  className={`text-lg font-bold px-4 py-2 rounded-lg transition-colors ${
                    isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {item}
                </Link>
              );
            })}

            {/* Mobile Auth Buttons (Only if logged out) */}
            {!user && (
              <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 px-2">
                <Link 
                  to="/login" 
                  onClick={closeDropdown}
                  className="w-full text-center rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
                >
                  Log In
                </Link>
                <Link 
                  to="/register" 
                  onClick={closeDropdown}
                  className="w-full text-center rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;