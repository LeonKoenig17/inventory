const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

router.get('/boxes', async (req, res) => {
  const result = await pool.query('SELECT * FROM boxes');
  res.json(result.rows);
});

router.post("/boxes", async (req, res) => {
    const { name } = req.body;
    const result = await pool.query(
        'INSERT INTO boxes (name) VALUES ($1) RETURNING *', 
        [name]
    );
    res.json(result.rows[0]);
});

router.get('/items', async (req, res) => {
  const result = await pool.query('SELECT * FROM items');
  res.json(result.rows);
});

router.post("/items", async (req, res) => {
    const { name } = req.body;
    const result = await pool.query(
        'INSERT INTO items (name) VALUES ($1) RETURNING *', 
        [name]
    );
    res.json(result.rows[0]);
});

router.get("/boxes/:name/items", async (req, res) => {
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

module.exports = router;