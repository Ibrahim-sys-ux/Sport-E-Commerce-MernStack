import express from "express";
import Product from "../models/Product.js";
import { updateProduct } from "../controllers/productController.js"; 

const router = express.Router();

// ✅ Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

// ✅ Get a single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching product" });
  }
});

// ✅ Add a new product
router.post("/", async (req, res) => {
  const { name, price, category, stock, image, description } = req.body;

  if (!name || !price || !category || !stock || !image || !description) {
    return res.status(400).json({ message: "All fields are required" }); // ✅ Return error if fields are missing
  }

  try {
    const newProduct = new Product({ name, price, category, stock, image, description });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Error adding product. Check server logs." });
  }
});


// ✅ Delete a product
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
});



router.put("/:id/reduce-stock", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const quantityToReduce = req.body.quantity || 1;

    if (product.stock < quantityToReduce) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    product.stock -= quantityToReduce; // ✅ Reduce stock
    await product.save();

    res.json({ message: "Stock updated", stock: product.stock });
  } catch (error) {
    console.error("❌ Error updating stock:", error);
    res.status(500).json({ message: "Server error updating stock" });
  }
});



router.put("/:id/restore-stock", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const quantityToRestore = req.body.quantity || 1;
    product.stock += quantityToRestore; // ✅ Increase stock
    await product.save();

    res.json({ message: "Stock restored", stock: product.stock });
  } catch (error) {
    console.error("❌ Error restoring stock:", error);
    res.status(500).json({ message: "Server error restoring stock" });
  }
});



router.put("/:id/update-stock", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const quantityChange = req.body.quantity || 0; // ✅ Difference in quantity

    if (quantityChange > 0 && product.stock < quantityChange) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    product.stock -= quantityChange; // ✅ Increase or decrease stock
    await product.save();

    res.json({ message: "Stock updated", stock: product.stock });
  } catch (error) {
    console.error("❌ Error updating stock:", error);
    res.status(500).json({ message: "Server error updating stock" });
  }
});

router.get("/category/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1); // Ensure category matches DB case
    const products = await Product.find({ category: capitalizedCategory });

    if (!products.length) {
      return res.status(404).json({ message: `No products found in category: ${capitalizedCategory}` });
    }

    res.json(products);
  } catch (error) {
    console.error("❌ Error fetching products by category:", error);
    res.status(500).json({ message: "Server error fetching products" });
  }
});


router.put("/:id", updateProduct);

export default router;
