import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/styles/AdminAddProduct.css";
import Navbar from "../components/AdminNavbar.jsx";
import Footer from "../components/Footer.jsx";
import API_BASE_URL from "../api/config.js";

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Camping", // ✅ Default category
    stock: "",
    image: "",
    description: "",
  });

  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState(null); // ✅ For file upload

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Upload image to backend or cloud storage
  const uploadImage = async () => {
    if (!imageFile) {
      console.error("❌ No image selected.");
      return null;
    }
  
    const formData = new FormData();
    formData.append("image", imageFile);
  
    try {
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("✅ Image uploaded:", response.data.imageUrl);
      return response.data.imageUrl;
    } catch (error) {
      console.error("❌ Image upload failed:", error.response?.data || error.message);
      setMessage("Error uploading image. Please check the console.");
      return null;
    }
  };
  

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const uploadedImageUrl = await uploadImage();
    if (!uploadedImageUrl) {
      setMessage("Error uploading image. Please try again.");
      return;
    }
  
    setFormData({ ...formData, image: uploadedImageUrl });  // ✅ Store image URL in state
  
    try {
      await axios.post(`${API_BASE_URL}/products`, { ...formData, image: uploadedImageUrl });
      setMessage("Product added successfully!");
      setTimeout(() => navigate("/admin/products"), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error adding product.");
    }
  };
  
  return (
    <>
      <Navbar />
      <div className="admin-add-product-container">
        <h2>Add New Product</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required />
          <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />

          {/* ✅ Category Dropdown */}
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="Camping">Camping</option>
            <option value="Fitness">Fitness</option>
            <option value="Cycling">Cycling</option>
            <option value="Hiking">Hiking</option>
          </select>

          <input type="number" name="stock" placeholder="Stock Quantity" value={formData.stock} onChange={handleChange} required />

          {/* ✅ Image File Upload */}
          <input type="file" accept="image/*" onChange={handleImageChange} required />

          <textarea name="description" placeholder="Product Description" value={formData.description} onChange={handleChange} required />

          <button type="submit">Add Product</button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default AdminAddProduct;
