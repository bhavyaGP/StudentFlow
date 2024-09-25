const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { setTeacher, setAdmin } = require('../services/auth.js');

async function 
handlebasiclogin(req, res) {
    const { username, password } = req.body;
    console.log(username, password);
    try {
        let token;4
        let user;

        // Use findFirst to search by both username and password
        user = await prisma.teacher.findFirst({
            where: {
                username: username,
                password: password
            }
        });

        if (user) {
            // Generate token for teacher
            token = setTeacher(user);
            res.cookie('authToken', token, {
                httpOnly: true,
                maxAge: 4 * 60 * 60 * 1000 // Cookie expires in 4 hours
            });
            return res.json({ message: 'Login successful. You will be redirected to the teacher dashboard.', token, user });
            // return res.redirect('/api/teacher');
        }

        // Check if the user is the admin with hardcoded credentials
        if (username === 'admin' && password === 'admin') {
            // Create a mock admin object
            const admin = { admin_id: 1 };
            // Generate token for admin
            token = setAdmin(admin);
            res.cookie('authToken', token, {
                httpOnly: true,
                maxAge: 4 * 60 * 60 * 1000 // Cookie expires in 4 hours
            });
            return res.json({ message: 'Login successful. You will be redirected to the admin dashboard.', token, admin });
            // return res.redirect('/api/admin');
        }

        // If no user was found
        res.status(401).send('Invalid credentials');
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal server error');
    }
}

module.exports = { handlebasiclogin };