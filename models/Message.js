const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    ip: { type: String, required: true },
    sentEmail: { type: Boolean, required: true }
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;