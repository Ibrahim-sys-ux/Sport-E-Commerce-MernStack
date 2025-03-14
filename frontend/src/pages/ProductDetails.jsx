import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../assets/styles/ProductDetails.css";
import Navbar from "../components/CustomerNavbar";
import Footer from "../components/Footer";
import API_BASE_URL from "../api/config.js";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState("");
  const [quantity, setQuantity] = useState(1); // ✅ Quantity State

  useEffect(() => {
    axios.get(`${API_BASE_URL}/products/${id}`)
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setError("Product not found.");
        setLoading(false);
      });
  }, [id]);

  // ✅ Function to Add Product to Cart with Quantity
  const addToCart = async () => {
    if (quantity < 1) {
      setCartMessage("❌ Quantity must be at least 1.");
      return;
    }

    if (product.stock < quantity) {
      setCartMessage("❌ Not enough stock available.");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProduct = cart.find((item) => item._id === product._id);

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setCartMessage(`✅ Added ${quantity} to cart! 🛒`);

    // ✅ Update stock in backend
    try {
      await axios.put(`${API_BASE_URL}/products/${product._id}/reduce-stock`, {
        quantity: quantity,
      });

      setProduct({ ...product, stock: product.stock - quantity });
    } catch (error) {
      console.error("❌ Error updating stock:", error);
    }

    setTimeout(() => setCartMessage(""), 3000);
  };

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>No product details available.</p>;

  return (
    <>
      <Navbar />
      <div className="product-details-container">
        <div className="product-main">
          <img 
            src={product.image ? `http://localhost:5000${product.image.replace(/^uploads\//, '')}` : "/images/default.jpg"} 
            alt={product.name}
          />

          <div className="product-info">
            <h2>{product.name}</h2>
            <p className="category">Category: {product.category}</p>
            <p className="price">$ {product.price ? product.price.toFixed(2) : "N/A"}</p>
            <p className="description">{product.description}</p>
            <p className={product.stock > 0 ? "in-stock" : "out-of-stock"}>
              {product.stock > 0 ? `In Stock (${product.stock} left)` : "Out of Stock"}
            </p>

            {/* ✅ Quantity Selector */}
            {product.stock > 0 && (
              <div className="quantity-selector">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>➖</button>
                <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))} />
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>➕</button>
              </div>
            )}

            {/* ✅ Add to Cart Button */}
            {product.stock > 0 ? (
              <button className="btn-add-cart" onClick={addToCart}>🛒 Add to Cart</button>
            ) : (
              <button className="btn-out-of-stock" disabled>❌ Out of Stock</button>
            )}

            {/* ✅ Show Cart Confirmation Message */}
            {cartMessage && <p className="cart-message">{cartMessage}</p>}
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="reviews">
          <h3>Customer Reviews</h3>
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((review, index) => (
              <div key={index} className="review">
                <h4>{review.user}</h4>
                <p>⭐ {review.rating} / 5</p>
                <p>{review.comment}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetails;
