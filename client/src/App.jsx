import { useEffect, useState } from 'react';
import axios from 'axios';
import AddProduct from './AddProduct'; // ✅ Import toh sahi tha

function App() {
  // 1. Data store karne ke liye jagah (State)
  const [products, setProducts] = useState([]);

  // ✅ Ye Helper Function hai: Backend se list lane ka kaam karega.
  // Humne isse alag isliye banaya taaki jab naya product add ho, 
  // toh hum isse dobara call karke list refresh kar sakein.
  const fetchProducts = () => {
    console.log("Fetching products..."); // Debugging ke liye
    axios.get('http://localhost:5000/api/products')
      .then((response) => {
        console.log("Data mil gaya:", response.data);
        setProducts(response.data); // Purana data hata ke naya set karo
      })
      .catch((error) => console.error("Error:", error));
  };

  // 2. Jaise hi page load ho, ye function chalega (Sirf ek baar)
  useEffect(() => {
    fetchProducts();
  }, []);

  // ❌ Maine yahan se dusra wala 'useEffect' hata diya hai.
  // Kyunki upar wala useEffect same kaam kar raha hai. 
  // Do baar likhne se server par load badhta hai.

  return (
    <div style={{ padding: "40px", fontFamily: "Arial", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>🕵️‍♂️ Shopping Spy Dashboard</h1>
      
      {/* ✅ NEW ADDITION: Form yahan lagaya hai */}
      {/* 'onProductAdded' ek prop hai. Hum Form ko bol rahe hain: 
          "Beta, jab tumhara kaam (add karna) khatam ho jaye, toh 'fetchProducts' chala dena" */}
      <AddProduct onProductAdded={fetchProducts} />

      <hr style={{ margin: "30px 0" }} />

      {/* 3. Agar products hain, to unhe list karo */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        
        {/* Agar list khali hai toh user ko batao */}
        {products.length === 0 && <p>Abhi koi data nahi hai...</p>}

        {products.map((product) => (
          <div key={product._id} style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px", width: "100%", backgroundColor: "#f9f9f9" }}>
            <h3 style={{ margin: "0 0 10px 0" }}>{product.name}</h3>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ margin: 0 }}>💰 Price: <strong>₹{product.currentPrice}</strong></p>
                <a href={product.url} target="_blank" rel="noopener noreferrer" style={{ color: "blue" }}>View on Amazon</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;