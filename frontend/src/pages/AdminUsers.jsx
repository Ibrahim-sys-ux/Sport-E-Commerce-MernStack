import { useEffect, useState } from "react";
import axios from "axios";
import "../assets/styles/AdminUsers.css"; // ✅ Import CSS
import Navbar from "../components/AdminNavbar.jsx";
import Footer from "../components/Footer.jsx";
import API_BASE_URL from "../api/config.js";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token"); // ✅ Get token from localStorage

  useEffect(() => {
    if (!token) {
      setError("❌ Not authorized. Please log in.");
      return;
    }

    axios.get(`${API_BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => setUsers(response.data))
      .catch((error) => {
        console.error("❌ Error fetching users:", error.response?.data || error.message);
        setError("Failed to load users. Please check authentication.");
      });
  }, [token]);

  // ✅ Handle User Deletion
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(users.filter((user) => user._id !== id)); // ✅ Remove from UI
      console.log(`✅ User ${id} deleted successfully.`);
    } catch (error) {
      console.error("❌ Error deleting user:", error.response?.data || error.message);
    }
  };

  // ✅ Promote to Admin
  const handleMakeAdmin = async (id) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/users/${id}/make-admin`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(users.map((user) =>
        user._id === id ? { ...user, role: "Admin" } : user
      ));
      console.log("✅ User promoted to admin:", response.data);
    } catch (error) {
      console.error("❌ Error promoting user:", error.response?.data || error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="admin-users-container">
        <h2>Manage Users</h2>
        {error && <p className="error-message">{error}</p>} {/* ✅ Show error */}
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    {user.role !== "Admin" && (
                      <button className="btn-promote" onClick={() => handleMakeAdmin(user._id)}>👑 Make Admin</button>
                    )}
                    <button className="btn-delete" onClick={() => handleDelete(user._id)}>🗑️ Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4">No users available</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
};

export default AdminUsers;
