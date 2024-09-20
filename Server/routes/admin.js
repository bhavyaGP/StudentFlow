const express = require('express');
const router = express.Router();
const { registerTeacher } = require('../controllers/admin.js');
const { restrictedtoadminonly } = require('../middleware/adminauth.js');
const { route } = require('./static.js');
// Public routes
router.get('/', restrictedtoadminonly, (req, res) => {
    res.send('Welcome to the admin homepage');
});
router.post('/addteacher', restrictedtoadminonly, registerTeacher);
router.get('/',restrictedtoadminonly,)

module.exports = router;