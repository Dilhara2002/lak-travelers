import { Link } from "react-router-dom";
import logoImage from "../assets/logo.png"; 

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-10 md:pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12 text-center md:text-left">
          
          {/* Column 1: Brand */}
          <div className="space-y-4 flex flex-col items-center md:items-start">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="h-10 w-10 overflow-hidden rounded-full border border-gray-100 shadow-sm">
                <img 
                  src={logoImage} 
                  alt="LakTravelers" 
                  className="h-full w-full object-cover"
                  onError={(e) => {e.target.onerror = null; e.target.src="https://via.placeholder.com/50?text=LT"}}
                />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-lg font-extrabold tracking-tight text-gray-900 leading-none">
                  Lak<span className="text-blue-600">Travelers</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 leading-none mt-1">
                  Explore Sri Lanka
                </span>
              </div>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
              Experience the pearl of the Indian Ocean. We provide luxury hotels, curated tours, and reliable vehicle rentals.
            </p>
          </div>

          {/* Column 2: Explore */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Explore</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link to="/" className="hover:text-blue-600 transition">Home</Link></li>
              <li><Link to="/hotels" className="hover:text-blue-600 transition">Luxury Hotels</Link></li>
              <li><Link to="/tours" className="hover:text-blue-600 transition">Tour Packages</Link></li>
              <li><Link to="/vehicles" className="hover:text-blue-600 transition">Vehicle Rentals</Link></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link to="/profile" className="hover:text-blue-600 transition">My Profile</Link></li>
              <li><Link to="/my-bookings" className="hover:text-blue-600 transition">Manage Bookings</Link></li>
              <li><a href="#" className="hover:text-blue-600 transition">About Us</a></li>
              <li><a href="#" className="hover:text-blue-600 transition">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Column 4: Contact & Social */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-gray-500 mb-6">
              <li className="flex items-start gap-3 justify-center md:justify-start">
                <span className="mt-1">📍</span>
                <span>123, Galle Road,<br/>Colombo 03, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <span>📞</span>
                <span>+94 77 123 4567</span>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <span>✉️</span>
                <span>hello@laktravelers.com</span>
              </li>
            </ul>
            
            {/* Social Icons (Fixed) */}
            <div className="flex gap-4 justify-center md:justify-start">
              <a href="#" className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-400 hover:bg-blue-400 hover:text-white transition">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 hover:bg-pink-600 hover:text-white transition">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 text-center md:text-left">
          <p>&copy; {new Date().getFullYear()} Lak Travelers 🇱🇰. All Rights Reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-blue-600 transition">Privacy</a>
            <a href="#" className="hover:text-blue-600 transition">Terms</a>
            <a href="#" className="hover:text-blue-600 transition">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;