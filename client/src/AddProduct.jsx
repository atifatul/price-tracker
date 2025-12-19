// client/src/AddProduct.jsx

import { useState } from 'react';
import axios from 'axios';

// Props: 'onProductAdded' ek function hai jo hum Parent (App.jsx) se mangenge.
// Iska kaam hai: Jab naya product add ho jaye, toh list ko refresh karna.
function AddProduct({ onProductAdded }) {
  
  // 1. STATE: User ka input aur Loading status handle karne ke liye
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false); 

  // 2. LOGIC: Jab Form submit hoga tab kya karna hai
  const handleSubmit = async (e) => {
    e.preventDefault(); // Page ko refresh hone se roko
    
    // Agar box khali hai toh gussa karo
    if (!url) return alert("Bhai, Link toh daalo!");

    setLoading(true); // Loading shuru (Button disable karne ke liye)
    
    try {
      // Backend ko data bhejo (POST request)
      // Hum body mein { url: "amazon..." } bhej rahe hain
      await axios.post('http://localhost:5000/api/products', { url });
      
      // Agar sab sahi raha:
      alert("Jasoosi Shuru! Product add ho gaya.");
      setUrl(''); // Input box ko wapas khali kar do
      onProductAdded(); // Parent ko bolo: "List refresh karo, naya maal aaya hai"

    } catch (error) {
      console.error("Error adding product:", error);
      alert("Gadbad ho gayi. Shayad link galat hai ya Amazon ne rok diya.");
    } finally {
      setLoading(false); // Loading khatam (chahe success ho ya fail)
    }
  };

  // 3. DESIGN (JSX)
  return (
    <div style={{ margin: "20px 0", padding: "15px", border: "2px dashed #ddd", borderRadius: "10px" }}>
      <h3>🆕 Naya Product Track Karein</h3>
      
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px" }}>
        <input 
          type="text" 
          placeholder="Yahan Amazon ka link paste karein..." 
          value={url}
          // Jaise hi user type kare, state update karo
          onChange={(e) => setUrl(e.target.value)}
          style={{ flex: 1, padding: "10px" }}
          disabled={loading} // Jab loading ho, user type na kar sake
        />
        
        <button 
          type="submit" 
          style={{ 
            padding: "10px 20px", 
            cursor: loading ? "not-allowed" : "pointer", 
            backgroundColor: loading ? "#ccc" : "#28a745", // Loading mein grey, werna green
            color: "white", 
            border: "none",
            borderRadius: "5px"
          }}
          disabled={loading}
        >
          {loading ? "Jasoos gaya hai..." : "Track Price"}
        </button>
      </form>
    </div>
  );
}

export default AddProduct;