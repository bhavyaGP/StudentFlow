const express = require('express');
const router = express.Router();
// const Student = require('../models/Student');

router.get('/', async (req, res) => {
    //login here
    res.send('Student login');
});
 