// server.js
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'inventory',
  password: 'postanbesa17',
  port: 5432,
});

app.get('/boxes', async (req, res) => {
  const result = await pool.query('SELECT * FROM boxes');
  res.json(result.rows);
});

app.post("/boxes", async (req, res) => {
    const { name } = req.body;
    const result = await pool.query(
        'INSERT INTO boxes (name) VALUES ($1) RETURNING *', 
        [name]
    );
    res.json(result.rows[0]);
});

app.get('/items', async (req, res) => {
  const result = await pool.query('SELECT * FROM items');
  res.json(result.rows);
});

app.post("/items", async (req, res) => {
    const { name } = req.body;
    const result = await pool.query(
        'INSERT INTO items (name) VALUES ($1) RETURNING *', 
        [name]
    );
    res.json(result.rows[0]);
});

app.get("/boxes/:name/items", async (req, res) => {
  try {
    const { name } = req.params;
    const result = await pool.query(
      `SELECT items.name AS item_name, bi.quantity
       FROM box_inventory bi
       JOIN items ON bi.item_id = items.id
       JOIN boxes ON bi.box_id = boxes.id
       WHERE boxes.name = $1`,
      [name]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});