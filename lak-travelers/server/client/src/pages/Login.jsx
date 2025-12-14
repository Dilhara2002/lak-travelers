import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api"; // API එක import කරගන්නවා

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Backend එකට Login request එක යවනවා
      const res = await API.post("/users/auth", { email, password });
      
      // 2. එන Data (Name, Email, ID) browser එකේ save කරගන්නවා
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      
      console.log("Login Success:", res.data);
      alert("Login Successful!");
      
      // 3. Home Page එකට යවනවා
      navigate("/");
      window.location.reload(); // Navbar එක update වෙන්න reload එකක් දාමු
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Login</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          New here? <Link to="/register" className="text-blue-500">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;