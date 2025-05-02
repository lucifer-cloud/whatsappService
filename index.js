require('dotenv').config(); 
const express = require('express');
const qrcode  = require('qrcode-terminal');
const { Client, LocalAuth  } = require('whatsapp-web.js');
const cehckAuth = require('./src/middleware/auth');

const app = express();
const client = new Client();


app.use(express.json());

client.on('qr', (qr) => {
    
    qrcode.generate(qr, { small: true });
    console.log('Scan QR Code !');
    
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', msg => {
    if (msg.body == '!ping') {
        msg.reply('pong');
    }
});

client.initialize();

app.post('/send-message', cehckAuth, async (req, res, next) => {
    try {
        const { number, message } = req.body;
        if (!number || !message) {
            return res.json({msg:"number or message is missing"})
        }
        if (!client) throw new Error('WhatsApp client not initialized');
        const formattedNumber = number.includes('@c.us') ? number : `${number}@c.us`;
        await client.sendMessage(formattedNumber, message);
        res.status(200).json({ success: true, message: `✅ Message sent to ${number}` });
    } catch (err) {
        next(err);
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});
app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`);
});