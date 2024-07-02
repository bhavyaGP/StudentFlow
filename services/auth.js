const jwt = require('jsonwebtoken');
const JWT_SECRET = "Bhavya@!@#";

function setUser(user) {
    // console.log(user);
    return jwt.sign(
        {
            _id: user._id,
            email: user.email,
        },
        JWT_SECRET,
        { expiresIn: '1h' });

}

function getUser(token) {
    if (!token) return null;
    try {
        return jwt.verify(token, JWT_SECRET);

    } catch (error) {
        return null;
    }
}


module.exports = {
    setUser,
    getUser
}