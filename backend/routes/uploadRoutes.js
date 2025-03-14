import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// ✅ Ensure "uploads/" folder exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ✅ Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// ✅ Upload API
router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "❌ No file uploaded." });

  const imageUrl = `/uploads/${req.file.filename}`;
  console.log("✅ Image stored at:", imageUrl);
  res.json({ imageUrl });
});

export default router;
