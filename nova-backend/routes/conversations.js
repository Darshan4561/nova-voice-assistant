const express = require('express');
const router = express.Router();

// Mock conversations database
let conversations = [];

// Save conversation
router.post('/', (req, res) => {
    try {
        const { userId, userMessage, assistantResponse } = req.body;

        const conversation = {
            id: conversations.length + 1,
            userId: userId || 'anonymous',
            userMessage,
            assistantResponse,
            timestamp: new Date().toISOString()
        };

        conversations.push(conversation);

        // Keep only last 100 conversations
        if (conversations.length > 100) {
            conversations = conversations.slice(-100);
        }

        res.status(201).json({
            success: true,
            conversation
        });

    } catch (error) {
        console.error('Error saving conversation:', error);
        res.status(500).json({
            error: 'Failed to save conversation',
            message: error.message
        });
    }
});

// Get conversations for user
router.get('/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const { limit = 50, page = 1 } = req.query;

        let userConversations = conversations.filter(c => c.userId === userId);
        
        // Sort by timestamp (newest first)
        userConversations.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Pagination
        const start = (page - 1) * limit;
        const end = start + parseInt(limit);
        const paginated = userConversations.slice(start, end);

        res.json({
            success: true,
            conversations: paginated,
            total: userConversations.length,
            page: parseInt(page),
            limit: parseInt(limit),
            hasMore: end < userConversations.length
        });

    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({
            error: 'Failed to fetch conversations',
            message: error.message
        });
    }
});

// Delete conversation
router.delete('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const index = conversations.findIndex(c => c.id === parseInt(id));

        if (index === -1) {
            return res.status(404).json({
                error: 'Conversation not found'
            });
        }

        conversations.splice(index, 1);

        res.json({
            success: true,
            message: 'Conversation deleted'
        });

    } catch (error) {
        console.error('Error deleting conversation:', error);
        res.status(500).json({
            error: 'Failed to delete conversation',
            message: error.message
        });
    }
});

// Clear all conversations for user
router.delete('/user/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        
        conversations = conversations.filter(c => c.userId !== userId);

        res.json({
            success: true,
            message: 'All conversations cleared'
        });

    } catch (error) {
        console.error('Error clearing conversations:', error);
        res.status(500).json({
            error: 'Failed to clear conversations',
            message: error.message
        });
    }
});

module.exports = router;
