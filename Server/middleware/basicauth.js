async function checkAuth(req, res, next) {
    const userid = req.cookies.uid;
    const user = getUser(userid);
    req.user = user;
    next();
}

module.exports = { checkAuth };