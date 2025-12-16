const puppeteer = require('puppeteer');

async function scrapeProduct(url) {
    console.log("🕵️‍♂️ Jasoosi shuru kar raha hu... Browser khul raha hai.");

    // Browser launch karo (headless: false ka matlab browser dikhega)
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // ⚠️ IMPORTANT: Amazon ko lagna chahiye ki hum insaan hain, bot nahi.
    // Isliye hum User-Agent set karte hain.
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');

    try {
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        // Page load hone ka thoda wait karo
        // (Kabhi kabhi selectors load hone mein time lagte hain)
        await new Promise(r => setTimeout(r, 2000)); 

        // Data nikaalne ka logic (DOM Manipulation)
        const productData = await page.evaluate(() => {
            // Yeh IDs Amazon page se li gayi hain, future mein badal sakti hain
            const titleElement = document.querySelector('#productTitle');
            const priceElement = document.querySelector('.a-price-whole'); 
            
            // Text saaf karo (trim)
            const title = titleElement ? titleElement.innerText.trim() : 'Title nahi mila';
            const price = priceElement ? priceElement.innerText.replace('\n', '') : 'Price nahi mila';

            return { title, price };
        });

        console.log("------------------------------------------------");
        console.log("📦 Product Name:", productData.title);
        console.log("💰 Current Price: ₹" + productData.price);
        console.log("------------------------------------------------");

    } catch (error) {
        console.error("❌ Error aaya:", error);
    } finally {
        // Kaam hone ke baad browser band karo
        await browser.close();
        console.log("🔒 Jasoosi khatam.");
    }
}

// Yahan wo product URL daalo jise test karna hai (koi bhi Amazon link)
const productUrl = 'https://www.amazon.in/Apple-iPhone-13-128GB-Midnight/dp/B09G9HD6PD/'; 

scrapeProduct(productUrl);