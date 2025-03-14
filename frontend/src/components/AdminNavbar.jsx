import { useState } from "react";
import { Link } from "react-router-dom";
import { FiShoppingCart, FiMenu, FiX, FiUser, FiLogIn, FiLogOut } from "react-icons/fi"; // Icons
import "../assets/styles/Navbar.css"; // Import styles

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const cartItemCount = 2; // Replace with cart state

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">GearQuest</Link>
      </div>

      {/* Desktop Menu */}
      <ul className={menuOpen ? "nav-links nav-active" : "nav-links"}>
        <li><Link to="/admin" onClick={() => setMenuOpen(false)}>Home</Link></li>
        <li><Link to="/admin/products" onClick={() => setMenuOpen(false)}>Manage Products</Link></li>
        <li><Link to="/admin/orders" onClick={() => setMenuOpen(false)}>Manage Orders</Link></li>
        <li><Link to="/admin/user" onClick={() => setMenuOpen(false)}> Manage Users </Link></li>
        <li><Link to="/" onClick={() => setMenuOpen(false)}><FiLogOut /> Logout</Link></li>
        <li>
          <Link to="/cart" className="cart-link" onClick={() => setMenuOpen(false)}>
            <FiShoppingCart />
            {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
          </Link>
        </li>
      </ul>

      {/* Mobile Menu Toggle */}
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FiX /> : <FiMenu />}
      </div>
    </nav>
  );
};

export default Navbar;
