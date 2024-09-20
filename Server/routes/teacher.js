const express = require('express');
const multer = require('multer');
const { HandleTeacherLogin, getReport, addstudent, addmarks, showsAllStudents, addactivitymarks, teacherdashboarddata ,teachertabulardata,addachivement} = require('../controllers/teacher.js');
const { authenticateTeacher } = require('../middleware/authteacher.js');
const { route } = require('./static.js');
const router = express.Router();
const upload = multer({ dest: 'uploads/' });
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});


router.get("/", (req, res) => {
    return res.send("Welcome to the teacher homepage");
});
router.get("/uploadfile", authenticateTeacher, (req, res) => {
    return res.render("homepage");
});

router.get("/marks", authenticateTeacher, (req, res) => {
    return res.render("addmarks");
});

router.get("/activitymarks", authenticateTeacher, (req, res) => {
    return res.render("addactivitymarks");
});




// Protected routes
router.get('/report', authenticateTeacher, getReport); 
router.post('/addstudent', authenticateTeacher, upload.single("excelFile"), addstudent);
router.post('/uploadmarks', authenticateTeacher, upload.single("excelFile"), addmarks);
router.get('/allstudent', authenticateTeacher, showsAllStudents)
router.post('/activitymarks', authenticateTeacher, upload.single("excelFile"), addactivitymarks);
router.get('/dashboarddata', authenticateTeacher, teacherdashboarddata);
router.get('/tabulardata', authenticateTeacher, teachertabulardata);
router.post('/addachivement',authenticateTeacher,addachivement);


module.exports = router;
