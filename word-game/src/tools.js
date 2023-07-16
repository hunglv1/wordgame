const jwt = require('jsonwebtoken');


const generateAccessToken = (payload) => {
    return jwt.sign({id: payload}, 'secret', { expiresIn: '8h' });
}

const generateRefreshToken = (payload) => {
    return jwt.sign({id: payload}, 'secret', { expiresIn: '1d' });
}

module.exports = {
    generateAccessToken,
    generateRefreshToken
};