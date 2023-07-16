const express = require('express');
const router = express.Router();
const Word = require('../models/word');
const jwt = require('jsonwebtoken');

// authenticate access token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, 'secret', (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};

// Create a new word. POST method is used
router.post('/', authenticateToken, (req, res) => {
    const { name } = req.body;
    const newWord = new Word({ name });

    newWord.save()
        .then((word) => {
            res.json(word);
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
});

// Retrieve all words. GET method is used
router.get('/', authenticateToken, (req, res) => {
    Word.find()
        .then((words) => {
            res.json(words);
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
});

// Retrieve a word by ID. GET method is used
router.get('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    Word.findById(id)
        .then((word) => {
            if (!word) {
                return res.status(404).json({ error: 'Word not found. Please try again!' });
            }
            res.json(word);
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
});

// Update a word by ID. PUT method is used
router.put('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    Word.findByIdAndUpdate(id, { name }, { new: true })
        .then((word) => {
            if (!word) {
                return res.status(404).json({ error: 'Word not found. Please try again!' });
            }
            res.json(word);
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
});

// Delete a word by ID. DELETE method is used
router.delete('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    Word.findByIdAndDelete(id)
        .then((word) => {
            if (!word) {
                return res.status(404).json({ error: 'Word not found. Please try again!' });
            }
            res.json({ message: 'Word deleted successfully' });
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
});

module.exports = router;
