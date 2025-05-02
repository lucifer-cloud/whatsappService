const express = require('express');
const { initializeWhatsApp, sendMessage } = require('./service');

const app = express();
const port = 3000;

app.use(express.json());

// Initialize WhatsApp
initializeWhatsApp();

// Routes
app.get('/', (req, res) => {
    res.send('WhatsApp API is running');
});

app.post('/send-message', async (req, res) => {
    const { number, message } = req.body;

    if (!number || !message) {
        return res.status(400).send('Missing number or message');
    }

    try {
        await sendMessage(number, message);
        res.send(`✅ Message sent to ${number}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('❌ Failed to send message');
    }
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
