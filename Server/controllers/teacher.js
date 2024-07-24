const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Corrected registerTeacher function
// Function to create a new teacher
async function registerTeacher(req, res) {
    const { teacher_fname, teacher_lname, allocated_standard, teacher_email, school_id, password } = req.body;

    try {
        // Parse school_id to integer
        const parsedSchoolId = parseInt(school_id);

        // Check if the school_id exists
        const school = await prisma.schoolSchema.findUnique({
            where: { school_id: parsedSchoolId }
        });

        if (!school) {
            return res.status(400).json({ error: 'Invalid school_id. School not found.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new teacher
        const newTeacher = await prisma.teacher.create({
            data: {
                teacher_fname,
                teacher_lname,
                allocated_standard,
                teacher_email,
                school_id: parsedSchoolId,
                password: hashedPassword
            }
        });

        res.status(201).json(newTeacher);
    } catch (error) {
        console.error('Error creating teacher:', error);
        res.status(500).json({ error: 'Failed to create teacher', details: error.message });
    }
}


// Corrected loginTeacher function
async function loginTeacher(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const teacher = await prisma.teacher.findUnique({
            where: { teacher_email: email }
        });

        if (!teacher) {
            return res.status(400).json({ error: 'Teacher not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, teacher.password);

        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ id: teacher.teacher_id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Failed to login', details: error.message });
    }
}
module.exports = { registerTeacher, loginTeacher };