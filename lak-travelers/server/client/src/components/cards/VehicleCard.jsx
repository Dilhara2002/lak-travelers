import React from 'react';
import { Link } from 'react-router-dom';

const VehicleCard = ({ vehicle }) => {

    // Image URL Helper
    // ...
    const getImageUrl = (imagePath) => {
        if (!imagePath) return "https://via.placeholder.com/300";
        if (imagePath.startsWith("http")) return imagePath;
        const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
        return `http://localhost:5001${cleanPath}`;
    };

    return (
        <div className="...">
            {/* Image Section */}
            <div className="relative h-56 overflow-hidden">
                <img
                    // 👇 මෙතන වෙනස් කළා: images[0] (පළවෙනි පින්තූරය)
                    src={getImageUrl(vehicle.images && vehicle.images.length > 0 ? vehicle.images[0] : "")}
                    alt={vehicle.vehicleModel}
                    className="w-full h-full object-cover ..."
                />
                {/* ... */}
            </div>
            {/* ... */}

            {/* Details Section */}
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{vehicle.vehicleModel}</h3>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold border">{vehicle.licensePlate}</span>
                </div>

                <p className="text-gray-500 text-sm mb-3 flex items-center gap-2">
                    👨‍✈️ Driver: <span className="font-semibold text-gray-700">{vehicle.driverName}</span>
                </p>

                <div className="flex gap-4 mb-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">👥 {vehicle.capacity} Seats</span>
                    <span className="flex items-center gap-1">📞 {vehicle.contactNumber}</span>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div>
                        <span className="text-xs text-gray-400">Price per Day</span>
                        <p className="text-blue-600 font-bold text-lg">LKR {vehicle.pricePerDay}</p>
                    </div>

                    <Link
                        to={`/vehicles/${vehicle._id}`}
                        className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 text-sm font-medium transition-colors"
                    >
                        View Details ➡️
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default VehicleCard;