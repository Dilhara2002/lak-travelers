import React from 'react';
import { Link } from 'react-router-dom';

const TourCard = ({ tour }) => {

    // Image URL හදාගැනීම (Hotel එකේ වගේමයි)
    const getImageUrl = (imagePath) => {
        if (!imagePath) return "https://via.placeholder.com/300";
        if (imagePath.startsWith("http")) return imagePath;
        const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
        return `http://localhost:5001${cleanPath}`;
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">

            {/* Image */}
            <div className="relative h-56 overflow-hidden">
                <img
                    src={getImageUrl(tour.image)}
                    alt={tour.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-0 right-0 bg-green-600 text-white px-3 py-1 rounded-bl-lg font-bold text-sm">
                    {tour.duration} ⏳
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{tour.name}</h3>

                <p className="text-gray-500 text-sm flex items-center mb-2">
                    📍 <span className="ml-1 truncate">{tour.destinations}</span>
                </p>

                <p className="text-gray-600 text-sm line-clamp-2 mb-4 h-10">
                    {tour.description}
                </p>

                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div>
                        <span className="text-xs text-gray-400">Price per person</span>
                        <p className="text-green-600 font-bold text-lg">LKR {tour.price}</p>
                    </div>

                    {/* Link to Tour Details Page */}
                    <Link
                        to={`/tours/${tour._id}`}
                        className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 text-sm font-medium transition-colors shadow-lg"
                    >
                        View Package
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TourCard;