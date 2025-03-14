import { useEffect, useState } from "react";
import axios from "axios";
import "../assets/styles/CustOrder.css";
import CustomerNavbar from "../components/CustomerNavbar";
import Footer from "../components/Footer";
import API_BASE_URL from "../api/config.js";

const CustOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user")); // ✅ Get logged-in user
  const token = localStorage.getItem("token"); // ✅ Get auth token

  useEffect(() => {
    if (!user) {
      setError("Please log in to view orders.");
      setLoading(false);
      return;
    }

    axios.get(`${API_BASE_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      setOrders(response.data);
      setLoading(false);
    })
    .catch((error) => {
      console.error("❌ Error fetching orders:", error);
      setError("Failed to load orders.");
      setLoading(false);
    });
  }, []);

  // ✅ Cancel Order (Only if status is 'Pending')
  const cancelOrder = async (id) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/orders/${id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(orders.map(order =>
        order._id === id ? { ...order, status: "Cancelled" } : order
      ));
      console.log(`✅ Order cancelled: ${response.data.message}`);
    } catch (error) {
      console.error("❌ Error cancelling order:", error);
    }
  };

  return (
    <>
      <CustomerNavbar />
      <div className="custorder-container">
        <h2>My Orders</h2>
        {loading ? <p>Loading orders...</p> : error ? <p>{error}</p> : orders.length === 0 ? (
          <p>You have no orders. <a href="/products">Shop Now</a></p>
        ) : (
          <table className="order-table">
            <thead>
              <tr>
                <th>Products</th>
                <th>Total ($)</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>
                    {order.products.map((item, index) => (
                      <p key={index}>{item.name} (x{item.quantity})</p>
                    ))}
                  </td>
                  <td>${order.totalAmount.toFixed(2)}</td>
                  <td className={order.status.toLowerCase()}>{order.status}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    {order.status === "Pending" ? (
                      <button className="btn-cancel" onClick={() => cancelOrder(order._id)}>❌ Cancel</button>
                    ) : (
                      <span className="disabled-action">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CustOrder;
