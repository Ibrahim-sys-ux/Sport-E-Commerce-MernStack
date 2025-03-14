import Product from "../models/Product.js"; // Import Product model

// ✅ Update Product Controller
export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, price, category, stock, image, description } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ Update product details
    product.name = name || product.name;
    product.price = price || product.price;
    product.category = category || product.category;
    product.stock = stock || product.stock;
    product.image = image || product.image;
    product.description = description || product.description;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server Error: Unable to update product" });
  }
};
