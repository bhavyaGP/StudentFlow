const { getUser } = require('../services/auth.js');    

async function checkAuth(req, res, next) {
    console.log("Checking auth");
    const userid = req.cookies?.authToken;
    const user = getUser(userid);
    req.user = user;
    next();
}

module.exports = { checkAuth };