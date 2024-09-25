const { getUser } = require('../services/auth.js');

function authenticateTeacherOrAdmin(req, res, next) {
    console.log('Authenticating user (teacher or admin)...');
    try {
        const token = req.cookies?.authToken;
        console.log('Token:', token);

        if (!token) {
            return res.redirect('/login'); // Redirect to login if no token is present
        }

        const user = getUser(token);
        console.log('User:', user);

        // Check if the user has the role 'teacher' or 'admin'
        if (user.role !== 'teacher' && user.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden: Only teachers or admins can access this route' });
        }

        // Set user details in request for further processing
        req.user = user;
        console.log('Authenticated user:', req.user);

        next(); // Proceed to the next middleware/controller
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({ error: 'Server error during authentication' });
    }
}

module.exports = { authenticateTeacherOrAdmin };

