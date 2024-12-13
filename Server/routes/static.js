const express = require('express');
const router = express.Router();
const { handlebasiclogin } = require('../controllers/rolehandle');
const { getUser } = require('../services/auth.js');

router.get('/', async (req, res) => {
    console.log("Home page");
    const token = req.cookies?.authToken;
    if (!token) {
        return res.redirect('/loggin');
    }
    const user = getUser(token);
    // console.log(user);

    if (!user) {
        return res.redirect('/loggin');
    }

    if (user.role === 'admin') {
        return res.redirect('/api/admin');
    }
    if (user.role === 'teacher') {
        return res.redirect('/api/teacher');
    }
});

// router.get("/login", (req, res) => {
//     res.render("login");
// })

router.post('/login', handlebasiclogin);

//signout route
router.get('/signout', async (req, res) => {
    res.clearCookie('authToken');
    res.redirect('/login');
});
module.exports = router;