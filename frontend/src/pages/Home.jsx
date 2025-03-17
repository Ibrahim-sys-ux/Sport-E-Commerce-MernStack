import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Carousel, Container, Row, Col } from "react-bootstrap"; // Bootstrap Components
import ProductCard from "../components/HProductCard";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import API_BASE_URL from "../api/config.js";
import "../assets/styles/Home.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/products`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          console.error("API response is not an array:", response.data);
        }
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  // 🔹 Split products into groups of 3 for the carousel
  const groupedProducts = [];
  for (let i = 0; i < products.length; i += 3) {
    groupedProducts.push(products.slice(i, i + 3));
  }

  return (
    <>
      <Navbar />

      {/* 🔥 Hero Section - Bootstrap Carousel */}
      <Carousel className="hero-carousel">
        <Carousel.Item>
          <img className="d-block w-100" src="/images/hero-banner.webp" alt="First slide" />
          <Carousel.Caption>
            <h1>NIKE AIR ZOOM PEGASUS 37</h1>
            <p>A beautiful blend of design and technology in every step of your running.</p>
            <Link to="/shop" className="btn btn-dark">Shop Now</Link>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100" src="/images/hero-banner2.webp" alt="Second slide" />
          <Carousel.Caption>
            <h1>Explore the Latest Collection</h1>
            <p>Get the best running and outdoor gear today.</p>
            <Link to="/shop" className="btn btn-dark">Shop Now</Link>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      {/* 🏷️ Trending Products Section */}
      <section className="trending my-5">
        <Container>
          <h2 className="text-center mb-4">What's Trending</h2>
          <Carousel indicators={false} controls={true} interval={3000}>
            {groupedProducts.map((group, index) => (
              <Carousel.Item key={index}>
                <Row className="justify-content-center">
                  {group.map((product) => (
                    <Col key={product._id} md={4} sm={6} xs={12}>
                      <ProductCard product={product} />
                    </Col>
                  ))}
                </Row>
              </Carousel.Item>
            ))}
          </Carousel>
        </Container>
      </section>

      <Footer />
    </>
  );
};

export default Home;
