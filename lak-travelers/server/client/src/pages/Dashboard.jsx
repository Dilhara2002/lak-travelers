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
  const user = JSON.parse(localStorage.getItem("userInfo"));

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

  /* ---------------- AUTH GUARD ---------------- */
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchDashboardData();
    // eslint-disable-next-line
  }, []);

  /* ---------------- FETCH DATA ---------------- */
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      if (user.role === "admin") {
        const [statsRes, pendingRes] = await Promise.all([
          API.get("/admin/stats"),
          API.get("/users/pending"),
        ]);
        setAdminStats(statsRes.data);
        setPendingVendors(pendingRes.data);
      }

      if (user.role === "vendor") {
        const [hotels, tours, vehicles] = await Promise.all([
          API.get("/hotels"),
          API.get("/tours"),
          API.get("/vehicles"),
        ]);

        const uid = user._id;
        setVendorStats({
          myHotels: hotels.data.filter(h => h.user === uid || h.user?._id === uid).length,
          myTours: tours.data.filter(t => t.user === uid || t.user?._id === uid).length,
          myVehicles: vehicles.data.filter(v => v.user === uid || v.user?._id === uid).length,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- APPROVE VENDOR ---------------- */
  const approveVendor = async (id) => {
    if (!window.confirm("Approve this vendor?")) return;
    await API.put(`/users/approve/${id}`);
    fetchDashboardData();
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-800 border-t-transparent"></div>
      </div>
    );
  }

  /* ---------------- REUSABLE CARD ---------------- */
  const StatCard = ({ title, value }) => (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <p className="text-xs text-gray-400 font-bold uppercase">{title}</p>
      <p className="text-3xl font-extrabold mt-2">{value}</p>
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
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard 🛡️</h1>

        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <StatCard title="Users" value={adminStats.usersCount} />
          <StatCard title="Vendors" value={adminStats.vendorsCount} />
          <StatCard title="Bookings" value={adminStats.bookingsCount} />
          <StatCard title="Revenue (LKR)" value={adminStats.totalRevenue.toLocaleString()} />
        </div>

        {/* CHARTS */}
        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl border">
            <ResponsiveContainer height={300}>
              <BarChart data={adminChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl border">
            <ResponsiveContainer height={300}>
              <PieChart>
                <Pie data={adminChart} dataKey="count" innerRadius={60} outerRadius={90}>
                  {adminChart.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PENDING VENDORS */}
        <div className="bg-white rounded-xl border">
          <h2 className="text-xl font-bold p-6 border-b">
            Pending Vendor Requests ({pendingVendors.length})
          </h2>

          {pendingVendors.length === 0 ? (
            <p className="p-6 text-gray-500">No pending vendors 🎉</p>
          ) : (
            pendingVendors.map(v => (
              <div key={v._id} className="p-6 border-b flex justify-between">
                <div>
                  <p className="font-bold">{v.vendorDetails?.businessName}</p>
                  <p className="text-sm text-gray-500">{v.email}</p>
                </div>
                <button
                  onClick={() => approveVendor(v._id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  Approve
                </button>
              </div>
            ))
          )}
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
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-3xl font-bold mb-8">Vendor Dashboard</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <StatCard title="My Hotels" value={vendorStats.myHotels} />
          <StatCard title="My Tours" value={vendorStats.myTours} />
          <StatCard title="My Vehicles" value={vendorStats.myVehicles} />
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <ResponsiveContainer height={300}>
            <BarChart data={vendorChart}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  /* ============================================================
     👤 NORMAL USER
  ============================================================ */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-xl shadow border text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome, {user.name}</h1>
        <Link to="/" className="block bg-slate-900 text-white py-3 rounded-lg">
          Explore Services
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
