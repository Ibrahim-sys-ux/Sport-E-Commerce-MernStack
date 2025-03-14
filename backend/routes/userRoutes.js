import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Register a new user (Customer or Admin)
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
});

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  };
  
  // ✅ Login User (Customer or Admin)
  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      // ✅ Generate a proper JWT token
      const token = generateToken(user._id);
  
      res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
    } catch (error) {
      res.status(500).json({ message: "Error logging in" });
    }
  });
  
// ✅ Get User Profile (Protected Route)
router.get("/profile", protect, async (req, res) => {
  res.json(req.user);
});

// ✅ Get All Users (Admin Only)
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}, "name email role"); // ✅ Get only necessary fields
    res.json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: "Server Error: Unable to fetch users" });
  }
});

// ✅ Delete a User (Admin only)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    res.status(500).json({ message: "Server Error: Unable to delete user" });
  }
});

// ✅ Promote User to Admin (Admin only)
router.put("/:id/make-admin", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = "Admin";
    await user.save();
    res.json({ message: "User promoted to Admin", user });
  } catch (error) {
    console.error("❌ Error promoting user:", error);
    res.status(500).json({ message: "Server Error: Unable to promote user" });
  }
});



export default router;
