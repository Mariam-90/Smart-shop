const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { Message } = require('../models/message');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'message-uploads/';
        console.log(`Saving file to directory: ${uploadDir}`);
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const fileName = Date.now() + path.extname(file.originalname);
        console.log(`Saving file with name: ${fileName}`);
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });

// נתיב לקבלת הודעות מהטופס
router.post('/', upload.array('files'), async (req, res) => {
    try {
        console.log('Received contact form submission:', req.body);
        console.log('Received files:', req.files);

        const { name, email, message } = req.body;
        const files = req.files.map(file => file.filename);

        const newMessage = new Message({ name, email, message, files });
        await newMessage.save();

        res.status(200).json({ message: 'Message received' });
    } catch (error) {
        console.error('Error receiving message:', error);
        res.status(500).json({ message: 'Error receiving message' });
    }
});

// נתיב להצגת ההודעות למנהל
router.get('/', async (req, res) => {
    try {
        const messages = await Message.find().sort({ date: -1 });
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Error fetching messages' });
    }
});

// נתיב למחיקת הודעה
router.delete('/:id', async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Message deleted' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ message: 'Error deleting message' });
    }
});

// נתיב לסימון הודעה כטופלה
router.put('/:id', async (req, res) => {
    try {
        const message = await Message.findByIdAndUpdate(req.params.id, { treated: true }, { new: true });
        res.status(200).json(message);
    } catch (error) {
        console.error('Error updating message:', error);
        res.status(500).json({ message: 'Error updating message' });
    }
});

module.exports = router;
