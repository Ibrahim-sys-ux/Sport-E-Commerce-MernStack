import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/styles/Login.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API_BASE_URL from "../api/config.js";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit Login Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(`${API_BASE_URL}/users/login`, formData);
      
      // Store token and user data in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage("Login successful! Redirecting...");

      // ✅ Check user role and redirect accordingly
      if (data.user.role === "Admin") {
        setTimeout(() => navigate("/admin"), 2000);
      } else {
        setTimeout(() => navigate("/cust"), 2000);
      }
      
    } catch (error) {
      setMessage("Invalid email or password.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <h2>Login</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <button type="submit">Login</button>
        </form>
        <p>Don't have an account? <a href="/register">Register</a></p>
      </div>
      <Footer />
    </>
  );
};

export default Login;
