import { useEffect, useState } from "react";
import axios from "axios";
import "../assets/styles/AdminOrders.css";
import Navbar from "../components/AdminNavbar.jsx";
import Footer from "../components/Footer.jsx";
import API_BASE_URL from "../api/config.js";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  // ✅ Retrieve token from localStorage
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("❌ Not authorized. Please log in.");
      return;
    }
  
    axios.get(`${API_BASE_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        console.log("✅ Orders API Response:", response.data); // ✅ Log orders data
        setOrders(response.data);
      })
      .catch((error) => {
        console.error("❌ Error fetching orders:", error.response?.data || error.message);
        setError("Failed to load orders. Please check authentication.");
      });
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
  
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setOrders(orders.filter((order) => order._id !== id)); // ✅ Remove from UI
      console.log(`✅ Order ${id} deleted successfully.`);
    } catch (error) {
      console.error("❌ Error deleting order:", error.response?.data || error.message);
    }
  };
const handleStatusChange = async (id, newStatus) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_BASE_URL}/orders/${id}`, 
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setOrders(orders.map((order) =>
      order._id === id ? { ...order, status: newStatus } : order
    ));
    console.log("✅ Order updated:", response.data);
  } catch (error) {
    console.error("❌ Error updating order:", error.response?.data || error.message);
  }
};
  
  return (
    <>
      <Navbar />
      <div className="admin-orders-container">
        <h2>Manage Orders</h2>
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Total ($)</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
  {orders.length > 0 ? (
    orders.map((order) => (
      <tr key={order._id}>
        <td>{order.customer?.name || "Unknown"}</td>
        <td>${order.totalAmount ? order.totalAmount.toFixed(2) : "N/A"}</td>
        <td>
          <select 
            value={order.status} 
            onChange={(e) => handleStatusChange(order._id, e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </td>
        <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}</td>
        <td>
          <button className="btn-delete" onClick={() => handleDelete(order._id)}>🗑️ Delete</button>
        </td>
      </tr>
    ))
  ) : (
    <tr><td colSpan="5">No orders available</td></tr>
  )}
</tbody>


        </table>
      </div>
      <Footer />
    </>
  );
};

export default AdminOrders;
