import { Link } from "react-router-dom";
import "../assets/styles/ProductCard.css";
import { useState } from "react";

const ProductCard = ({ product }) => {
  const [imageError, setImageError] = useState(false);

  const imageUrl = product.image.startsWith("http")
    ? product.image
    : `http://localhost:5000${product.image.replace(/^uploads\//, '')}`;

  console.log(imageUrl);

  return (
    <div className="product-card">
      <img 
        src={imageUrl} 
        alt={product.name} 
        className="product-image"
        onError={() => setImageError(true)} // ✅ Handle broken images
      />
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">${product.price.toFixed(2)}</p>
        <Link to={`/home/product/${product._id}`} className="btn-view">View Details</Link>
      </div>
    </div>
  );
};

export default ProductCard;
