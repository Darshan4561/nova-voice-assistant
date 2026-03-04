// MongoDB Schema for Conversation (optional - for when you add MongoDB)
const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    userMessage: {
        type: String,
        required: true
    },
    assistantResponse: {
        type: String,
        required: true
    },
    language: {
        type: String,
        default: 'en'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
ConversationSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model('Conversation', ConversationSchema);
