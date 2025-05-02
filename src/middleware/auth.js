
require('dotenv').config(); 
const USERNAME = process.env.AUTH_USERNAME;
const PASSWORD = process.env.AUTH_PASSWORD;

function cehckAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        res.setHeader('WWW-Authenticate', 'Basic');
        return res.status(401).send('Authentication required');
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    if (username === USERNAME && password === PASSWORD) {
        return next();
    }

    res.status(403).send('Access denied');
}

module.exports = cehckAuth;
