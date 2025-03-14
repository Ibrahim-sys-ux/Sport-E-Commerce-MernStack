import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFeaturedProducts } from "../api/productApi.js"; // API call function
import ProductCard from "../components/AProductCard"; // Reusable product card
import "../assets/styles/Home.css"; // Import styles
import Navbar from "../components/AdminNavbar.jsx";
import Footer from "../components/Footer.jsx";
import axios from "axios"; 
import API_BASE_URL from "../api/config.js";
const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/products`)  // ✅ Use API_BASE_URL
      .then((response) => {
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          console.error("API response is not an array:", response.data);
        }
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  return (<><Navbar/>
    <div className="home-container">
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay">
          <h1>Gear Up for Your Next Adventure</h1>
          <p>Explore the best outdoor & sports gear at unbeatable prices.</p>
          {/* <Link to="/shop" className="btn-primary">Shop Now</Link> */}
        </div>
      </section>

      {/* Categories */}
      <section className="categories">
        <h2>Shop by Category</h2>
        <div className="category-grid">
          <Link to="/category/camping" className="category-card">🏕️ Camping</Link>
          <Link to="/category/fitness" className="category-card">🏋️‍♂️ Fitness</Link>
          <Link to="/category/cycling" className="category-card">🚴 Cycling</Link>
          <Link to="/category/hiking" className="category-card">🥾 Hiking</Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured">
        <h2>Featured Products</h2>
        <div className="product-grid">
          {products.length > 0 ? (
            products.map((product) => <ProductCard key={product._id} product={product} />)
          ) : (
            <p>Loading products...</p>
          )}
        </div>
      </section>

      
    </div>
    <Footer/></>
  );
};

export default Home;
