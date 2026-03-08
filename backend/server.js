require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(express.json());
app.use(cors());

// Supabase client (use SERVICE_ROLE_KEY for server)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Test route
app.get("/", (req, res) => res.send("API running"));

// Get all items
app.get("/items", async (req, res) => {
  try {
    const { data, error } = await supabase.from("items").select("*");
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("GET /items failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Add an item
app.post("/items", async (req, res) => {
  try {
    const { name, quantity } = req.body;
    const { data, error } = await supabase.from("items").insert([{ name, quantity }]);
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    console.error("POST /items failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("/boxes", async (req, res) => {
  try {
    const { data, error } = await supabase.from("boxes").select("*");
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("GET /boxes failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post("/boxes", async (req, res) => {
  try {
    const { name } = req.body;
    const { data, error } = await supabase.from("boxes").insert([{ name }]);
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    console.error("POST /boxes failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("/box_inventory", async (req, res) => {
  try {
    const { boxId } = req.query.box_id;
    const { data, error } = await supabase
    .from("box_inventory")
    .select("boxes(name), items(name), quantity")
    .eq("box_id", boxId )
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("GET /inventory failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));