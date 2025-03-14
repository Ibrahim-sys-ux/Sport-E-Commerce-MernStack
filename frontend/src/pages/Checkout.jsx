import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/styles/Checkout.css";
import CustomerNavbar from "../components/CustomerNavbar";
import Footer from "../components/Footer";
import API_BASE_URL from "../api/config.js";

const Checkout = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
    paymentMethod: "Credit Card",
  });

  const [message, setMessage] = useState("");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // ✅ Ensure totalAmount is correctly calculated
  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setMessage("Please log in to place an order.");
      return;
    }

    const orderData = {
      customer: user._id, 
      products: cart.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      totalAmount,
      status: "Pending",  // ✅ Ensure new orders start as "Pending"
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/orders`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Order placed:", response.data);
      setMessage("Order placed successfully!");
      localStorage.removeItem("cart"); // ✅ Clear cart after order is placed
      setTimeout(() => navigate("/order-confirmation"), 2000);
    } catch (error) {
      console.error("❌ Error placing order:", error);
      setMessage("Error placing order. Please try again.");
    }
  };

  return (
    <>
      <CustomerNavbar />
      <div className="checkout-container">
        <h2>Checkout</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
          <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
          <input type="text" name="postalCode" placeholder="Postal Code" value={formData.postalCode} onChange={handleChange} required />
          <input type="text" name="country" placeholder="Country" value={formData.country} onChange={handleChange} required />

          <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
            <option value="Credit Card">Credit Card</option>
            <option value="PayPal">PayPal</option>
            <option value="Cash on Delivery">Cash on Delivery</option>
          </select>

          <button type="submit">Place Order</button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
