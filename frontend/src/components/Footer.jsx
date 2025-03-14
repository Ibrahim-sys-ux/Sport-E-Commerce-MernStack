import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa"; // Social icons
import "../assets/styles/Footer.css"; // Import styles

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left - Company Info */}
        <div className="footer-section">
          <h2>GearQuest</h2>
          <p>Your go-to store for the best outdoor & sports gear.</p>
        </div>

        {/* Center - Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Right - Social & Newsletter */}
        <div className="footer-section">
          <h3>Stay Connected</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
          </div>

          <h3>Subscribe</h3>
          <div className="newsletter">
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>
        </div>
      </div>

      {/* Copyright Notice */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} GearQuest. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
