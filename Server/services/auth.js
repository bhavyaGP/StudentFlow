const jwt = require('jsonwebtoken');

function setUser(teacher) {
    return jwt.sign(
        {
            id: teacher.teacher_id
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
}

function getUser(token) {
    if (!token) return null;
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
}


module.exports = {
    setUser,
    getUser
}
