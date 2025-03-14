import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../assets/styles/ProductDetails.css";
import Navbar from "../components/AdminNavbar";
import Footer from "../components/Footer";
import API_BASE_URL from "../api/config.js";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  // ✅ Added error handling

  useEffect(() => {
    // ✅ Fetch product details from backend
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
 // ✅ Fallback for broken images
/>


          <div className="product-info">
            <h2>{product.name}</h2>
            <p className="category">Category: {product.category}</p>
            <p className="price">$ {product.price ? product.price.toFixed(2) : "N/A"}</p>
            <p className="description">{product.description}</p>
            <p className={product.stock > 0 ? "in-stock" : "out-of-stock"}>
              {product.stock > 0 ? `In Stock (${product.stock} left)` : "Out of Stock"}
            </p>
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
