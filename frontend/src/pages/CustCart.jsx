import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/styles/CustCart.css";
import CustomerNavbar from "../components/CustomerNavbar";
import Footer from "../components/Footer";
import axios from "axios";  // ✅ Import Axios
import API_BASE_URL from "../api/config.js";  // ✅ Import API base URL



const CustCart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    // ✅ Fetch cart items from localStorage (mock data for now)
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

// ✅ Remove item from cart and update localStorage
// ✅ Remove item from cart and restore stock in backend
const removeItem = async (id, quantity) => {
  const updatedCart = cart.filter((item) => item._id !== id);
  setCart(updatedCart);
  localStorage.setItem("cart", JSON.stringify(updatedCart)); // ✅ Update localStorage

  // ✅ Restore stock in backend
  try {
    await axios.put(`${API_BASE_URL}/products/${id}/restore-stock`, {
      quantity: quantity, // ✅ Increase stock by removed quantity
    });
    console.log(`✅ Stock restored for product ${id}`);
  } catch (error) {
    console.error("❌ Error restoring stock:", error);
  }
};


// ✅ Update quantity and update localStorage
const updateQuantity = async (id, newQuantity) => {
  const product = cart.find((item) => item._id === id);

  if (!product) return;
  if (newQuantity < 1) return; // ✅ Prevents quantity from going below 1

  const changeInQuantity = newQuantity - product.quantity; // ✅ Check if increasing or decreasing

  if (product.stock < changeInQuantity) {
    alert("❌ Not enough stock available!");
    return;
  }

  const updatedCart = cart.map((item) =>
    item._id === id ? { ...item, quantity: newQuantity } : item
  );

  setCart(updatedCart);
  localStorage.setItem("cart", JSON.stringify(updatedCart)); // ✅ Save cart changes

  // ✅ Update stock in backend
  try {
    await axios.put(`${API_BASE_URL}/products/${id}/update-stock`, {
      quantity: changeInQuantity, // Send the difference in quantity
    });
    console.log(`✅ Stock updated for product ${id}`);
  } catch (error) {
    console.error("❌ Error updating stock:", error);
  }
};



  // ✅ Apply discount code
  const applyCoupon = () => {
    if (coupon === "DISCOUNT10") {
      setDiscount(0.1); // 10% discount
    } else {
      setDiscount(0);
    }
  };

  // ✅ Calculate total price
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount;

  return (
    <>
      <CustomerNavbar />
      <div className="cart-container">
        <h2>Shopping Cart</h2>

        {cart.length === 0 ? (
          <p>Your cart is empty. <Link to="/products">Shop Now</Link></p>
        ) : (
          <>
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <img src={item.image} alt={item.name} />
                      {item.name}
                    </td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>
                      <input
                        type="number"
                        value={item.quantity}
                        min="1"
                        onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
                      />
                    </td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <button className="btn-remove" onClick={() => removeItem(item._id)}>🗑️ Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Coupon Section */}
            <div className="cart-coupon">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <button onClick={applyCoupon}>Apply Coupon</button>
            </div>

            {/* Order Summary */}
            <div className="cart-summary">
              <h3>Order Summary</h3>
              <p>Subtotal: ${subtotal.toFixed(2)}</p>
              {discount > 0 && <p>Discount: -${discountAmount.toFixed(2)}</p>}
              <p><strong>Total: ${total.toFixed(2)}</strong></p>
              <button className="btn-checkout" onClick={() => navigate("/checkout")}>Proceed to Checkout</button>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CustCart;
