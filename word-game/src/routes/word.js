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
/**
 * @swagger
 * components:
 *   schemas:
 *     Word:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the word
 */
/**
 * @swagger
 * /api/words:
 *   post:
 *     summary: Create a new word
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the word
 *             example:
 *               name: example
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Word'
 *       '500':
 *         description: Internal server error
 */
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
/**
 * @swagger
 * /api/words:
 *   get:
 *     summary: Retrieve all words
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Word'
 *       '500':
 *         description: Internal server error
 */
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
/**
 * @swagger
 * /api/words/{id}:
 *   get:
 *     summary: Retrieve a word by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the word
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Word'
 *       '404':
 *         description: Word not found
 *       '500':
 *         description: Internal server error
 */
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
/**
 * @swagger
 * /api/words/{id}:
 *   put:
 *     summary: Update a word by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the word
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the word
 *             example:
 *               name: updated example
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Word'
 *       '404':
 *         description: Word not found
 *       '500':
 *         description: Internal server error
 */
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
/**
 * @swagger
 * /api/words/{id}:
 *   delete:
 *     summary: Delete a word by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the word
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The success message
 *       '404':
 *         description: Word not found
 *       '500':
 *         description: Internal server error
 */
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
