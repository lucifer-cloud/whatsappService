const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

let client = null;

function initializeWhatsApp() {
    client = new Client({
        authStrategy: new LocalAuth(),
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

    client.initialize();
}

async function sendMessage(number, message) {
    if (!client) throw new Error('WhatsApp client not initialized');

    const formattedNumber = number.includes('@c.us') ? number : `${number}@c.us`;
    return client.sendMessage(formattedNumber, message);
}

module.exports = {
    initializeWhatsApp,
    sendMessage,
};
