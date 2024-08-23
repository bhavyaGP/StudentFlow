const express = require('express');
const multer = require('multer');
const { loginTeacher, getReport, addstudent, addmarks, showsAlltudents } = require('../controllers/teacher.js');
const { authenticateTeacher } = require('../middleware/authteacher.js');
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

router.get("/uploadfile", authenticateTeacher, (req, res) => {
    return res.render("homepage");
});

router.get("/start", (req, res) => {
    return res.render("login");
});

// Public routes
router.post('/login', loginTeacher);

// Protected routes
router.get('/report', authenticateTeacher, getReport); // Requires authentication
router.post('/addstudent', authenticateTeacher, upload.single("excelFile"), addstudent);
router.post('/uploadmarks', authenticateTeacher, upload.single("excelFile"), addmarks);
router.get('allstudent', authenticateTeacher, showsAlltudents)


// router.post('/upload', upload.single("excelFile"), updatestudent);

module.exports = router;
