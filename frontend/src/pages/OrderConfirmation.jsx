import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../assets/styles/OrderConfirmation.css";
import CustomerNavbar from "../components/CustomerNavbar";
import Footer from "../components/Footer";

const OrderConfirmation = () => {
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const storedDetails = JSON.parse(localStorage.getItem("shippingDetails"));
    setOrderDetails(storedDetails);
    localStorage.removeItem("cart"); // ✅ Clear cart after order is placed
  }, []);

  return (
    <>
      <CustomerNavbar />
      <div className="order-confirmation-container">
        <h2>🎉 Order Confirmed!</h2>
        {orderDetails ? (
          <>
            <p>Thank you for your purchase, <strong>{orderDetails.name}</strong>!</p>
            <p>Your order will be shipped to:</p>
            <p><strong>{orderDetails.address}, {orderDetails.city}, {orderDetails.postalCode}, {orderDetails.country}</strong></p>
            <p>Payment Method: <strong>{orderDetails.paymentMethod}</strong></p>
            <p>We will notify you once your order is shipped.</p>
            <Link to="/cust/product" className="btn-back">🛍️ Continue Shopping</Link>
          </>
        ) : (
          <p>Loading order details...</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default OrderConfirmation;
