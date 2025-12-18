// 1. Zaroori tools (Libraries) manga rahe hain
const express = require('express'); 
const cors = require('cors');
const connectDB = require('./config/db'); // Munshi ji (Database connection)
const scrapeProduct = require('./scraper'); // Humara Jasoos (Scraper function)

// 2. Server create kar rahe hain
const app = express();

// 3. Rules set kar rahe hain (Middleware)
app.use(cors()); // Security Guard: Sabko allow karo (Frontend se request aane do)
app.use(express.json()); // Translator: Jo data aaye, usse JSON mein samjho

// 4. Database se connect ho jao
connectDB();

