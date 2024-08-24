const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    if (!req.user) {
        return res.redirect('/login');
    }
    res.send('Welcome to the homepage');
});


router.get('/login', (req, res) => {
    res.render('login');    
});
module.exports = router;