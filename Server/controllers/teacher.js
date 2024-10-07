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

        const teacherid = req.teacherId || req.body.teacherId; // Authenticated teacher's ID
        const rollno = req.query.rollno; // Roll number from query parameters
        console.log(teacherid, rollno);

        // Find the teacher and their assigned standard
        const teacher = await prisma.teacher.findUnique({
            where: { teacher_id: teacherid },
            include: {
                students: true // Assumes the Teacher model has a relation to Student model
            }
        });

        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        const standard = teacher.students[0]?.stud_std; // Assumes teacher is assigned to one standard
        if (!standard) {
            return res.status(404).json({ error: 'No standard found for the teacher' });
        }
        // console.log("Standard:", standard);
        // Find the student based on roll number and standard
        const student = await prisma.student.findFirst({
            where: {
                rollno: parseInt(rollno),
            },
            select: {
                GRno: true,
                monthlyAttendance: {
                    where: {
                        year: new Date().getFullYear()
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
            }
        });
        const studentachivement = await prisma.achievement.findMany({
            where: {
                GRno: student.GRno
            }
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
                    address: student.school.school_add
                }
            },
            attendance: student.monthlyAttendance.map(a => ({
                month: a.month,
                totalPresentDays: a.total_present_days,
                totalAbsentDays: a.total_absent_days,
                totalLateDays: a.total_late_days
            })),
            grades: student.grades.map(g => ({
                subject: g.subject.subject_name,
                marksObtained: g.marks_obtained,
                maxMarks: g.max_marks
            })),
            learningOutcomes: student.learning_outcomes.map(lo => ({
                subject: lo.subject.subject_name,
                description: lo.outcome_description,
                achieved: lo.achieved,
                date: lo.date
            })),
            activities: student.activities.map(act => ({
                activityName: act.activity.activity_name,
                marksObtained: act.marks_obtained,
                totalMarks: act.total_marks
            })),
            achievements: studentachivement.map(ach => ({
                GRno: ach.GRno,
                achievementTitle: ach.achievement_title,
                date: ach.date,
                student_std: ach.student_std
            }))
        };

        console.log("Report generated");
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

        // Find the school ID and standard associated with the teacher
        const { school_id: parsedSchoolId, allocated_standard: teacherStandard } = await prisma.teacher.findUnique({
            where: { teacher_id: parsedTeacherId },
            select: { school_id: true, allocated_standard: true }
        });

        if (!parsedSchoolId || !teacherStandard) {
            return res.status(400).send("Teacher's school ID or allocated standard not found.");
        }

        // Get the last roll number for the teacher's allocated standard
        const lastStudent = await prisma.student.findFirst({
            where: {
                stud_std: parseInt(teacherStandard), // Ensure the student belongs to the teacher's standard
                school_id: parsedSchoolId // Ensure the student belongs to the teacher's school
            },
            orderBy: {
                rollno: 'desc'
            }
        });

        // Set base roll number, e.g., 09001 if no students found
        const lastRollNo = lastStudent ? parseInt(lastStudent.rollno.toString().slice(2)) : 0;

        // Filter and map student data
        const studentData = jsonObj
            .filter(record => {
                const { stud_fname, stud_lname, stud_std, DOB, parent_contact, parentname, student_add } = record;
                return stud_fname && stud_lname && stud_std && DOB && parent_contact && parentname && student_add &&
                    stud_fname.trim() !== "" && stud_lname.trim() !== "" && stud_std.trim() !== "" &&
                    DOB.trim() !== "" && parent_contact.trim() !== "" && parentname.trim() !== "" &&
                    student_add.trim() !== "";
            })
            .map((record, index) => {
                const { stud_fname, stud_lname, stud_std, DOB, parent_contact, parentname, student_add } = record;

                let newrollno;

                // Generate roll number based on the teacher's allocated standard
                if (parseInt(stud_std) === parseInt(teacherStandard)) {
                    const nextRollNo = lastRollNo + index + 1;
                    newrollno = `${teacherStandard}${nextRollNo.toString().padStart(3, '0')}`; // e.g., '09001'
                } else {
                    // Handle if the student's standard doesn't match the teacher's standard
                    throw new Error(`Student standard ${stud_std} does not match the teacher's allocated standard ${teacherStandard}.`);
                }

                return {
                    rollno: parseInt(newrollno),
                    stud_fname: stud_fname.trim(),
                    stud_lname: stud_lname.trim(),
                    stud_std: parseInt(stud_std),
                    DOB: ConverttedDate(DOB.trim()),  // Assuming ConvertedDate is a function that processes DOB
                    parent_contact: parent_contact.trim(),
                    parentname: parentname.trim(),
                    student_add: student_add.trim(),
                    teacher_id: parsedTeacherId,
                    school_id: parsedSchoolId
                };
            });

        // If there is student data, create many records in the database
        if (studentData.length > 0) {
            await prisma.student.createMany({
                data: studentData
            });
        }

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

        const subjects = ['ENG301', 'GUJ101', 'MATH101', 'SCI201', 'SS401'];

        // Process each student's marks
        for (const student of jsonObj) {
            for (const subject of subjects) {
                const rollno = parseInt(student.rollno);
                const marks_obtained = parseInt(student[subject]) || 0;

                // Check if the record already exists
                const existingRecord = await prisma.grades.findFirst({
                    where: {
                        rollno: rollno,
                        subject_id: subject,
                        year: new Date().getFullYear()
                    }
                });

                if (existingRecord) {
                    // Update existing record with new marks
                    await prisma.grades.update({
                        where: {
                            grade_id: existingRecord.grade_id
                        },
                        data: {
                            marks_obtained: marks_obtained
                        }
                    });
                } else {
                    await prisma.grades.create({
                        data: {
                            rollno: rollno,
                            subject_id: subject,
                            marks_obtained: marks_obtained,
                            max_marks: 100,
                            year: new Date().getFullYear()
                        }
                    });
                }
            }
        }

        res.status(200).send("Marks added or updated successfully.");

    } catch (error) {
        console.error("Error processing CSV file:", error);
        res.status(500).send("Error processing CSV file.");
    }
}


