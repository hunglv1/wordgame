const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const wordRoutes = require('./routes/word');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/auth');
const gameRouter = require('./routes/game');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.json());

app.use(session({
    secret: 'vanhungle.tk',
    resave: false,
    saveUninitialized: true
}));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/wordgame', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

// Routes
app.use('/api/words', wordRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/game', gameRouter);

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
