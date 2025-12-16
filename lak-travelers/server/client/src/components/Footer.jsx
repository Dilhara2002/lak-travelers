import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white pt-10 pb-6 mt-auto">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Column 1: Logo & Info */}
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
              <span>🌍</span> ලක් Travelers 🇱🇰
            </h2>
            <p className="text-blue-200 text-sm leading-relaxed">
              Experience the best of Sri Lanka with us. We provide luxury hotels, curated tours, and reliable vehicle rentals for your perfect journey.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-yellow-400">Quick Links</h3>
            <ul className="space-y-2 text-blue-200 text-sm">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/hotels" className="hover:text-white transition">Hotels</Link></li>
              <li><Link to="/tours" className="hover:text-white transition">Tour Packages</Link></li>
              <li><Link to="/vehicles" className="hover:text-white transition">Vehicle Rentals</Link></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-yellow-400">Support</h3>
            <ul className="space-y-2 text-blue-200 text-sm">
              <li><Link to="/my-bookings" className="hover:text-white transition">My Bookings</Link></li>
              <li><Link to="/profile" className="hover:text-white transition">User Profile</Link></li>
              <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-yellow-400">Contact Us</h3>
            <ul className="space-y-2 text-blue-200 text-sm">
              <li>📍 123, Galle Road, Colombo 03</li>
              <li>📞 +94 77 123 4567</li>
              <li>✉️ support@laktravelers.com</li>
            </ul>
            
            {/* Social Icons (Placeholder) */}
            <div className="flex gap-4 mt-4">
              <span className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600">f</span>
              <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-400">t</span>
              <span className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-pink-500">in</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-800 pt-6 text-center text-sm text-blue-300">
          <p>&copy; {new Date().getFullYear()} Lak Travelers 🇱🇰. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;