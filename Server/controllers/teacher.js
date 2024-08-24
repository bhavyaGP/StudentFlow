const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { setUser } = require('../services/auth.js');
const csvtojson = require('csvtojson');
const fs = require('fs');
const path = require('path');


// Corrected loginTeacher function

async function loginTeacher(req, res) {
    const { user, password } = req.body;
    console.log(user, password);

    // Check if both username and password are provided
    if (!user || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        // Find the first teacher by username
        const teacher = await prisma.teacher.findUnique({
            where: { username: user }
        });

        if (!teacher) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        if (password !== teacher.password) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Set User
        const token = setUser(teacher);

        res.cookie('authToken', token, {
            httpOnly: true, // This makes the cookie inaccessible to JavaScript on the client side
            maxAge: 4 * 60 * 60 * 1000, // Cookie expires in 4 hours
        });

        res.json({ message: 'Login successful then will be redirect to home ' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Failed to login', details: error.message });
    }
}


async function getReport(req, res) {
    try {
        const teacherId = req.teacherId; // Get teacher ID from the authenticated teacher
        const { rollno } = req.query; // Get roll number from query parameters

        // Find the teacher to get the standard they are responsible for
        const teacher = await prisma.teacher.findUnique({
            where: { teacher_id: parseInt(teacherId) },
            include: {
                students: true // Assuming the Teacher model has a relation to Student model
            }
        });

        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        // Find the standard/class the teacher is responsible for
        const standard = teacher.students[0]?.stud_std; // Assuming teacher is only assigned to one standard

        if (!standard) {
            return res.status(404).json({ error: 'No standard found for the teacher' });
        }

        // Find the student based on roll number and standard
        const student = await prisma.student.findFirst({
            where: {
                stud_id: parseInt(rollno),
                stud_std: standard
            },
            include: {
                attendance: {
                    where: {
                        date: {
                            gte: new Date(`${new Date().getFullYear()}-01-01`),
                            lte: new Date(`${new Date().getFullYear()}-12-31`)
                        }
                    }
                },
                grades: {
                    where: { year: new Date().getFullYear() },
                    include: { subject: true }
                },
                learning_outcomes: {
                    where: {
                        date: {
                            gte: new Date(`${new Date().getFullYear()}-01-01`),
                            lte: new Date(`${new Date().getFullYear()}-12-31`)
                        }
                    },
                    include: { subject: true }
                },
                activities: {
                    include: { activity: true }
                },
                teacher: true,
                school: true,
            },
        });

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Structure the report data
        const report = {
            studentDetails: {
                firstName: student.stud_fname,
                lastName: student.stud_lname,
                standard: student.stud_std,
                dateOfBirth: student.DOB,
                parentContact: student.parent_contact,
                teacher: {
                    teacherId: student.teacher_id,
                    name: `${student.teacher.teacher_fname} ${student.teacher.teacher_lname}`
                },
                school: {
                    schoolId: student.school_id,
                    name: student.school.school_name,
                    address: student.school.school_add,
                },
            },
            attendance: student.attendance.map(a => ({
                date: a.date,
                status: a.status
            })),
            grades: student.grades.map(g => ({
                subject: g.subject.subject_name,
                marksObtained: g.marks_obtained,
                maxMarks: g.max_marks,
                term: g.term
            })),
            learningOutcomes: student.learning_outcomes.map(lo => ({
                subject: lo.subject.subject_name,
                description: lo.outcome_description,
                achieved: lo.achieved,
                date: lo.date
            })),
            activities: student.activities.map(act => ({
                activityName: act.activity.activity_name
            }))
        };

        // Send the report as a JSON response
        return res.json(report);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function addstudent(req, res) {
    console.log("In updatestudent function");

    if (!req.file) {
        return res.status(400).send("No files were uploaded.");
    }
    console.log("File uploaded:", req.file.filename);
    const csvFilePath = req.file.path;

    try {
        // Convert CSV to JSON
        const jsonObj = await csvtojson().fromFile(csvFilePath);

        const jsonFilePath = `./uploads/${path.parse(csvFilePath).name}.json`;
        await fs.promises.writeFile(jsonFilePath, JSON.stringify(jsonObj, null, 2));
        console.log("JSON file saved:", jsonFilePath);


        for (const record of jsonObj) {
            // Assume CSV columns match the Student model fields
            const { stud_fname, stud_lname, stud_std, DOB, parent_contact } = record;

            // Get teacher ID from the request (assumed to be stored in req.teacherId)
            const parsedTeacherId = req.teacherId;

            // Find the school ID associated with the teacher
            const { school_id: teacherSchoolId } = await prisma.teacher.findUnique({
                where: { teacher_id: parsedTeacherId },
                select: { school_id: true }
            });

            if (!teacherSchoolId) {
                return res.status(400).send("Teacher's school ID not found.");
            }

            const parsedSchoolId = parseInt(teacherSchoolId);

            // Update or create the student record in the database
            // await prisma.student.upsert({
            //     where: {
            //         stud_fname_stud_lname_stud_std_school_id: {
            //             stud_fname,
            //             stud_lname,
            //             stud_std: parseInt(stud_std),
            //             school_id: parsedSchoolId,
            //         }
            //     }, // Using a composite unique key
            //     update: {
            //         stud_fname,
            //         stud_lname,
            //         stud_std: parseInt(stud_std),
            //         DOB: new Date(DOB),
            //         parent_contact,
            //         teacher_id: parsedTeacherId,
            //         school_id: parsedSchoolId
            //     },
            //     create: {
            //         stud_fname,
            //         stud_lname,
            //         stud_std: parseInt(stud_std),
            //         DOB: new Date(DOB),
            //         parent_contact,
            //         teacher_id: parsedTeacherId,
            //         school_id: parsedSchoolId
            //     }
            // });
        }

        // Send success response
        res.status(200).send("Students updated successfully.");
    } catch (error) {
        console.error("Error processing CSV file:", error);
        res.status(500).send("Error processing CSV file.");
    }
}

async function addmarks(req, res) {
    console.log("In addmarks function");

    if (!req.file) {
        return res.status(400).send("No files were uploaded.");
    }
    console.log("File uploaded:", req.file.filename);
    const csvFilePath = req.file.path;

    try {
        // Convert CSV to JSON
        const jsonObj = await csvtojson().fromFile(csvFilePath);

        const jsonFilePath = `./uploads/${path.parse(csvFilePath).name}.json`;
        await fs.promises.writeFile(jsonFilePath, JSON.stringify(jsonObj, null, 2));
        console.log("JSON file saved:", jsonFilePath);

        for (const record of jsonObj) {
            // Assume CSV columns match the Student model fields
            const { stud_id, subject_id, marks_obtained, max_marks, term, year } = record;

            // Get teacher ID from the request (assumed to be stored in req.teacherId)
            const parsedTeacherId = req.teacherId;

            // Find the school ID associated with the teacher
            const { school_id: teacherSchoolId } = await prisma.teacher.findUnique({
                where: { teacher_id: parsedTeacherId },
                select: { school_id: true }
            });

            if (!teacherSchoolId) {
                return res.status(400).send("Teacher's school ID not found.");
            }

            const parsedSchoolId = parseInt(teacherSchoolId);

            // Update or create the student record in the database
            await prisma.grades.upsert({
                where: {
                    stud_id_subject_id_term_year: {
                        stud_id: parseInt(stud_id),
                        subject_id: parseInt(subject_id),
                        term: term,
                        year: year
                    }
                }, // Using a composite unique key
                update: {
                    marks_obtained: parseInt(marks_obtained),
                    max_marks: parseInt(max_marks)
                },
                create: {
                    stud_id: parseInt(stud_id),
                    subject_id: parseInt(subject_id),
                    marks_obtained: parseInt(marks_obtained),
                    max_marks: parseInt(max_marks),
                    term: term,
                    year: year
                }
            });
        }

        // Send success response
        res.status(200).send("Marks added successfully.");

    } catch (error) {
        console.error("Error processing CSV file:", error);
        res.status(500).send("Error processing CSV file.");
    }
}

async function showsAlltudents(req, res) {
    res.send("All students");   
}

module.exports = { loginTeacher, getReport, addstudent, addmarks, showsAlltudents };