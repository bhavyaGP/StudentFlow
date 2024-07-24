const express = require('express');
const router = express.Router();
const { registerTeacher, loginTeacher } = require('../controllers/teacher.js');
const auth = require('../middleware/auth');

// Public routes
router.post('/register', registerTeacher);
router.post('/login', loginTeacher);

// Protected routes
router.get('/protected', auth, (req, res) => {
    res.send('This is a protected route');
});

module.exports = router;
