// utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async (productName, price, url) => {
    try {
        // 1. Setup - Kis email se bhejna hai
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'atifatul752@gmail.com', // 🔴 Yahan apna asli Gmail likho
                pass: 'tiwmlhgrdbxbzili'      // 🔴 Yahan wo 16-digit App Password (spaces hata dena)
            }
        });

        // 2. Email Content - Kya likhna hai
        const mailOptions = {
            from: 'Shopping Spy Bot 🕵️‍♂️',
            to: 'mdatif.reyyani.cs.2021@mitmeerut.ac.in', // Kisko bhejna hai (Abhi khud ko hi bhejo)
            subject: `🔥 Price Drop Alert: ${productName}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;">
                    <h2 style="color: #28a745;">Price Gir Gayi Hai! 📉</h2>
                    <p>Jasoos ne nayi deal pakdi hai:</p>
                    <hr/>
                    <h3>${productName}</h3>
                    <p style="font-size: 18px;">Nayi Price: <strong>₹${price}</strong></p>
                    <br/>
                    <a href="${url}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Amazon par Kharido</a>
                </div>
            `
        };

        // 3. Send
        await transporter.sendMail(mailOptions);
        console.log("📧 Email Sent Successfully!");

    } catch (error) {
        console.error("❌ Email Error:", error);
    }
};

module.exports = sendEmail;