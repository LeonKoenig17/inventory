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

// middleware/adminAuth.js
module.exports = function adminAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No credentials provided" });

  // Expect header: "Basic base64(username:password)"
  const base64Credentials = authHeader.split(" ")[1];
  const [username, password] = Buffer.from(base64Credentials, "base64").toString("ascii").split(":");

  // Compare with env variables
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    return next();
  } else {
    return res.status(403).json({ error: "Forbidden" });
  }
};

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

app.delete("/items", async (req, res) => {
  try {
    const { itemIds } = req.body;
    if (!itemIds || itemIds.length === 0) {
      return res.status(400).json({ error: "No item IDs provided" });
    }
    await supabase
      .from("items")
      .delete()
      .in("id", itemIds);
    if (itemsError) throw itemsError;
    res.json({ message: "Items deleted successfully" });
  } catch (err) {
    console.error("DELETE /items failed:", err.message);
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

app.patch("/boxes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const { data, error } = await supabase  
      .from("boxes")
      .update({name})
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("PATCH /boxes failed:", err.message);
    res.status(500).json({ error: err.message });
  }
})

app.delete("/boxes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from("boxes")
      .delete()
      .eq("id", id);
    if (error) throw error;
    res.json({ message: "Box deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/box_inventory", async (req, res) => {
  try {
    const boxId = req.query.box_id;
    const { data, error } = await supabase
      .from("box_inventory")
      .select(`
        quantity,
        items!inner(name)
      `)
      .eq("box_id", boxId);
    if (error) throw error;

    const inventory = data.map(row => ({
      item_name: row.items.name,
      quantity: row.quantity
    }));

    res.json(inventory);
  } catch (err) {
    console.error("GET /box_inventory failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post("/box_inventory", async (req, res) => {
  try {
    const { box_id, item_name, quantity } = req.body;
    let { data: item } = await supabase
      .from("items")
      .select("*")
      .eq("name", item_name)
      .single();
    if (!item) {
      const result = await supabase
        .from("items")
        .insert({ name: item_name })
        .select()
        .single();
      item = result.data;
    }
    const { error } = await supabase
      .from("box_inventory")
      .upsert({
        box_id,
        item_id: item.id,
        quantity
      });
    if (error) throw error;
    res.json({ item_name, quantity });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/search-items", async (req, res) => {
  try {
    const { query } = req.query;
    const { data, error } = await supabase
      .from("items")
      .select(`
        id,
        name,
        box_inventory (
          quantity,
          boxes ( name )
        )
      `)
      .ilike("name", `%${query}%`);
    if (error) throw error;
    const results = data.map(item => ({
      item_name: item.name,
      box_name: item.box_inventory[0]?.boxes.name,
      quantity: item.box_inventory[0]?.quantity
    }));
    res.json(results);
  } catch (err) {
    console.error("Search failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));