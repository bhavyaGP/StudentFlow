const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const db = require('./connection');
const port = process.env.PORT || 3000;
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//router

app.use('/', require('./routes/staticRoutes'));

//improting student model
const Student = require('./models/student');



app.get('/', async (req, res) => {
    res.send('Server is running');
});

app.listen(port, () => console.log(`Server started on port ${port}`));