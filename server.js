// server.js - Yeh humara Head Office hai

// 1. Zaroori tools (Libraries) manga rahe hain
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // Munshi ji (Database connection)
const Product = require("./models/Product"); // Product model
const scrapeProduct = require("./scraper"); // Humara Jasoos (Scraper function)

const cron = require("node-cron");
// 2. Server create kar rahe hain
const app = express();

// 3. Rules set kar rahe hain (Middleware)
app.use(cors()); // Security Guard: Sabko allow karo (Frontend se request aane do)
app.use(express.json()); // Translator: Jo data aaye, usse JSON mein samjho

// 4. Database se connect ho jao
connectDB();

// ---------------- ROUTES (Kaam ki list) ---------------- //

// TEST ROUTE: Sirf check karne ke liye ki server zinda hai
app.get("/", (req, res) => {
  res.send("Shopping Spy Backend bilkul sahi chal raha hai! 🚀");
});

// ROUTE A: Naya Product Track karne ke liye (Jab user link dega)
// Method: POST (Kyunki hum server ko data de rahe hain)
app.post("/api/products", async (req, res) => {
  try {
    const { url } = req.body; // Frontend se URL nikaalo

    if (!url) {
      return res.status(400).json({ msg: "Bhai URL toh do!" });
    }

    // Jasoos ko kaam pe lagao (Scraper call karo)
    const product = await scrapeProduct(url);

    if (product) {
      // Agar product mil gaya aur save ho gaya
      res.status(201).json(product);
    } else {
      res.status(500).json({ msg: "Scraping fail ho gayi." });
    }
  } catch (error) {
    res.status(500).send("Server Error aagaya bhai.");
  }
});

// ROUTE B: Saare Saved Products dekhne ke liye
// Method: GET (Kyunki hum data maang rahe hain)
app.get("/api/products", async (req, res) => {
  try {
    // Database se saare products maango
    // .sort({ date: -1 }) ka matlab latest wala sabse upar dikhega
    // const Product = require('./models/Product');
    const products = await Product.find().sort({ date: -1 });

    res.json(products); // Data wapas bhej do
  } catch (error) {
    res.status(500).send("Server Error aagaya.");
  }
});

// ---------------- ✅ AUTOMATION ENGINE (CRON JOB) ---------------- //

// Syntax: cron.schedule(' * * * * * ', function)
// Iska matlab: "Har minute run karo"
cron.schedule("*/30 * * * *", async () => {
  console.log("⏰ Running Cron Job: Tracking Prices...");

  try {
    // 1. Database se saare products lao
    const products = await Product.find();

    if (products.length === 0) {
      console.log("📭 Database khali hai, kuch track nahi karna.");
      return;
    }

    // 2. Ek-ek karke sabko re-check karo
    for (const product of products) {
      console.log(`🕵️‍♂️ Checking: ${product.name}`);

      // Wahi purana scraper function use karo update karne ke liye
      await scrapeProduct(product.url);
    }

    console.log("✅ All products checked!");
  } catch (error) {
    console.error("❌ Cron Job Error:", error);
  }
});

// 5. Server ko start karo (Port 5000 par)
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
