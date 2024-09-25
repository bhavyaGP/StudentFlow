const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { sendMail } = require('../services/mailer.js');
const { setResultStatus } = require('../controllers/manageresult.js');


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

        // Send email to teacher
        const emailData = {
            to: teacher_email,
            subject: 'Welcome to the School Management System',
            text: `Welcome to the School Management System. Your username is ${username} and password is ${ddmmyyyyPassword}. Please login to the system to change your password.`,
            html: `<p>Welcome to the School Management System. Your username is  ${username} and password is ${ddmmyyyyPassword} and your allocated standard is ${allocated_standard} for our school  website. </p>`,
        };
        sendMail(emailData);
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


async function dashboarddata(req, res) {
    try {
        const graph1 = await prisma.$queryRaw`
            SELECT 
            s.stud_std AS "std",
            SUM(CASE WHEN g.marks_obtained >= 40 THEN 1 ELSE 0 END) AS "pass",
            SUM(CASE WHEN g.marks_obtained < 40 THEN 1 ELSE 0 END) AS "fail"
            FROM 
                student s
            JOIN 
                grades g ON s.rollno = g.rollno
            GROUP BY 
                s.stud_std;
            `;

        const graph2 = await prisma.$queryRaw`
            SELECT 
            s.stud_std AS "std",
            COUNT(DISTINCT s.rollno) AS "no_of_students"
            FROM 
                student s
            JOIN 
                grades g ON s.rollno = g.rollno
            GROUP BY 
                s.stud_std
            HAVING 
                    AVG(g.marks_obtained) >= 81;
            `;
        const graph3 = await prisma.$queryRaw`
            SELECT
                 s.stud_std AS "std",
            COUNT(DISTINCT s.rollno) AS "no_of_students"
            FROM 
                student s
            JOIN 
                grades g ON s.rollno = g.rollno
            GROUP BY 
                s.stud_std
            HAVING 
                AVG(g.marks_obtained) < 50;
            `;

        const graph4 = await prisma.$queryRaw` 
            
            SELECT 
            s.stud_std AS "std",
            COUNT(DISTINCT s.rollno) AS "no_of_students"
            FROM 
                student s
            JOIN 
                grades g ON s.rollno = g.rollno
            GROUP BY 
                s.stud_std
            HAVING 
                AVG(g.marks_obtained) BETWEEN 51 AND 80;
            `;

        // Convert BigInt values to strings
        const convertBigIntToString = (data) => {
            return data.map(row => {
                const newRow = {};
                for (const key in row) {
                    newRow[key] = typeof row[key] === 'bigint' ? row[key].toString() : row[key];
                }
                return newRow;
            });
        };

        res.status(200).json({
            graph1: convertBigIntToString(graph1),
            graph2: convertBigIntToString(graph2),
            graph3: convertBigIntToString(graph3),
            graph4: convertBigIntToString(graph4)
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data', details: error.message });
    }
}

async function tabulardata(req, res) {
    try {
        const table1 = await prisma.$queryRaw` SELECT 
            s.rollno AS "stuID",
            CONCAT(s.stud_fname, ' ', s.stud_lname) AS "student name",
            s.stud_std AS "Standard",
            AVG(g.marks_obtained) AS "% of student in Academic"
        FROM 
            student s
        JOIN 
            grades g ON s.rollno = g.rollno
        GROUP BY 
            s.rollno, s.stud_fname, s.stud_lname, s.stud_std
        HAVING 
            AVG(g.marks_obtained) = (
                SELECT 
                    MAX(avg_marks)
                FROM (
                    SELECT 
                        student.stud_std,
                        AVG(marks_obtained) AS avg_marks
                    FROM 
                        grades
                    JOIN 
                        student ON grades.rollno = student.rollno
                    GROUP BY 
                        student.stud_std, student.rollno
                ) AS subquery
                WHERE 
                    subquery.stud_std = s.stud_std
            );
        `;
        const table2 = await prisma.$queryRaw` SELECT 
            s.rollno AS "stuID",
            CONCAT(s.stud_fname, ' ', s.stud_lname) AS "student name",
            s.stud_std AS "Standard"
        FROM 
            student s
        JOIN 
            grades g ON s.rollno = g.rollno
        GROUP BY 
            s.rollno, s.stud_std
        HAVING 
            AVG(g.marks_obtained) < 40;
        `;
        const table3 = await prisma.$queryRaw` SELECT 
            s.rollno AS "student Id",
            CONCAT(s.stud_fname, ' ', s.stud_lname) AS "student name",
            s.stud_std AS "Standard",
            a.achievement_title AS "Achievement title",
            a.date AS "Date"
        FROM 
            student s
        JOIN 
            achievement a ON s.rollno = a.GRno;  -- Assuming GRno is the foreign key in achievement
                `;

        res.status(200).json({
            table1,
            table2,
            table3
        });

    }
    catch (error) {
        console.error('Error fetching tabular data:', error);
        res.status(500).json({ error: 'Failed to fetch tabular data', details: error.message });
    }
}

async function declareResult(req, res) {
    const { isResultOut } = req.body;
    setResultStatus(isResultOut);
    res.status(200).json({ message: `Result status set to ${isResultOut}` });
}

module.exports = { registerTeacher, dashboarddata, tabulardata, declareResult };