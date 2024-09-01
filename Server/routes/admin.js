const express = require('express');
const router = express.Router();
const { registerTeacher } = require('../controllers/admin.js');
const { restrictedtoadminonly } = require('../middleware/adminauth.js');
// Public routes
router.get('/', restrictedtoadminonly, (req, res) => {
    res.send('Welcome to the admin homepage');
});
router.post('/addteacher', restrictedtoadminonly, registerTeacher);

module.exports = router;