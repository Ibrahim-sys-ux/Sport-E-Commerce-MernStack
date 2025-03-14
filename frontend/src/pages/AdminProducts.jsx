import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../assets/styles/AdminProducts.css";
import Navbar from "../components/AdminNavbar.jsx";
import Footer from "../components/Footer.jsx";
import API_BASE_URL from "../api/config.js";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  // ✅ Added error handling

  useEffect(() => {
    axios.get(`${API_BASE_URL}/products`)
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError("Failed to load products.");
        setLoading(false);
      });
  }, []);

  // ✅ Fix: Remove mock data (no need for extra `setProducts()`)

  // ✅ Delete Product Function (Calls Backend)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/products/${id}`);
      setProducts(products.filter((product) => product._id !== id));
      console.log(`Deleted product with ID: ${id}`);
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Navbar />
      <div className="admin-products-container">
        <h2>Manage Products</h2>
        <Link to="/admin/products/add" className="btn-add">➕ Add Product</Link>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price ($)</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>${product.price ? product.price.toFixed(2) : "N/A"}</td>
                  <td>{product.category}</td>
                  <td>{product.stock}</td>
                  <td>
                    <Link to={`/admin/products/edit/${product._id}`} className="btn-edit">✏️ Edit</Link>
                    <button onClick={() => handleDelete(product._id)} className="btn-delete">🗑️ Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5">No products available</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
};

export default AdminProducts;
