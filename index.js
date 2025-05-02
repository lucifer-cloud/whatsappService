const express = require('express');
const { initializeWhatsApp, sendMessage } = require('./utils/service');
const basicAuth = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler'); // <-- import
const { sendMessageController } = require('./controllers/messageController');

const app = express();


app.use(express.json());

// Initialize WhatsApp
try {
    initializeWhatsApp();
} catch (err) {
    console.error('❌ Failed to initialize WhatsApp client:', err);
}

app.post('/send-message', basicAuth, sendMessageController);

// Global error handler
app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running at http://localhost:${process.env.PORT}`);
});
