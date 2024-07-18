const User = require('../models/usermodel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const createError = require('../utils/appError');

async function singup(req, res, next) {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            return next(new createError('User already exists', 400));
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12);

        const newUser = await User.create(
            {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                role: req.body.role
            }
        );

        //jwt token
        // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        //     expiresIn: process.env.JWT_EXPIRES_IN
        // });

        const token = jwt.sign({ id: newUser._id }, "mysecret", {
            expiresIn: '1d'
        });

        res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            token,
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (err) {
        next(err);
    }
}

async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new createError('Please provide email and password', 400));
        }
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return next(new createError('Incorrect email or password', 401));
        }
        const token = jwt.sign({ id: user._id }, "mysecret", {
            expiresIn: '1d'
        });
        res.status(200).json({
            status: 'success',
            token,
            message: 'User logged in successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        next(err);
    }
}

module.exports = { singup, login }