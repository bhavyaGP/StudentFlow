const jwt = require('jsonwebtoken');

function authenticateTeacher(req, res, next) {
    try {
        // Extract the token from cookies
        const token = req.cookies.authToken;

        if (!token) {
            return res.status(401).json({ error: 'No token provided, authorization denied login first' });
        }

        // Verify the token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: 'Token is not valid' });
            }

            // Attach the teacher's ID to the request object
            req.teacherId = decoded.id;
            next();
        });
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ error: 'Server error during authentication' });
    }
}




module.exports = { authenticateTeacher };
