import { useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "../assets/styles/CustomerHome.css";
import CustomerNavbar from "../components/CustomerNavbar";
import Footer from "../components/Footer";

const CustomerHome = () => {
  const [products] = useState([]);

  return (
    <>
      <CustomerNavbar />
      <div className="customer-home">

        {/* Hero Section */}
        <section className="hero">
          <div className="hero-overlay">
            <h1>Gear Up for Your Next Adventure</h1>
            <p>Explore the best outdoor & sports gear at unbeatable prices.</p>
            <Link to="/shop" className="btn-primary">Shop Now</Link>
          </div>
        </section>

        {/* Categories Section */}
        <section className="categories">
          <h2>Shop by Category</h2>
          <div className="category-grid">
            <Link to="/cust/category/camping" className="category-card">🏕️ Camping</Link>
            <Link to="/cust/category/fitness" className="category-card">🏋️‍♂️ Fitness</Link>
            <Link to="/cust/category/cycling" className="category-card">🚴 Cycling</Link>
            <Link to="/cust/category/hiking" className="category-card">🥾 Hiking</Link>
          </div>
        </section>

        {/* Featured Products */}
        <section className="featured">
          <h2>Featured Products</h2>
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials">
          <h2>What Our Customers Say</h2>
          <div className="testimonial-grid">
            <div className="testimonial">
              <p>“Best camping gear ever! Highly recommend.”</p>
              <h4>- Alex</h4>
            </div>
            <div className="testimonial">
              <p>“Quality fitness equipment at amazing prices!”</p>
              <h4>- Sarah</h4>
            </div>
          </div>
        </section>

        {/* Newsletter Subscription */}
        <section className="newsletter">
          <h2>Stay Updated</h2>
          <p>Subscribe to get the latest offers and deals.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button className="btn-primary">Subscribe</button>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
};

export default CustomerHome;
