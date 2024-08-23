const express = require('express');
const router = express.Router();
const { registerTeacher} = require('../controllers/admin.js');

// Public routes
router.post('/addteacher', registerTeacher);

module.exports = router;