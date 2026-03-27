import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

/* ===== MIDDLEWARE ===== */
app.use(express.json());
app.use(cors());

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
    date: { type: Date, default: Date.now }
  });

/* ===== ROUTES ===== */

// CREATE
app.post("/contact", async (req, res) => {
  try {
    await connectDB();

    const { name, email, message } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({ error: "Name and Email are required" });
    }

    const newContact = new Contact({ name, email, message });
    await newContact.save();

    res.status(201).json({ success: true, data: newContact });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ
app.get("/contact", async (req, res) => {
  try {
    await connectDB();
    const data = await Contact.find().sort({ date: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
app.put("/contact/:id", async (req, res) => {
  try {
    await connectDB();

    const updated = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
app.delete("/contact/:id", async (req, res) => {
  try {
    await connectDB();

    const deleted = await Contact.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("🚀 API Running Successfully");
});

/* ===== SERVER ===== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

/* ===== MIDDLEWARE ===== */
app.use(express.json());
app.use(cors());

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
    date: { type: Date, default: Date.now }
  });

/* ===== ROUTES ===== */

// CREATE
app.post("/contact", async (req, res) => {
  try {
    await connectDB();

    const { name, email, message } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({ error: "Name and Email are required" });
    }

    const newContact = new Contact({ name, email, message });
    await newContact.save();

    res.status(201).json({ success: true, data: newContact });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ
app.get("/contact", async (req, res) => {
  try {
    await connectDB();
    const data = await Contact.find().sort({ date: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
app.put("/contact/:id", async (req, res) => {
  try {
    await connectDB();

    const updated = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
app.delete("/contact/:id", async (req, res) => {
  try {
    await connectDB();

    const deleted = await Contact.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("🚀 API Running Successfully");
});

/* ===== SERVER ===== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});