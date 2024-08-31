const jwt = require('jsonwebtoken');
const { getUser } = require('../services/auth.js');

function authenticateTeacher(req, res, next) {
    console.log('Authenticating teacher');
    try {
        const token = req.cookies?.authToken;
        console.log('Token:', token);
        
        if (!token) {
            return res.redirect('/login');
        }

        // Verify the token
        const user = getUser(token);
        console.log(user);
        
        req.teacherId = user.id;
        console.log('Authenticated teacher:', req.teacherId);
        
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({ error: 'Server error during authentication' });
    }
}





module.exports = { authenticateTeacher };
