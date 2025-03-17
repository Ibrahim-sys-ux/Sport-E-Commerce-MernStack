import { useState } from "react";
import { Link } from "react-router-dom";
import {  FiMenu, FiX, FiLogIn } from "react-icons/fi";
import "../assets/styles/Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);


  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">GearQuest</Link>
      </div>
      <ul className={menuOpen ? "nav-links nav-active" : "nav-links"}>
        <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
        <li><Link to="/shop" onClick={() => setMenuOpen(false)}>Shop</Link></li>
        <li><Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link></li>
        <li><Link to="/login" onClick={() => setMenuOpen(false)}><FiLogIn /> Login</Link></li>
        
      </ul>
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FiX /> : <FiMenu />}
      </div>
    </nav>
  );
};
export default Navbar;