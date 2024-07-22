const express = require('express');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const userController = require('./controllers/userController');
const adminController = require('./controllers/adminController');

const userModel = require('./models/userModel');
const adminModel = require('./models/adminModel');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);    
        req.user = user;
        next();
    });
};

app.post('/register', async (req, res) => {
    const { username, password, email, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.create({ username, password: hashedPassword, email, role });
    res.status(201).send('User registered successfully');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await userModel.findOne({ username });
    if (!user) return res.status(400).send('User not found');

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).send('Invalid password');

    const token = jwt.sign({ username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

app.use('/users', authenticateToken, userRoutes);
app.use('/admin', authenticateToken, adminRoutes);


const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.sendStatus(403); // Forbidden
    }
    next();
};

app.get('/admin-only', authenticateToken, authorizeAdmin, (req, res) => {
    res.send('This is an admin-only route');
});


app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});