const { getUser } = require('../services/auth.js');

function authenticateTeacherOrAdmin(req, res, next) {
    console.log('Authenticating user (teacher or admin)...');
    try {
        const token = req.cookies?.authToken;
        console.log('Token:', token);

        if (!token) {
            return res.redirect('/login');
        }

        const user = getUser(token);
        console.log('User:', user);
        if (user.role === 'teacher') {
            req.teacherId = user.id;
        }
        else {
            // req.teacherId = req.body.teacherId;
        }
        if (user.role !== 'teacher' && user.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden: Only teachers or admins can access this route' });
        }
        console.log('Authenticated user:', req.user);

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({ error: 'Server error during authentication' });
    }
}

<<<<<<< HEAD
module.exports = { authenticateTeacherOrAdmin };
=======
module.exports = { authenticateTeacherOrAdmin };

>>>>>>> cc5c4920a65cae2e888003e62c307f3c7c3e3357
