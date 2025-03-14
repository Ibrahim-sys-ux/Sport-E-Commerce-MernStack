import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/styles/ProductEdit.css";
import Navbar from "../components/AdminNavbar.jsx";
import Footer from "../components/Footer.jsx";
import API_BASE_URL from "../api/config.js";

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Camping",
    stock: "",
    image: "",
    description: "",
  });

  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState(null); // For file upload

  // Fetch existing product details
  useEffect(() => {
    axios.get(`${API_BASE_URL}/products/${id}`)
      .then((response) => {
        setFormData(response.data);
      })
      .catch((error) => {
        console.error("❌ Error fetching product:", error);
        setMessage("Product not found.");
      });
  }, [id]);

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
    if (!imageFile) return formData.image; // Keep existing image if no new one is selected

    const imageFormData = new FormData();
    imageFormData.append("image", imageFile);

    try {
      const response = await axios.post(`${API_BASE_URL}/upload`, imageFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("✅ Image uploaded:", response.data.imageUrl);
      return response.data.imageUrl;
    } catch (error) {
      console.error("❌ Image upload failed:", error.response?.data || error.message);
      setMessage("Error uploading image. Please check the console.");
      return formData.image; // Return existing image URL if upload fails
    }
  };

  // Handle form submission (Update Product)
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const uploadedImageUrl = await uploadImage(); // Upload new image if selected
    const updatedProduct = { ...formData, image: uploadedImageUrl };
  
    try {
      const response = await axios.put(`${API_BASE_URL}/products/${id}`, updatedProduct, {
        headers: { "Content-Type": "application/json" },
      });
  
      console.log("✅ Product updated:", response.data);
      setMessage("✅ Product updated successfully!");
      setTimeout(() => navigate("/admin/products"), 2000);
    } catch (error) {
      console.error("❌ Error updating product:", error.response?.data || error.message);
      setMessage(error.response?.data?.message || "Error updating product.");
    }
  };
  
  
  return (
    <>
      <Navbar />
      <div className="product-edit-container">
        <h2>Edit Product</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required />
          <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />

          {/* Category Dropdown */}
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="Camping">Camping</option>
            <option value="Fitness">Fitness</option>
            <option value="Cycling">Cycling</option>
            <option value="Hiking">Hiking</option>
          </select>

          <input type="number" name="stock" placeholder="Stock Quantity" value={formData.stock} onChange={handleChange} required />

          {/* Display Current Image */}
          <div className="image-preview">
            <label>Current Image:</label>
            <img 
              src={formData.image ? `http://localhost:5000${formData.image}` : "/images/default.jpg"} 
              alt="Product Preview" 
              className="product-image"
               // Handle broken images
            />
          </div>

          {/* Image File Upload */}
          <input type="file" accept="image/*" onChange={handleImageChange} />

          <textarea name="description" placeholder="Product Description" value={formData.description} onChange={handleChange} required />

          <button type="submit">Update Product</button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default ProductEdit;
