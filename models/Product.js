const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  url: {
    type: String,
    require: true,
  },
  currentPrice: {
    type: Number,
    require: true,
  },
  priceHistory: [
    {
      price: Number,
      date: { type: Date, default: Date.now },
    },
  ],
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
