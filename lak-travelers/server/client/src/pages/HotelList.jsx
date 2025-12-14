import { useEffect, useState } from 'react';
import API from '../services/api';
import HotelCard from '../components/cards/HotelCard';
import { Link } from 'react-router-dom';

const HotelList = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState(''); // Search වචනය

  // හෝටල් Load කරන Function එක
  const fetchHotels = async (searchKeyword = '') => {
    setLoading(true);
    try {
      // Backend එකට keyword එක යවනවා
      const { data } = await API.get(`/hotels?keyword=${searchKeyword}`);
      setHotels(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching hotels:", error);
      setLoading(false);
    }
  };

  // පිටුව Load වෙනකොටම හෝටල් ටික ගන්න
  useEffect(() => {
    fetchHotels();
  }, []);

  // Search Button එක ඔබනකොට වැඩ කරන කොටස
  const handleSearch = (e) => {
    e.preventDefault();
    fetchHotels(keyword); // අලුත් වචනයට අදාළව හොයන්න
  };

  return (
    <div className="container mx-auto p-6">
      
      {/* Header Section with Search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Explore Hotels 🏨</h1>
        
        {/* 👇 Search Bar */}
        <form onSubmit={handleSearch} className="flex w-full md:w-1/2 gap-2">
          <input 
            type="text" 
            placeholder="Search by hotel name or location..." 
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button 
            type="submit" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            Search
          </button>
        </form>

        <Link to="/add-hotel" className="bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700 font-medium shadow-md">
          + Add Hotel
        </Link>
      </div>

      {/* Loading & No Results */}
      {loading ? (
        <div className="text-center py-20 text-xl text-gray-500">Searching hotels... ⏳</div>
      ) : hotels.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <h3 className="text-xl text-gray-600">No hotels found for "{keyword}" 😕</h3>
          <button onClick={() => { setKeyword(''); fetchHotels(''); }} className="mt-4 text-blue-600 underline">
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {hotels.map((hotel) => (
            <HotelCard key={hotel._id} hotel={hotel} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HotelList;