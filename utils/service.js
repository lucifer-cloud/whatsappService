const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

let client = null;

function initializeWhatsApp() {
    client = new Client({
        authStrategy: new LocalAuth({
            dataPath: '../.wwebjs_auth' // default path unless overridden
        }),
        puppeteer: {
            args: ['--no-sandbox', '--disable-setuid-sandbox']
          }        
    });

    client.on('qr', (qr) => {
        qrcode.generate(qr, { small: true });
        console.log('Scan this QR with WhatsApp!');
    });

    client.on('ready', () => {
        console.log('✅ WhatsApp client is ready!');
    });

    client.on('message', (msg) => {
        console.log(`📩 From ${msg.from}: ${msg.body}`);
    });

    client.initialize().catch((err) => {
        if (err.code === 'EBUSY') {
            console.warn('⚠️ Session log file is locked. Skipping deletion.');
        } else {
            console.error('❌ Initialization failed:', err);
        }
    });
}

async function sendMessage(number, message) {
    if (!client) throw new Error('WhatsApp client not initialized');

    const formattedNumber = number.includes('@c.us') ? number : `${number}@c.us`;

    try {
        return await client.sendMessage(formattedNumber, message);
    } catch (err) {
        console.error('❌ Failed to send WhatsApp message:', err);
        throw new Error('Failed to send WhatsApp message');
    }
}

module.exports = {
    initializeWhatsApp,
    sendMessage,
};
