import { useEffect, useState } from 'react';
import API from '../services/api';
import TourCard from '../components/cards/TourCard';
import { Link } from 'react-router-dom';

const TourList = () => {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    
    // User දත්ත ලබා ගැනීම
    const user = JSON.parse(localStorage.getItem("userInfo"));

    // Backend එකෙන් Tours ගන්න function එක
    const fetchTours = async () => {
        try {
            const { data } = await API.get('/tours');
            setTours(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching tours:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTours();
    }, []);

    // Delete Function
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this tour? 🗑️")) {
            try {
                await API.delete(`/tours/${id}`);
                setTours(tours.filter((t) => t._id !== id));
                alert("Tour Deleted Successfully!");
            } catch (error) {
                console.error(error);
                alert("Failed to delete. You are not authorized.");
            }
        }
    };

    // Filter Logic (Search කිරීම සඳහා)
    const filteredTours = tours.filter((tour) =>
        tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.destinations.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto p-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Explore Tour Packages 🚐</h1>
                    <p className="text-gray-500 mt-1">Discover the beauty of Sri Lanka with our curated tours.</p>
                </div>

                {/* Add Tour Button - Only for Vendor/Admin */}
                {user && (user.role === 'vendor' || user.role === 'admin') && (
                    <Link to="/add-tour" className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 font-medium shadow-md">
                        + Add Tour
                    </Link>
                )}
            </div>

            {/* Search Bar */}
            <div className="mb-8">
                <div className="relative max-w-lg w-full">
                    <input
                        type="text"
                        placeholder="Search packages... 🔍"
                        className="w-full p-4 pl-5 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Loading & Grid */}
            {loading ? (
                <div className="text-center py-20 text-xl text-gray-500">Loading tours... ⏳</div>
            ) : filteredTours.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-lg">
                    <h3 className="text-xl text-gray-600">No tours found matching "{searchTerm}" 😕</h3>
                </div>
            ) : (
                // 👇 Grid එක මෙතනින් පටන් ගන්නවා
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* 👇 filteredTours පාවිච්චි කරන්න (tours.map නෙවෙයි) */}
                    {filteredTours.map((tour) => (
                        <div key={tour._id} className="relative group">
                            
                            {/* Card Component */}
                            <TourCard tour={tour} />

                            {/* 👇 Edit & Delete Buttons Logic */}
                            {/* මෙතන .toString() දාන්න අමතක කරන්න එපා ID compare කරද්දී */}
                            {user && (user.role === 'admin' || (tour.user && user._id === tour.user.toString())) && (
                                <>
                                    {/* Edit Button */}
                                    <Link
                                        to={`/edit-tour/${tour._id}`}
                                        className="absolute top-2 right-12 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 z-10 transition transform hover:scale-110"
                                        title="Edit Tour"
                                    >
                                        ✏️
                                    </Link>
                                    
                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleDelete(tour._id)}
                                        className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 z-10 transition transform hover:scale-110"
                                        title="Delete Tour"
                                    >
                                        🗑️
                                    </button>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TourList;