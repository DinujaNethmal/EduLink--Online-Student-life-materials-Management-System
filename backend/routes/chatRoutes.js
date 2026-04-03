const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Get list of users the current user has chatted with + unread counts
router.get('/contacts/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const messages = await Message.find({
            $or: [{ sender: email }, { receiver: email }]
        }).sort({ timestamp: -1 });

        const contactMap = new Map();
        
        for (const msg of messages) {
            const partner = msg.sender === email ? msg.receiver : msg.sender;
            if (!contactMap.has(partner)) {
                // Count unread messages FROM this partner TO me
                const unreadCount = await Message.countDocuments({
                    sender: partner,
                    receiver: email,
                    read: false
                });
                contactMap.set(partner, { email: partner, unreadCount });
            }
        }

        res.json(Array.from(contactMap.values()));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Mark messages as read between two users
router.post('/read/:currentUser/:partner', async (req, res) => {
    try {
        const { currentUser, partner } = req.params;
        await Message.updateMany(
            { sender: partner, receiver: currentUser, read: false },
            { $set: { read: true } }
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get chat history between two users
router.get('/:user1/:user2', async (req, res) => {
    try {
        const { user1, user2 } = req.params;
        const messages = await Message.find({
            $or: [
                { sender: user1, receiver: user2 },
                { sender: user2, receiver: user1 }
            ]
        }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
