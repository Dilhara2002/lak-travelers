import { Link } from 'react-router-dom';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  if (!user || (user.role !== 'vendor' && user.role !== 'admin')) {
    return <div className="text-center mt-20 text-red-500 text-xl">Access Denied 🚫</div>;
  }

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard ⚙️</h1>
      <p className="text-gray-600 mb-8">Welcome back, {user.name}! Manage your services here.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Manage Hotels */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition">
          <div className="text-4xl mb-4">🏨</div>
          <h2 className="text-xl font-bold mb-2">Manage Hotels</h2>
          <p className="text-gray-500 mb-4 text-sm">Add new hotels or manage existing listings.</p>
          <div className="flex flex-col gap-2">
            <Link to="/add-hotel" className="bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 font-bold">+ Add New Hotel</Link>
            <Link to="/hotels" className="text-blue-600 text-center py-2 border border-blue-600 rounded hover:bg-blue-50">View All Hotels</Link>
          </div>
        </div>

        {/* Manage Tours */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition">
          <div className="text-4xl mb-4">🚐</div>
          <h2 className="text-xl font-bold mb-2">Manage Tours</h2>
          <p className="text-gray-500 mb-4 text-sm">Create tour packages and manage destinations.</p>
          <div className="flex flex-col gap-2">
            <Link to="/add-tour" className="bg-green-600 text-white text-center py-2 rounded hover:bg-green-700 font-bold">+ Add New Tour</Link>
            <Link to="/tours" className="text-green-600 text-center py-2 border border-green-600 rounded hover:bg-green-50">View All Tours</Link>
          </div>
        </div>

        {/* Manage Vehicles */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition">
          <div className="text-4xl mb-4">🚗</div>
          <h2 className="text-xl font-bold mb-2">Manage Vehicles</h2>
          <p className="text-gray-500 mb-4 text-sm">Register vehicles and manage drivers.</p>
          <div className="flex flex-col gap-2">
            <Link to="/add-vehicle" className="bg-purple-600 text-white text-center py-2 rounded hover:bg-purple-700 font-bold">+ Register Vehicle</Link>
            <Link to="/vehicles" className="text-purple-600 text-center py-2 border border-purple-600 rounded hover:bg-purple-50">View All Vehicles</Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;