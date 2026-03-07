const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.get("/", (req, res) => {
  res.send("Backend is running! Use /users for API data.");
});

app.get("/users", async (req, res) => {
  const result = await pool.query("SELECT * FROM capitals");
  res.json(result.rows);
});

app.post("/users", async (req, res) => {
  const { name, email } = req.body;

  const result = await pool.query(
    "INSERT INTO users (name,email) VALUES ($1,$2) RETURNING *",
    [name, email]
  );

  res.json(result.rows[0]);
});

app.listen(3000, () => {
  console.log("Server running");
});