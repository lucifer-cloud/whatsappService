const { sendMessage } = require('../utils/service');
const CustomError = require('../utils/CustomError');

exports.sendMessageController = async (req, res, next) => {
    try {
        const { number, message } = req.body;

        if (!number || !message) {
            throw new CustomError('Missing number or message', 400);
        }

        await sendMessage(number, message);
        res.status(200).json({ success: true, message: `✅ Message sent to ${number}` });
    } catch (err) {
        next(err);
    }
};
