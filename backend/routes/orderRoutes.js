import express from "express";
import Order from "../models/Order.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Place a New Order
router.post("/", protect, async (req, res) => {
  try {
    const { products, totalAmount } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No products in order" });
    }

    const order = new Order({
      customer: req.user._id,
      products,
      totalAmount,
      status: "Pending",
    });

    await order.save();
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("❌ Error placing order:", error);
    res.status(500).json({ message: "Server error placing order" });
  }
});

// ✅ Get Orders for a Customer
router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find().populate("customer", "name email"); // ✅ Populate customer info
    res.json(orders);
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ message: "Server Error: Unable to fetch orders" });
  }
});


// ✅ Update Order Status
router.put("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = req.body.status;
    await order.save();
    res.json({ message: "Order status updated", order });
  } catch (error) {
    console.error("❌ Error updating order:", error);
    res.status(500).json({ message: "Server Error: Unable to update order" });
  }
});

// ✅ Delete Order
router.delete("/:id", protect, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting order:", error);
    res.status(500).json({ message: "Server Error: Unable to delete order" });
  }
});

4

// ✅ Cancel an Order (Only if Pending)
router.put("/:id/cancel", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "Pending") {
      return res.status(400).json({ message: "Only pending orders can be cancelled" });
    }

    order.status = "Cancelled";
    await order.save();

    res.json({ message: "Order cancelled successfully" });
  } catch (error) {
    console.error("❌ Error cancelling order:", error);
    res.status(500).json({ message: "Server error cancelling order" });
  }
});

export default router;
