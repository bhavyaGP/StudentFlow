const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { setUser } = require('../services/auth.js');
const csvtojson = require('csvtojson');
const fs = require('fs');
const path = require('path');





async function getReport(req, res) {
    try {
        console.log("In getReport function");

        // const teacherid = req.teacherId; // Get teacher ID from the authenticated teacher
        // const { rollno } = req.query; // Get roll number from query parameters
        const teacherid = req.teacherId;
        const rollno = req.query.rollno;
        console.log(teacherid, rollno);

        // Find the teacher to get the standard they are responsible for
        const teacher = await prisma.teacher.findUnique({
            where: { teacher_id: teacherid },
            include: {
                students: true // Assuming the Teacher model has a relation to Student model
            }
        });

        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        const standard = teacher.students[0]?.stud_std; // Assuming teacher is only assigned to one standard


        if (!standard) {
            return res.status(404).json({ error: 'No standard found for the teacher' });
        }
        console.log("Standard:", standard);

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

        console.log("report generated");
        return res.json(report);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

function ConverttedDate(date) {
    const parts = date.split('-');
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const year = parseInt(parts[2]);
    return new Date(year, month, day);
}

async function convertCSVtoJSON(csvFilePath) {
    try {
        const jsonObj = await csvtojson().fromFile(csvFilePath);
        const jsonFilePath = `./uploads/${path.parse(csvFilePath).name}.json`;
        await fs.promises.writeFile(jsonFilePath, JSON.stringify(jsonObj, null, 2));
        console.log("JSON file saved:", jsonFilePath);
        return jsonObj;
    } catch (error) {
        console.error("Error converting CSV to JSON:", error);
        throw new Error("Error converting CSV to JSON");
    }
}

async function addstudent(req, res) {
    console.log("In addstudent function");

    if (!req.file) {
        return res.status(400).send("No files were uploaded.");
    }
    console.log("File uploaded:", req.file.filename);
    const csvFilePath = req.file.path;

    try {
        const jsonObj = await convertCSVtoJSON(csvFilePath);

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

        const studentData = jsonObj.map(record => {
            const { stud_fname, stud_lname, stud_std, DOB, parent_contact } = record;
            return {
                stud_fname,
                stud_lname,
                stud_std: parseInt(stud_std),
                DOB: ConverttedDate(DOB),
                parent_contact,
                teacher_id: parsedTeacherId,
                school_id: parsedSchoolId
            };
        });
        console.log(studentData);

        // Update or create the student records in the database
        await prisma.student.createMany({
            data: studentData
        });

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
        const jsonObj = await convertCSVtoJSON(csvFilePath);

        const parsedTeacherId = req.teacherId;

        const { school_id: teacherSchoolId } = await prisma.teacher.findUnique({
            where: { teacher_id: parsedTeacherId },
            select: { school_id: true }
        });

        if (!teacherSchoolId) {
            return res.status(400).send("Teacher's school ID not found.");
        }

        const parsedSchoolId = parseInt(teacherSchoolId);
        console.log(jsonObj);

        const gradesData = jsonObj
            .filter(record => record.student_id.trim() !== "") // Filter out records with empty student_id
            .map(record => {
                const { student_id, subject_id, marks_obtained, max_marks, term, year } = record;
                return {
                    student_id: parseInt(student_id),
                    subject_id: parseInt(subject_id),
                    marks_obtained: parseInt(marks_obtained),
                    max_marks: parseInt(max_marks),
                    term,
                    year: parseInt(year),
                };
            });
        await prisma.grades.createMany({
            data: gradesData
        });

        res.status(200).send("Marks added successfully.");

    } catch (error) {
        console.error("Error processing CSV file:", error);
        res.status(500).send("Error processing CSV file.");
    }
}

async function getGradesForStudent(studentId) {
    try {
        const query = `
            SELECT subject_id, marks_obtained, max_marks, year, term
            FROM grades
            WHERE student_id = ${studentId}`;

        const grades = await prisma.$queryRawUnsafe(query); // Use $queryRawUnsafe for dynamic raw queries
        // console.log(grades);

        return grades.map(grade => ({
            subjectId: grade.subject_id,
            marksObtained: grade.marks_obtained,
            maxMarks: grade.max_marks,
            year: grade.year,
            term: grade.term,
        }));
    } catch (error) {
        console.error('Error fetching grades:', error);
        throw new Error('Failed to fetch grades');
    }
}

async function showsAllStudents(req, res) {
    try {
        const teacherId = req.teacherId;

        const teacher = await prisma.teacher.findUnique({
            where: { teacher_id: teacherId },
            include: {
                students: true,
            },
        });

        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        const students = await Promise.all(
            teacher.students?.map(async student => {
                // console.log(student.stud_id);

                const grades = await getGradesForStudent(student.stud_id);
                return {
                    studentId: parseInt(student.stud_id),
                    firstName: student.stud_fname,
                    lastName: student.stud_lname,
                    standard: parseInt(student.stud_std),
                    dateOfBirth: new Date(student.DOB).toISOString(),
                    parentContact: student.parent_contact,
                    grades,
                };
            })
        );

        return res.json(students);
    } catch (error) {
        console.error('Error showing all students:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function addactivitymarks(req, res) {

    console.log("In addactivitymarks function");

    if (!req.file) {
        return res.status(400).send("No files were uploaded.");
    }
    console.log("File uploaded:", req.file.filename);
    const csvFilePath = req.file.path;

    try {
        const jsonObj = await convertCSVtoJSON(csvFilePath);

        const parsedTeacherId = req.teacherId;

        const { school_id: teacherSchoolId } = await prisma.teacher.findUnique({
            where: { teacher_id: parsedTeacherId },
            select: { school_id: true }
        });

        if (!teacherSchoolId) {
            return res.status(400).send("Teacher's school ID not found.");
        }

        const parsedSchoolId = parseInt(teacherSchoolId);

        const activitiesData = jsonObj
            .filter(record => record.student_id.trim() !== "") // Filter out records with empty student_id
            .map(record => {
                const { student_id, activity_id, marks_obtained, total_marks, date, grade } = record;
                return {
                    student_id: parseInt(student_id),
                    activity_id: parseInt(activity_id),
                    marks_obtained: parseInt(marks_obtained),
                    total_marks: parseInt(total_marks),
                    grade: grade
                };
            });

        await prisma.ActivityMarks.createMany({
            data: activitiesData
        });

        res.status(200).send("Activity marks added successfully.");

    } catch (error) {
        console.error("Error processing CSV file:", error);
        res.status(500).send("Error processing CSV file.");
    }
}

module.exports = { getReport, addstudent, addmarks, showsAllStudents, addactivitymarks };