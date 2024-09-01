const jwt = require('jsonwebtoken');
const { getUser } = require('../services/auth.js');

function restrictedtoadminonly(req, res, next) {
    console.log('Authenticating admin...');
    try {
        const token = req.cookies?.authToken;
        // console.log('Token:', token);

        if (!token) {
            return res.redirect('/login');
        }


        const user = getUser(token);
        // console.log(user);  

        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden: Only admin can access this route' });
        }

        req.adminID = user.id;
        console.log('Authenticated admin:', req.adminID);

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({ error: 'Server error during authentication' });
    }
}






module.exports = { restrictedtoadminonly };
