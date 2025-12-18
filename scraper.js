const puppeteer = require('puppeteer');
// const connectDB = require('./config/db');
const Product = require('./models/Product');

// Step 1: Database se connection jodo (Munshi ji ko bulao)
// connectDB();

async function scrapeProduct(url) {
    console.log("🕵️‍♂️ Jasoosi shuru... (Scraping Start)");

    // Step 2: Browser launch karo (Jaise Chrome par click karte hain)
    // headless: false ka matlab browser humein dikhega khulta hua
    const browser = await puppeteer.launch({ headless: false }); 
    
    // Step 3: Naya tab kholo
    const page = await browser.newPage();
    
    // Step 4: Amazon ko ullu banao (User Agent set karo)
    // Taaki Amazon ko lage ye koi insaan chala raha hai, bot nahi
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');

    try {
        // Step 5: URL par jao
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        
        // Thoda wait karo taaki page poora load ho jaye
        await new Promise(r => setTimeout(r, 2000));

        // Step 6: Page ke andar ghus kar data nikalo (DOM Manipulation)
        const productData = await page.evaluate(() => {
            // HTML mein se Title aur Price dhundo
            const titleElement = document.querySelector('#productTitle');
            const priceElement = document.querySelector('.a-price-whole'); // Amazon ka price class
            
            // Text nikalo aur saaf karo (trim)
            const title = titleElement ? titleElement.innerText.trim() : 'Unknown Product';
            
            // Price text (e.g., "50,000") ko Number (50000) mein badlo
            // 'replace' function comma (,) aur baaki kachra hata deta hai
            const priceText = priceElement ? priceElement.innerText.replace(/[^0-9]/g, '') : '0'; 
            
            // Data wapas bhejo
            return { title, price: parseInt(priceText) };
        });

        console.log(`📦 Product Mila: ${productData.title}`); 
        console.log(`💰 Price Mila: ₹${productData.price}`);

        // Step 7: Database logic (Check karo aur Save karo)
        if (productData.price > 0) {
            // Check: Kya ye product pehle se DB mein hai?
            let product = await Product.findOne({ url: url });

            if (product) {
                // CASE A: Product purana hai -> Update karo
                console.log("🔄 Product pehle se saved hai. History update kar raha hu...");
                product.currentPrice = productData.price;
                // Nayi price aur aaj ki date history array mein daal do
                product.priceHistory.push({ price: productData.price });
                await product.save();
                console.log("✅ Database Updated Successfully!");
            } else {
                // CASE B: Product naya hai -> Naya banao
                console.log("🆕 Naya product mila. Database mein entry kar raha hu...");
                product = await Product.create({
                    name: productData.title,
                    url: url,
                    currentPrice: productData.price,
                    priceHistory: [{ price: productData.price }]
                });
                console.log("✅ New Product Saved to MongoDB!");
            }
            return product;
        } else {
            console.log("❌ Price fetch nahi ho paaya (Shayad Amazon ne rok diya).");
            return null; 
        }

    } catch (error) {
        // Agar kuch phata toh yahan error dikhega
        console.error("❌ Error aaya:", error);
        return null;
    } finally {
        // Step 8: Sab kaam hone ke baad browser band karo
        await browser.close();
        console.log("🔒 Jasoosi Khatam. Browser Closed.");
    }
}

// // Jis product ko track karna hai uska link yahan daalo
// const productUrl="https://www.amazon.in/OnePlus-Forest-Green-Storage-SuperVOOC/dp/B09WRMNJ9G?th=1"; 

// // Function ko call karo
// scrapeProduct(productUrl);

module.exports=scrapeProduct