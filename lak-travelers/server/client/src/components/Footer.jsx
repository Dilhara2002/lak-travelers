import { Link } from 'react-router-dom';
import logoImage from "../assets/logo.png"; 

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-10 md:pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12 text-center md:text-left">
          
          {/* Column 1: Brand & Identity */}
          <div className="space-y-4 flex flex-col items-center md:items-start">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="h-10 w-10 overflow-hidden rounded-full border border-gray-100 shadow-sm">
                <img 
                  src={logoImage} 
                  alt="Lak Travelers" 
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src="https://via.placeholder.com/50?text=LT"
                  }}
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
              Experience the pearl of the Indian Ocean. We provide luxury hotels, curated tours, and reliable vehicle rentals across Sri Lanka.
            </p>
          </div>

          {/* Column 2: Explore Routes */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Explore</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link to="/" className="hover:text-blue-600 transition duration-200">Home</Link></li>
              <li><Link to="/hotels" className="hover:text-blue-600 transition duration-200">Luxury Hotels</Link></li>
              <li><Link to="/tours" className="hover:text-blue-600 transition duration-200">Tour Packages</Link></li>
              <li><Link to="/vehicles" className="hover:text-blue-600 transition duration-200">Vehicle Rentals</Link></li>
            </ul>
          </div>

          {/* Column 3: Company & Management */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link to="/profile" className="hover:text-blue-600 transition duration-200">My Profile</Link></li>
              <li><Link to="/my-bookings" className="hover:text-blue-600 transition duration-200">Manage Bookings</Link></li>
              <li><Link to="/about" className="hover:text-blue-600 transition duration-200">About Us</Link></li>
              <li><Link to="/privacy" className="hover:text-blue-600 transition duration-200">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact & Social Presence */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-gray-500 mb-6">
              <li className="flex items-start gap-3 justify-center md:justify-start">
                <span className="text-blue-600">📍</span>
                <span>123, Galle Road, Colombo 03,<br/>Western Province, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <span className="text-blue-600">📞</span>
                <span>+94 77 123 4567</span>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <span className="text-blue-600">✉️</span>
                <span>hello@laktravelers.com</span>
              </li>
            </ul>
            
            {/* Social Media Links - FIXED SVG PATHS */}
            <div className="flex gap-4 justify-center md:justify-start">
              {/* Facebook */}
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              {/* Instagram - CLEANED PATH */}
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-pink-600 hover:bg-pink-600 hover:text-white transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8.25a3.25 3.25 0 110-6.5 3.25 3.25 0 010 6.5zm5.5-8.75a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Links */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 text-center md:text-left">
          <p>&copy; {new Date().getFullYear()} Lak Travelers 🇱🇰. Proudly Explore Sri Lanka.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-blue-600 transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-blue-600 transition">Terms of Use</Link>
            <Link to="/sitemap" className="hover:text-blue-600 transition">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;