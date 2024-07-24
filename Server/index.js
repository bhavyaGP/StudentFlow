const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const db = require('./connection');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

require('dotenv').config();

const teacherRoutes = require('./routes/teacher.js');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/teacher', teacherRoutes);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
