// client/src/App.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  // 1. Data store karne ke liye jagah (State)
  const [products, setProducts] = useState([]);

  // 2. Jaise hi page load ho, ye function chalega
  useEffect(() => {
    // Backend (Waiter) ko awaaz lagao
    axios.get('http://localhost:5000/api/products')
      .then((response) => {
        console.log("Data mil gaya:", response.data);
        setProducts(response.data); // Data ko state mein daal do
      })
      .catch((error) => {
        console.error("Connection Error:", error);
      });
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🕵️‍♂️ Shopping Spy Dashboard</h1>
      
      {/* 3. Agar products hain, to unhe list karo */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {products.map((product) => (
          <div key={product._id} style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "8px", width: "250px" }}>
            <h3>{product.name}</h3>
            <p>💰 Price: <strong>₹{product.currentPrice}</strong></p>
            <a href={product.url} target="_blank" rel="noopener noreferrer">View on Amazon</a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;