import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const Dashboard = () => {
  // Global Admin Stats
  const [adminStats, setAdminStats] = useState({
    usersCount: 0, vendorsCount: 0, bookingsCount: 0,
    hotelsCount: 0, toursCount: 0, vehiclesCount: 0, totalRevenue: 0
  });

  // Specific Vendor Stats
  const [vendorStats, setVendorStats] = useState({
    myHotels: 0,
    myTours: 0,
    myVehicles: 0
  });

  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("userInfo"));

  // Professional Color Palette
  const COLORS = ['#1e293b', '#3b82f6', '#10b981']; // Slate-900, Blue-500, Emerald-500

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user && user.role === 'admin') {
          const { data } = await API.get("/admin/stats");
          setAdminStats(data);
        } else if (user && user.role === 'vendor') {
          // Fetch Lists & Filter locally (Professional Pattern)
          const [hotelsRes, toursRes, vehiclesRes] = await Promise.all([
            API.get('/hotels'),
            API.get('/tours'),
            API.get('/vehicles')
          ]);

          const myHotels = hotelsRes.data.filter(h => h.user === user._id || (h.user && h.user._id === user._id)).length;
          const myTours = toursRes.data.filter(t => t.user === user._id || (t.user && t.user._id === user._id)).length;
          const myVehicles = vehiclesRes.data.filter(v => v.user === user._id || (v.user && v.user._id === user._id)).length;

          setVendorStats({ myHotels, myTours, myVehicles });
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Data for Charts
  const adminChartData = [
    { name: 'Hotels', count: adminStats.hotelsCount },
    { name: 'Tours', count: adminStats.toursCount },
    { name: 'Vehicles', count: adminStats.vehiclesCount },
  ];

  const vendorChartData = [
    { name: 'Hotels', count: vendorStats.myHotels },
    { name: 'Tours', count: vendorStats.myTours },
    { name: 'Vehicles', count: vendorStats.myVehicles },
  ];

  if (loading) return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-slate-800"></div>
    </div>
  );

  // --- REUSABLE COMPONENTS ---
  
  // 1. Stat Card Component (Clean & Professional)
  const StatCard = ({ title, value, icon, link, linkText, colorClass }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-md ${colorClass} bg-opacity-10 text-white`}>
          {icon}
        </div>
      </div>
      {link && (
        <div className="border-t border-gray-100 pt-3">
          <Link to={link} className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1">
            {linkText} <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </Link>
        </div>
      )}
    </div>
  );

  // ------------------------------------------------------------------
  // 🏢 VENDOR DASHBOARD
  // ------------------------------------------------------------------
  if (user.role === 'vendor') {
    return (
      <div className="min-h-screen bg-gray-50 pb-12 font-sans">
        
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 py-6 px-6 sm:px-8 mb-8">
           <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Vendor Overview</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your listings and performance.</p>
              </div>
              
              {/* Quick Actions Toolbar */}
              <div className="flex gap-3">
                <Link to="/add-hotel" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition">
                  + Add Hotel
                </Link>
                <Link to="/add-tour" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition">
                  + Add Tour
                </Link>
                <Link to="/add-vehicle" className="px-4 py-2 text-sm font-medium text-white bg-slate-800 border border-transparent rounded-md hover:bg-slate-900 transition">
                  + Add Vehicle
                </Link>
              </div>
           </div>
        </div>

        <div className="container mx-auto px-6 sm:px-8 space-y-8">
          
          {/* Service Category Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <StatCard 
              title="Active Hotels" 
              value={vendorStats.myHotels} 
              link="/hotels"
              linkText="Manage Hotels"
              colorClass="bg-blue-600"
              icon={<svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>}
            />

            <StatCard 
              title="Active Tours" 
              value={vendorStats.myTours} 
              link="/tours"
              linkText="Manage Tours"
              colorClass="bg-emerald-600"
              icon={<svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 7m0 13V7"></path></svg>}
            />

            <StatCard 
              title="Active Vehicles" 
              value={vendorStats.myVehicles} 
              link="/vehicles"
              linkText="Manage Fleet"
              colorClass="bg-amber-500"
              icon={<svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path></svg>}
            />

          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* Chart 1: Bar Chart */}
             <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Service Volume</h3>
                <div className="h-[300px]">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={vendorChartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                        <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                        <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                      </BarChart>
                   </ResponsiveContainer>
                </div>
             </div>

             {/* Chart 2: Pie Chart */}
             <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Listing Distribution</h3>
                <div className="h-[300px]">
                   <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                         <Pie
                           data={vendorChartData}
                           cx="50%"
                           cy="50%"
                           innerRadius={60}
                           outerRadius={80}
                           paddingAngle={5}
                           dataKey="count"
                         >
                           {vendorChartData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                           ))}
                         </Pie>
                         <Tooltip contentStyle={{border: 'none', borderRadius: '8px'}} />
                         <Legend verticalAlign="bottom" height={36} iconType="circle" />
                      </PieChart>
                   </ResponsiveContainer>
                </div>
             </div>
          </div>

        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // 🏢 ADMIN DASHBOARD
  // ------------------------------------------------------------------
  if (user.role === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 pb-12 font-sans">
        <div className="bg-white border-b border-gray-200 py-6 px-6 sm:px-8 mb-8">
           <div className="container mx-auto">
              <h1 className="text-2xl font-bold text-slate-800">Admin Console</h1>
              <p className="text-sm text-gray-500 mt-1">Platform-wide performance metrics.</p>
           </div>
        </div>

        <div className="container mx-auto px-6 sm:px-8 space-y-8">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard 
              title="Total Users" value={adminStats.usersCount} 
              icon={<svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
              colorClass="bg-indigo-600"
            />
            <StatCard 
              title="Bookings" value={adminStats.bookingsCount} 
              icon={<svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
              colorClass="bg-emerald-600"
            />
            <StatCard 
              title="Vendors" value={adminStats.vendorsCount} 
              icon={<svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
              colorClass="bg-purple-600"
            />
            <StatCard 
              title="Revenue (LKR)" value={adminStats.totalRevenue.toLocaleString()} 
              icon={<svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              colorClass="bg-amber-600"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Platform Inventory</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={adminChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{border: 'none', borderRadius: '8px'}} />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
               <h3 className="text-lg font-bold text-gray-800 mb-6">Market Share</h3>
               <div className="h-[300px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={adminChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="count">
                        {adminChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{border: 'none', borderRadius: '8px'}} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                 </ResponsiveContainer>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 🛡️ USER VIEW
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-12 rounded-2xl shadow-lg max-w-lg w-full border border-gray-200">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome, {user.name}</h1>
            <p className="text-gray-500 mb-8">Ready to explore beautiful Sri Lanka?</p>
            <div className="flex flex-col gap-3">
              <Link to="/" className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition">Explore Services</Link>
              <Link to="/my-bookings" className="w-full bg-white border border-gray-300 text-slate-700 py-3 rounded-lg font-bold hover:bg-gray-50 transition">My Bookings</Link>
            </div>
        </div>
    </div>
  );
};

export default Dashboard;