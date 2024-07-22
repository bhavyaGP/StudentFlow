const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const db = require('./connection');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});