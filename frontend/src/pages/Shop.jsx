import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/HProductCard";
import "../assets/styles/Shop.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API_BASE_URL from "../api/config.js";

const Shop = () => {
  const [products, setProducts] = useState([]); // ✅ Default value as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    axios.get(`${API_BASE_URL}/products`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          console.error("❌ API response is not an array:", response.data);
          setError("Unexpected API response format.");
          setProducts([]);  // ✅ Ensure products is always an array
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ Error fetching products:", error);
        setError("Failed to fetch products.");
        setProducts([]);  // ✅ Ensure products is always an array
        setLoading(false);
      });
  }, []);

  // ✅ Fix: Check if `products` is an array before calling `.filter()`
  const filteredProducts = Array.isArray(products) ? products.filter((product) =>
    (selectedCategory === "All" || product.category === selectedCategory) &&
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Navbar />
      <div className="shop-container">
        <h2>Shop All Products</h2>

        {/* ✅ Search & Filter Bar */}
        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="Camping">Camping</option>
            <option value="Fitness">Fitness</option>
            <option value="Cycling">Cycling</option>
            <option value="Hiking">Hiking</option>
          </select>
        </div>

        {/* ✅ Display Products */}
        <div className="product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
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

export default Shop;
