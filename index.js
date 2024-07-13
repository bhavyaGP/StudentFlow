const express = require('express');
const app = express();
const db = require('./connection');
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const authRoutes = require('./routes/authroutes');


app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/auth', authRoutes);


app.use((err, req, res, next) => {
    err.statuscode = err.statuscode || 500;
    err.status = err.status || 'error';
    res.status(err.statuscode).json({
        status: err.status,
        message: err.message
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});