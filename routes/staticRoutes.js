const express = require('express');
const router = express.Router();
const Student = require('../models/student');


router.get('/signup', (req, res) => {
    res.send('signup');
    // res.render('signup');
});

router.get('/login', (req, res) => {
    // res.render('login');
    res.send('login');
});
module.exports = router;