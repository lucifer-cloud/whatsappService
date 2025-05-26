require('dotenv').config(); 
const express = require('express');
const qrcode  = require('qrcode-terminal');
const QRCode = require('qrcode');
const cors = require('cors');

const { Client  } = require('whatsapp-web.js');

const cehckAuth = require('./src/middleware/auth');
const logger = require('./logger');
const updateStatus = require('./src/service/updateStatus');

const app = express();
app.use(cors()); 
const client = new Client({
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});
let latestQRCode = null; 

app.use(express.json());

client.on('qr', (qr) => {
    latestQRCode = qr;
    qrcode.generate(qr, { small: true });
    console.log('Scan QR Code !');
    // logger.info(`QR content: ${qr}`);    
});

client.on('ready', async () => {
    console.log('Client is ready!');
    await updateStatus('active');
});

client.on('message', msg => {
    if (msg.body == '!ping') {
        msg.reply('pong');
    }
});
client.on('disconnected', async (reason) => {
    logger.info(`WhatsApp client disconnected: ${reason}`);
    await updateStatus('inactive');
});
client.on('auth_failure', msg => {
    logger.error(`Authentication failure: ${msg}`);
});

client.initialize();
app.get('/qr-image', async (req, res) => {
    if (!latestQRCode) {
        return res.status(404).json({ error: 'QR Code not generated yet' });
    }

    try {
        const qrImage = await QRCode.toDataURL(latestQRCode);
        res.status(200).json({ image: qrImage });
    } catch (err) {
        res.status(500).json({ error: 'Failed to generate QR image' });
    }
});
app.post('/send-message', cehckAuth, async (req, res, next) => {
    try {
        const { number, message } = req.body;
        if (!number || !message) {
             logger.warn('Missing number or message in request.');
            return res.json({msg:"number or message is missing"})
        }
        if (!client) throw new Error('WhatsApp client not initialized');
        const formattedNumber = number.includes('@c.us') ? number : `${number}@c.us`;
        await client.sendMessage(formattedNumber, message);
        logger.info(`Message sent to ${number} (${formattedNumber})`);
        res.status(200).json({ success: true, message: `✅ Message sent to ${number}` });
    } catch (err) {
        next(err);
    }
});

app.use(async (err, req, res, next) => {
    await updateStatus('inactive'); // ⬅️ Await here
    console.error(err.stack);
    logger.error(`Unhandled error: ${err.stack}`);
    res.status(500).json({ error: 'Internal Server Error' });
});
app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`);
});