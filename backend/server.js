import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

/* ===== MIDDLEWARE ===== */
app.use(express.json());
app.use(cors({
  origin: "*"
}));

/* ===== DB CONNECTION ===== */
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) return;

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB error:", err.message);
  }
};

/* ===== SCHEMA ===== */
const Contact =
  mongoose.models.Contact ||
  mongoose.model("Contact", {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String },
    date: { type: Date, default: Date.now },
  });

/* ===== ROUTES ===== */

// ✅ Test route
app.get("/", (req, res) => {
  res.send("🚀 API Running Successfully");
});

// ✅ CREATE
app.post("/contact", async (req, res) => {
  try {
    await connectDB();

    const { name, email, message } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: "Name and Email are required",
      });
    }

    const newContact = new Contact({ name, email, message });
    await newContact.save();

    res.status(201).json({
      success: true,
      message: "Contact saved successfully ✅",
      data: newContact,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

// ✅ READ
app.get("/contact", async (req, res) => {
  try {
    await connectDB();

    const data = await Contact.find().sort({ date: -1 });

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

// ✅ UPDATE
app.put("/contact/:id", async (req, res) => {
  try {
    await connectDB();

    const updated = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: "Not found",
      });
    }

    res.json({
      success: true,
      message: "Updated successfully ✏️",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

// ✅ DELETE
app.delete("/contact/:id", async (req, res) => {
  try {
    await connectDB();

    const deleted = await Contact.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: "Not found",
      });
    }

    res.json({
      success: true,
      message: "Deleted successfully 🗑️",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

/* ===== SERVER ===== */
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
