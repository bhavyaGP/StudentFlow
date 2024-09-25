const express = require('express');
const cors=require('cors')
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const staticroutes = require('./routes/static.js');
const { checkAuth } = require('./middleware/basicauth.js');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const db = require('./connection');


const path = require('path');

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Route handlers
const teacherRoutes = require('./routes/teacher.js');
const adminRoutes = require('./routes/admin.js');

// Use the defined routes
app.use("/",staticroutes);
app.use('/api/admin', adminRoutes);
app.use('/api/teacher', teacherRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

