const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// Function to create a new teacher
async function registerTeacher(req, res) {
    const { teacher_fname, teacher_lname, allocated_standard, teacher_email, school_id, dob } = req.body;

    try {
        // Check for missing required fields
        if (!teacher_fname || !teacher_lname || !allocated_standard || !teacher_email || !school_id || !dob) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Validate school_id
        const parsedSchoolId = parseInt(school_id);
        if (isNaN(parsedSchoolId)) {
            return res.status(400).json({ error: 'Invalid school_id format.' });
        }

        // Check if the school_id exists
        const school = await prisma.schoolSchema.findUnique({
            where: { school_id: parsedSchoolId }
        });

        if (!school) {
            return res.status(400).json({ error: 'Invalid school_id. School not found.' });
        }

        // Convert dob from DD/MM/YYYY to ISO format and extract DDMMYYYY
        const dateOfBirth = convertToISODate(dob);
        if (isNaN(dateOfBirth.getTime())) {
            return res.status(400).json({ error: 'Invalid dob format. Please use DD/MM/YYYY format.' });
        }

        const ddmmyyyyPassword = dob.split('/').join('');

        let username = teacher_fname;
        // Create the teacher without username
        let newTeacher = await prisma.teacher.create({
            data: {
                teacher_fname,
                teacher_lname,
                allocated_standard,
                teacher_email,
                school_id: parsedSchoolId,
                password: ddmmyyyyPassword,
                DOB: dateOfBirth,
                username,
            },
        });

        // Generate username
        username = teacher_fname + '@' + newTeacher.teacher_id;

        // Update teacher with username
        newTeacher = await prisma.teacher.update({
            where: { teacher_id: newTeacher.teacher_id },
            data: { username },
        });

        res.status(201).json(newTeacher);
    } catch (error) {
        console.error('Error creating teacher:', error);
        res.status(500).json({ error: 'Failed to create teacher', details: error.message });
    }
}
// Utility function to convert DD/MM/YYYY to ISO format
function convertToISODate(dateString) {
    const [day, month, year] = dateString.split('/');
    const isoDateString = `${year}-${month}-${day}T00:00:00.000Z`;
    return new Date(isoDateString);
}

module.exports = { registerTeacher };