import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../assets/styles/CategoryProducts.css";
import CustomerNavbar from "../components/CustomerNavbar";
import Footer from "../components/Footer";
import ProductCard from "../components/HProductCard";
import API_BASE_URL from "../api/config.js";

const CategoryProducts = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/products/category/${category}`)
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ Error fetching products:", error);
        setError("No products found for this category.");
        setLoading(false);
      });
  }, [category]);

  return (
    <>
      <CustomerNavbar />
      <div className="category-products-container">
        <h2>Products in {category}</h2>
        {loading ? <p>Loading products...</p> : error ? <p>{error}</p> : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CategoryProducts;
