const express = require('express');
const router = express.Router();
const Word = require('../models/word');
const Game = require('../models/game');
const Try = require('../models/try');
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

/**
 * @swagger
 * components:
 *   schemas:
 *     Try:
 *       type: object
 *       properties:
 *         word:
 *           type: string
 *           description: The word that was tried
 *         result:
 *           type: string
 *           description: The result of the word comparison
 */

/**
 * @swagger
 * /api/game:
 *   post:
 *     summary: Submit a word and get the comparison result
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               word:
 *                 type: string
 *                 description: The word to be checked
 *             example:
 *               word: example
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 word:
 *                   type: string
 *                   description: The submitted word
 *                 response:
 *                   type: string
 *                   description: The comparison result
 *                 game:
 *                   type: array
 *                   description: List of all tried words
 *                   items:
 *                     $ref: '#/components/schemas/Try'
 *       '404':
 *         description: Word not found in the database
 *       '500':
 *         description: Internal server error
 */
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { word: wordToCheck } = req.body;

        // Find the word in the database
        const word = await Word.findOne();

        if (!word) {
            return res.status(404).json({ error: 'Word not found in the database' });
        }

        // Perform the word checking logic
        let response = '';

        // Check if the length of the word is the same
        if (wordToCheck.length !== word.name.length) {
            response = 'X'.repeat(wordToCheck.length);
        } else {
            // Loop through each character in the input word and compare with the word in the database
            for (let i = 0; i < wordToCheck.length; i++) {
                const character = wordToCheck[i];
                if (word.name[i] === character) {
                    response += '1';
                } else if (word.name.includes(character)) {
                    response += '0';
                } else {
                    response += 'X';
                }
            }
        }

        // Save the user and word to the Try collection
        const user = req.user; // Assuming the user object is available in the request
        const tryData = new Try({ word: wordToCheck, result: response });
        await tryData.save();

        // Update the game instance with the new try data
        const game = new Game({ word: word._id, user: user._id });
        game.tries.push(tryData._id);
        game.totalTries = game.tries.length;
        await game.save();

        // Fetch all the try data associated with the game
        const tries = await Try.find({}, { word: 1, result: 1 });

        return res.status(200).json({
            word: wordToCheck,
            response,
            game: tries,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Reset all tries and delete all records. DELETE method is used.
/**
 * @swagger
 * /api/game/tries:
 *   delete:
 *     summary: Delete all tries
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
 *                   description: Success message
 *       '500':
 *         description: Internal server error
 */
router.delete('/tries', authenticateToken, async (req, res) => {
  try {
    await Try.deleteMany({});

    return res.json({ message: 'All tries reset successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
