# Project Name
The Word Game

# Description
The Game is a word mapping game where users can search for a word by providing guesses. Each guess is evaluated against the target word, and the result is provided as feedback. The project uses Node.js and MongoDB to store and retrieve game data.

# Features
- User registration and login functionality
- Create, read, update, and delete (CRUD) operations for words
- Guessing functionality with feedback for each guess

# Technologies Used
- Node.js
- MongoDB
- JSON Web Tokens (JWT)
- Swagger (API document)

# Installation
TBD

# Usage
- Register a new user using the /register API endpoint
- Log in to obtain an access token using the /login API endpoint
- Use the access token to authenticate subsequent API requests by including it in the Authorization header as Bearer <access-token>
- Use the provided API endpoints to manage words, create games, and make guesses

# API Endpoints
- POST /register: Register a new user
- POST /login: Log in and obtain an access token
- GET /api/words: Retrieve all words
- POST /api/words: Create a new word
- GET /api/words/:id: Retrieve a word by ID
- PUT /api/words/:id: Update a word by ID
- DELETE /api/words/:id: Delete a word by ID
- POST /api/game: Create a new game and make guesses
- DELETE /api/game/tries: reset and delete all tries in DB

## API Documentation
The API documentation is available at: `http://localhost:3000/api-docs`

# License
Free
