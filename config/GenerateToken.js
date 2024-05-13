const jwt = require('jsonwebtoken');

const generateToken = (id, username) => {
    return jwt.sign({ id, username }, process.env.JWT_SECRET);
}

module.exports = generateToken;