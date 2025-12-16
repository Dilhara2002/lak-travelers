import { useEffect, useState } from 'react';
import API from '../services/api';
import VehicleCard from '../components/cards/VehicleCard';
import { Link } from 'react-router-dom';

const VehicleList = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const user = JSON.parse(localStorage.getItem("userInfo"));

    const filteredVehicles = vehicles.filter((vehicle) =>
        vehicle.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Backend එකෙන් Vehicles ගන්න function එක
    const fetchVehicles = async () => {
        try {
            const { data } = await API.get('/vehicles');
            setVehicles(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching vehicles:", error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this vehicle? 🗑️")) {
            try {
                await API.delete(`/vehicles/${id}`);
                setVehicles(vehicles.filter((v) => v._id !== id));
                alert("Vehicle Deleted Successfully!");
            } catch (error) {
                console.error(error);
                alert("Failed to delete. You are not authorized.");
            }
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    

    return (
        <div className="container mx-auto p-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Rent a Vehicle 🚗</h1>
                    <p className="text-gray-500 mt-1">Find comfortable vehicles with experienced drivers.</p>
                </div>

                {/* Register Vehicle Button - Only for Vendor/Admin */}
                {user && (user.role === 'vendor' || user.role === 'admin') && (
                    <Link to="/add-vehicle" className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 font-medium shadow-md">
                        + Register Vehicle
                    </Link>
                )}
            </div>

            {/* 👇 Search Bar Code Block */}
            <div className="mb-8">
                <div className="relative max-w-lg w-full">
                    <input
                        type="text"
                        placeholder="Search... 🔍"
                        className="w-full p-4 pl-5 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Loading & Grid */}
            {loading ? (
                <div className="text-center py-20 text-xl text-gray-500">Loading vehicles... ⏳</div>
            ) : vehicles.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <h3 className="text-xl text-gray-600">No vehicles available yet 😕</h3>
                    <p className="text-gray-400 mt-2">Be the first to register a vehicle!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {vehicles.map((vehicle) => (
                        <VehicleCard key={vehicle._id} vehicle={vehicle} />
                    ))}
                </div>
            )}

            {filteredVehicles.map((vehicle) => (
                <div key={vehicle._id} className="relative group">
                    <VehicleCard vehicle={vehicle} />

                    {/* 👇 Delete Button Logic */}
                    {user && (user.role === 'admin' || user._id === vehicle.user) && (
                        <button
                            onClick={() => handleDelete(vehicle._id)}
                            className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 z-10"
                            title="Delete Vehicle"
                        >
                            🗑️
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default VehicleList;