async function getGradesForStudent(rollno) {
    try {
        const query = `
            SELECT subject_id, marks_obtained, max_marks, year
            FROM grades
            WHERE rollno = ${rollno}`;

        const grades = await prisma.$queryRawUnsafe(query);
        // console.log(grades);

        return grades.map(grade => ({
            subjectId: grade.subject_id,
            marksObtained: grade.marks_obtained,
            maxMarks: grade.max_marks,
            year: grade.year,
        }));
    } catch (error) {
        console.error('Error fetching grades:', error);
        throw new Error('Failed to fetch grades');
    }
}

async function showsAllStudents(req, res) {
    try {
        const teacherId = req.teacherId || req.body.teacherId;

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

                const grades = await getGradesForStudent(student.rollno);
                return {
                    rollno: parseInt(student.rollno),
                    firstName: student.stud_fname,
                    lastName: student.stud_lname,
                    standard: parseInt(student.stud_std),
                    dateOfBirth: new Date(student.DOB).toISOString(),
                    parentContact: student.parent_contact,
                    parentName: student.parentname,
                    studentAddress: student.student_add,
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

        if (!jsonObj || jsonObj.length === 0) {
            return res.status(400).send("CSV file is empty or couldn't be parsed.");
        }

        const parsedTeacherId = req.teacherId;

        const teacher = await prisma.teacher.findUnique({
            where: { teacher_id: parsedTeacherId },
            select: { school_id: true }
        });

        if (!teacher || !teacher.school_id) {
            return res.status(400).send("Teacher's school ID not found.");
        }

        const parsedSchoolId = parseInt(teacher.school_id);
        const activities = ["ART04", "INDOOR02", "OUTDOOR03", "PROJECT05", "STAGE01"];
        const max_marks = 50;

        const promises = [];

        for (const student of jsonObj) {
            const rollno = parseInt(student.rollno);

            if (!rollno || isNaN(rollno)) {
                console.error(`Invalid roll number for student: ${JSON.stringify(student)}`);
                continue;
            }

            for (const activity of activities) {
                const marks_obtained = parseInt(student[activity]) || 0;

                promises.push(
                    prisma.activityMarks.findFirst({
                        where: {
                            rollno: rollno,
                            activity_id: activity,
                        }
                    }).then(existingRecord => {
                        if (existingRecord) {
                            // Update existing record with new marks
                            return prisma.activityMarks.update({
                                where: {
                                    activitymarks_id: existingRecord.activitymarks_id
                                },
                                data: {
                                    marks_obtained: marks_obtained
                                }
                            });
                        } else {
                            return prisma.activityMarks.create({
                                data: {
                                    rollno: rollno,
                                    activity_id: activity,
                                    marks_obtained: marks_obtained || 0,
                                    total_marks: max_marks,
                                }
                            });
                        }
                    })
                );
            }
        }

        await Promise.all(promises);
        res.status(200).send("Activity marks added successfully.");

    } catch (error) {
        console.error("Error processing CSV file:", error);
        res.status(500).send("Error processing CSV file.");
    }
}


async function teacherdashboarddata(req, res) {
    try {
        const teacherid = req.teacherId || req.body.teacherId;
        const teacher = await prisma.teacher.findUnique({
            where: { teacher_id: teacherid },
            select: { school_id: true, allocated_standard: true }
        });

        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }
        const standard = teacher.allocated_standard;

        // Average marks of all students in all subjects
        const avgMarksBySubject = await prisma.$queryRaw`
            SELECT 
            g.subject_id, 
            AVG(g.marks_obtained) AS average_marks,
            sub.subject_name
            FROM 
            grades g
            JOIN 
            student s ON g.rollno = s.rollno
            JOIN
            subject sub ON g.subject_id = sub.subject_id
            WHERE 
            s.stud_std = ${standard}  
            AND g.subject_id IN ('ENG301', 'GUJ101', 'MATH101', 'SCI201', 'SS401') 
            GROUP BY 
            g.subject_id, sub.subject_name;
        `;

        const formattedData = avgMarksBySubject.map(item => ({
            subjectName: item.subject_name,
            avgMarks: Number(item.average_marks) // Convert to number
        }));

        // Total students count
        const studentsCountQuery = await prisma.$queryRaw`
            SELECT COUNT(*) AS students_count
            FROM student
            WHERE stud_std = ${standard};
        `;
        const studentsCount = Number(studentsCountQuery[0].students_count); // Convert to number

        // Pass/Fail students
        const passFailCount = await prisma.$queryRaw`
            SELECT 
            SUM(CASE WHEN g.marks_obtained >= 40 THEN 1 ELSE 0 END) AS pass_count,
            SUM(CASE WHEN g.marks_obtained < 40 THEN 1 ELSE 0 END) AS fail_count
            FROM 
            grades g
            JOIN 
            student s ON g.rollno = s.rollno
            WHERE 
            s.stud_std = ${standard};
        `;

        const passCount = Number(passFailCount[0].pass_count); // Convert to number
        const failCount = Number(passFailCount[0].fail_count); // Convert to number

        // Range of percentage of students
        const rangeCountsQuery = await prisma.$queryRaw`
            SELECT 
            CASE 
                WHEN g.marks_obtained BETWEEN 0 AND 50 THEN '0-50'
                WHEN g.marks_obtained BETWEEN 51 AND 60 THEN '51-60'
                WHEN g.marks_obtained BETWEEN 61 AND 70 THEN '61-70'
                WHEN g.marks_obtained BETWEEN 71 AND 80 THEN '71-80'
                WHEN g.marks_obtained BETWEEN 81 AND 90 THEN '81-90'
                WHEN g.marks_obtained BETWEEN 91 AND 100 THEN '91-100'
            END AS marks_range,
            COUNT(*) AS student_count
            FROM 
            grades g
            JOIN 
            student s ON g.rollno = s.rollno
            WHERE 
            s.stud_std = ${standard}  
            GROUP BY 
            marks_range;
        `;

        const rangeCounts = rangeCountsQuery.reduce((acc, item) => {
            acc[item.marks_range] = Number(item.student_count); // Convert to number
            return acc;
        }, {});

        // Number of students in each activity who scored more than 45 marks
        const activityMarks = await prisma.$queryRaw`
            SELECT 
            a.activity_id AS "Activity Code",
            COUNT(DISTINCT am.rollno) AS "No of student"
            FROM 
            activity a
            JOIN 
            activitymarks am ON a.activity_id = am.activity_id
            JOIN 
            student s ON am.rollno = s.rollno
            WHERE 
            am.marks_obtained > 45 
            AND s.stud_std = ${standard} 
            GROUP BY 
            a.activity_id;
        `;

        const activityData = activityMarks.map(item => ({
            activityCode: item["Activity Code"],
            studentCount: Number(item["No of student"]) // Convert to number
        }));

        const dashboardData = {
            studentsCount,
            avgMarksBySubject: formattedData,
            passFailCount: { pass: passCount, fail: failCount },
            rangeCounts,
            activityData
        };

        return res.json(dashboardData);

    } catch (error) {
        console.error('Error fetching teacher dashboard data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


async function teachertabulardata(req, res) {
    try {
        const teacherid = req.teacherId || req.body.teacherId;
        const teacher = await prisma.teacher.findUnique({
            where: { teacher_id: teacherid },
            select: { school_id: true, allocated_standard: true }
        });

        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }
        const standard = teacher.allocated_standard;
        const resultofstudent = await prisma.$queryRaw`
        SELECT 
        ROW_NUMBER() OVER (ORDER BY s.rollno) AS "sr. no",
        s.rollno AS "student Id",
        CONCAT(s.stud_fname, ' ', s.stud_lname) AS "student name",
        AVG(g.marks_obtained) AS "Academic % of student",
        am.activity_id AS "Activity Grade of student",
        COALESCE(a.achievement_title, 'N.A') AS "Achievement title",
        CASE 
            WHEN AVG(g.marks_obtained) >= 40 THEN 'Pass'
            ELSE 'Fail'
        END AS "Pass / Fail"
        FROM 
            student s
        LEFT JOIN 
            grades g ON s.rollno = g.rollno
        LEFT JOIN 
            activitymarks am ON s.rollno = am.rollno
        LEFT JOIN 
            achievement a ON s.rollno = a.GRno  
        WHERE 
            s.stud_std = ${standard} 
        GROUP BY 
            s.rollno, s.stud_fname, s.stud_lname, am.activity_id, a.achievement_title;
        `;
        const studentachivement = await prisma.$queryRaw`
        SELECT 
            ROW_NUMBER() OVER (ORDER BY s.rollno) AS "sr. no",
            s.rollno AS "student Id",
            CONCAT(s.stud_fname, ' ', s.stud_lname) AS "student name",
            a.achievement_title AS "Achievement title",
            a.date AS "Date (student achievement)"
            FROM 
                student s
            JOIN 
                achievement a ON s.rollno = a.GRno  
            WHERE 
                s.stud_std = ${standard}; 
        `;

        const convertBigIntToString = (obj) => {
            for (let key in obj) {
                if (typeof obj[key] === 'bigint') {
                    obj[key] = obj[key].toString();
                }
            }
            return obj;
        };

        const resultofstudentConverted = resultofstudent.map(convertBigIntToString);
        const studentachivementConverted = studentachivement.map(convertBigIntToString);

        return res.json({ resultofstudent: resultofstudentConverted, studentachivement: studentachivementConverted });
    } catch (error) {
        console.error('Error fetching teacher tabular data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function addachivement(req, res) {

    const teacherId = req.teacherId;
    const { achievement_title, date, rollno } = req.body;
    //find teacherallocated standard from teacher id
    const teacher = await prisma.teacher.findUnique({
        where: { teacher_id: teacherId },
        select: { school_id: true, allocated_standard: true }
    });
    const standard = teacher.allocated_standard;
    const student = await prisma.student.findFirst({
        where: {
            rollno: parseInt(rollno),
        }
    });

    if (!student) {
        return res.status(404).json({ error: 'Student not found' });
    }
    const GRno = student.GRno;

    await prisma.achievement.create({
        data: {
            achievement_title: achievement_title,
            date: isNaN(Date.parse(date)) ? new Date().toISOString() : new Date(date).toISOString(),
            GRno: parseInt(GRno),
            student_std: parseInt(standard)
        }
    });
    return res.status(200).json({ message: 'Achievement added successfully' });
}

async function updatemarks(req, res) {

    const teacherId = req.teacherId;
    const { rollno, subject_id, marks_obtained } = req.body;
    const teacher = await prisma.teacher.findUnique({
        where: { teacher_id: teacherId },
        select: { school_id: true, allocated_standard: true }
    });
    const standard = teacher.allocated_standard;
    const student = await prisma.student.findFirst({
        where: {
            rollno: parseInt(rollno),
        }
    });

    if (!student) {
        return res.status(404).json({ error: 'Student not found' });
    }
    const subjects = ['ENG301', 'GUJ101', 'MATH101', 'SCI201', 'SS401'];
    const grade = await prisma.grades.findFirst({
        where: {
            rollno: parseInt(rollno),
            subject_id: subject_id,
            year: new Date().getFullYear()
        }
    });

    if (!grade) {
        return res.status(404).json({ error: 'Grade not found' });
    }

    await prisma.grades.update({
        where: {
            grade_id: grade.grade_id
        },
        data: {
            marks_obtained: marks_obtained
        }
    });

    return res.status(200).json({ message: 'Marks updated successfully' });


}

module.exports = { getReport, addstudent, addmarks, showsAllStudents, addactivitymarks, teacherdashboarddata, teachertabulardata, addachivement, updatemarks };
//                     Done      Done      //vasu             Done        //dummy data        Done               Done               Done