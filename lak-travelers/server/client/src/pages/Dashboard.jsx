import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

const COLORS = ["#1e293b", "#3b82f6", "#10b981"];

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("userInfo")));
  const [loading, setLoading] = useState(true);

  /* ---------------- ADMIN STATS ---------------- */
  const [adminStats, setAdminStats] = useState({
    usersCount: 0,
    vendorsCount: 0,
    bookingsCount: 0,
    hotelsCount: 0,
    toursCount: 0,
    vehiclesCount: 0,
    totalRevenue: 0,
  });

  const [pendingVendors, setPendingVendors] = useState([]);

  /* ---------------- VENDOR STATS ---------------- */
  const [vendorStats, setVendorStats] = useState({
    myHotels: 0,
    myTours: 0,
    myVehicles: 0,
  });

  /* ---------------- AUTH GUARD & DATA FETCH ---------------- */
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchDashboardData();
    // eslint-disable-next-line
  }, [user]);

  /* ---------------- FETCH DATA ---------------- */
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Admin තොරතුරු ලබා ගැනීම
      if (user.role === "admin") {
        const [statsRes, pendingRes] = await Promise.all([
          API.get("/admin/stats"),
          API.get("/users/pending"),
        ]);
        setAdminStats(statsRes.data);
        setPendingVendors(pendingRes.data);
      }

      // Vendor තොරතුරු ලබා ගැනීම
      if (user.role === "vendor") {
        const [hotels, tours, vehicles] = await Promise.all([
          API.get("/hotels"),
          API.get("/tours"),
          API.get("/vehicles"),
        ]);

        const uid = user._id;
        
        // Vendor හට අදාළ දත්ත පමණක් පෙරීම (Filter)
        setVendorStats({
          myHotels: hotels.data.filter(h => h.user === uid || h.user?._id === uid).length,
          myTours: tours.data.filter(t => t.user === uid || t.user?._id === uid).length,
          myVehicles: vehicles.data.filter(v => v.user === uid || v.user?._id === uid).length,
        });
      }
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
      // ටෝකනය කල් ඉකුත් වී ඇත්නම් නැවත ලොග් වීමට යොමු කරයි
      if (err.response?.status === 401) {
        localStorage.removeItem("userInfo");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- APPROVE VENDOR ---------------- */
  const approveVendor = async (id) => {
    if (!window.confirm("Approve this vendor?")) return;
    try {
      await API.put(`/users/approve/${id}`);
      alert("Vendor approved successfully!");
      fetchDashboardData();
    } catch (err) {
      alert("Failed to approve vendor.");
    }
  };

  /* ---------------- LOADING UI ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mb-4"></div>
        <p className="text-gray-500 font-medium">Loading Dashboard Data...</p>
      </div>
    );
  }

  /* ---------------- REUSABLE CARD ---------------- */
  const StatCard = ({ title, value }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{title}</p>
      <p className="text-3xl font-extrabold mt-2 text-slate-800">{value}</p>
    </div>
  );

  /* ============================================================
     🛡️ ADMIN DASHBOARD
  ============================================================ */
  if (user.role === "admin") {
    const adminChart = [
      { name: "Hotels", count: adminStats.hotelsCount },
      { name: "Tours", count: adminStats.toursCount },
      { name: "Vehicles", count: adminStats.vehiclesCount },
    ];

    return (
      <div className="min-h-screen bg-gray-50 p-8 pt-28">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard 🛡️</h1>
            <div className="text-sm bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-bold">Administrator Access</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard title="Total Users" value={adminStats.usersCount} />
            <StatCard title="Total Vendors" value={adminStats.vendorsCount} />
            <StatCard title="Total Bookings" value={adminStats.bookingsCount} />
            <StatCard title="Total Revenue" value={`Rs. ${adminStats.totalRevenue.toLocaleString()}`} />
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-bold mb-6 text-gray-700">Services Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={adminChart}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#f8fafc'}} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center">
              <h3 className="font-bold mb-6 text-gray-700 w-full text-left">Category Overview</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={adminChart} dataKey="count" nameKey="name" innerRadius={70} outerRadius={100} paddingAngle={5}>
                    {adminChart.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-slate-50 p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Pending Vendor Requests</h2>
              <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold">{pendingVendors.length} New</span>
            </div>

            <div className="divide-y divide-gray-100">
              {pendingVendors.length === 0 ? (
                <p className="p-10 text-center text-gray-500 italic">No pending requests at the moment 🎉</p>
              ) : (
                pendingVendors.map(v => (
                  <div key={v._id} className="p-6 flex flex-col md:flex-row justify-between items-center gap-4 hover:bg-gray-50 transition">
                    <div>
                      <p className="font-bold text-lg text-slate-900">{v.vendorDetails?.businessName || 'Business Name Missing'}</p>
                      <p className="text-sm text-gray-500">{v.email} • {v.vendorDetails?.phone}</p>
                    </div>
                    <button
                      onClick={() => approveVendor(v._id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-bold shadow-sm transition active:scale-95"
                    >
                      Approve Vendor
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ============================================================
     🏢 VENDOR DASHBOARD
  ============================================================ */
  if (user.role === "vendor") {
    const vendorChart = [
      { name: "Hotels", count: vendorStats.myHotels },
      { name: "Tours", count: vendorStats.myTours },
      { name: "Vehicles", count: vendorStats.myVehicles },
    ];

    return (
      <div className="min-h-screen bg-gray-50 p-8 pt-28">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Vendor Dashboard</h1>
            <div className="text-sm bg-green-50 text-green-700 px-4 py-2 rounded-full font-bold">Vendor Panel</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <StatCard title="My Hotels" value={vendorStats.myHotels} />
            <StatCard title="My Tours" value={vendorStats.myTours} />
            <StatCard title="My Vehicles" value={vendorStats.myVehicles} />
          </div>

          <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-bold mb-8 text-gray-700">Service Performance Overview</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={vendorChart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }

  /* ============================================================
     👤 NORMAL USER
  ============================================================ */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-12 rounded-2xl shadow-xl border border-gray-100 text-center max-w-lg w-full">
        <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 font-bold">
          {user.name.charAt(0)}
        </div>
        <h1 className="text-3xl font-bold mb-2 text-slate-900">Welcome, {user.name}</h1>
        <p className="text-gray-500 mb-8">Ready to plan your next Sri Lankan adventure?</p>
        <Link to="/" className="block w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold shadow-lg transition transform hover:-translate-y-1">
          Explore All Services
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;