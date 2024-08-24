const jwt = require('jsonwebtoken');
const { getUser } = require('../services/auth.js');

function authenticateTeacher(req, res, next) {
    console.log('Authenticating teacher');
    try {
        const token = req.cookies?.authToken;

        if (!token) {
            return res.status(401).json({ error: 'will redirect to login' });
        }

        // Verify the token
        const user = getUser(token);

        req.teacherId = user.id;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ error: 'Server error during authentication' });
    }
}




module.exports = { authenticateTeacher };
