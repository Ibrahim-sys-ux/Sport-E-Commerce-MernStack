import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import "../assets/styles/CustProduct.css";
import CustomerNavbar from "../components/CustomerNavbar";
import Footer from "../components/Footer";
import API_BASE_URL from "../api/config.js";
const CustProduct = () => {
  const [products, setProducts] = useState([]);  
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    axios.get(`${API_BASE_URL}/products`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setProducts(response.data); // ✅ Store API response
        } else {
          console.error("❌ API response is not an array:", response.data);
          setProducts([]); // ✅ Set empty array if response is invalid
        }
      })
      .catch((error) => {
        console.error("❌ Error fetching products:", error);
        setProducts([]); // ✅ Prevent undefined errors
      });
  }, []);

  // ✅ Define `filteredProducts` before using it
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (category === "All" || product.category === category)
  );

  return (
    <>
      <CustomerNavbar />
      <div className="custproduct-container">
        <h2>Shop All Products</h2>

        {/* Search & Filter Bar */}
        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="Camping">Camping</option>
            <option value="Hiking">Hiking</option>
            <option value="Cycling">Cycling</option>
            <option value="Fitness">Fitness</option>
          </select>
        </div>

        {/* Product Listing */}
        <div className="product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Link to={`/cust/product/${product._id}`} key={product._id} className="product-link">
                <ProductCard product={product} />
              </Link>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CustProduct;

