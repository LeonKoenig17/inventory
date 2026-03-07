const express = require("express");
const { Pool } = require("pg");
import cors from "cors";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const app = express();
app.use(express.json());
app.use(cors());

app.get("/items", async (req, res) => {
  const result = await pool.query("SELECT * FROM items");
  res.json(result.rows);
});

app.post("/items", async (req, res) => {
  const { name, quantity } = req.body;
  await pool.query(
    "INSERT INTO items(name, quantity) VALUES ($1,$2)",
    [name, quantity]
  );
  res.json({ success: true });
});

app.listen(3000);