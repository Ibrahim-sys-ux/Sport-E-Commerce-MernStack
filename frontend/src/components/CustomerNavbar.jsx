import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiMenu, FiX, FiUser, FiLogOut } from "react-icons/fi";
import "../assets/styles/CustomerNavbar.css";

const CustomerNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="customer-navbar">
      <div className="logo">
        <Link to="/">GearQuest</Link>
      </div>

      <ul className={menuOpen ? "nav-links nav-active" : "nav-links"}>
        <li><Link to="/cust" onClick={() => setMenuOpen(false)}>Home</Link></li>
        <li><Link to="/cust/product" onClick={() => setMenuOpen(false)}>Products</Link></li>
        <li><Link to="/cust/cart" onClick={() => setMenuOpen(false)}>Cart</Link></li>
        <li><Link to="/cust/orders" onClick={() => setMenuOpen(false)}>Order</Link></li>
        <li><Link to="/" onClick={() => setMenuOpen(false)}><FiLogOut /> Logout</Link></li>
        <li>
          <Link to="/cust/cart" className="cart-link" onClick={() => setMenuOpen(false)}>
            <FiShoppingCart />
            <span className="cart-count">3</span> {/* Replace 3 with dynamic count */}
          </Link>
        </li>
      </ul>

      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FiX /> : <FiMenu />}
      </div>
    </nav>
  );
};

export default CustomerNavbar;
