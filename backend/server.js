// server.js
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Use your correct DATABASE_URL in Render environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Test route
app.get("/", (req, res) => {
  res.send("API running");
});

// Ensure the items table exists before GET/POST
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS items (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        quantity INT NOT NULL
      );
    `);
    console.log("Items table ready");
  } catch (err) {
    console.error("Failed to create items table:", err.message);
  }
})();

// GET items
app.get("/items", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM items");
    res.json(result.rows);
  } catch (err) {
    console.error("GET /items failed:", err.message);
    res.status(500).json({ error: "Database query failed", details: err.message });
  }
});

// POST items
app.post("/items", async (req, res) => {
  try {
    const { name, quantity } = req.body;
    if (!name || !quantity) return res.status(400).json({ error: "Missing name or quantity" });

    await pool.query(
      "INSERT INTO items(name, quantity) VALUES ($1, $2)",
      [name, quantity]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("POST /items failed:", err.message);
    res.status(500).json({ error: "Insert failed", details: err.message });
  }
});

// Dynamic port for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});