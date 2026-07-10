// =========================================================
// MANSTAL LIMITED — CONTACT FORM BACKEND
// =========================================================
// What this file does, in plain terms:
// 1. Starts a tiny web server.
// 2. Listens for your contact form to POST its data to it.
// 3. Emails that data to you using your Gmail account.
// 4. Sends a success/fail response back to the website.
//
// You do NOT need to understand every line — just follow
// SETUP-INSTRUCTIONS.txt in this same folder.
// =========================================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

// Allows your website (running on a different address) to
// talk to this server. In production, replace '*' with your
// real website domain for better security.
app.use(cors());

// Lets the server understand JSON sent from the form.
app.use(express.json());

// -----------------------------------------------------------
// Sets up the "mail truck" that will carry the email.
// Uses your Gmail account + an App Password (see setup notes).
// -----------------------------------------------------------
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER, // your Gmail address
        pass: process.env.GMAIL_APP_PASSWORD // 16-character App Password
    }
});

// -----------------------------------------------------------
// The actual endpoint the contact form sends data to.
// URL will be: http://localhost:3000/api/contact
// -----------------------------------------------------------
app.post('/api/contact', async (req, res) => {
    const { firstName, lastName, email, subject, message } = req.body;

    // Basic check — make sure nothing important is missing.
    if (!firstName || !lastName || !email || !subject || !message) {
        return res.status(400).json({ success: false, error: 'Missing required fields.' });
    }

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: process.env.CONTACT_RECEIVER_EMAIL || process.env.GMAIL_USER,
        replyTo: email, // so hitting "Reply" in your inbox replies to the customer
        subject: `Website Enquiry - ${subject}`,
        text: `Name: ${firstName} ${lastName}\nEmail: ${email}\nReason: ${subject}\n\nMessage:\n${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Email sent successfully.' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, error: 'Failed to send email.' });
    }
});

// Simple health check — visiting this in a browser confirms
// the server is alive.
app.get('/', (req, res) => {
    res.send('Manstal Limited contact form backend is running.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
