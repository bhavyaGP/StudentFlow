const path = require("path");
const multer = require("multer");
const csvtojson = require("csvtojson");
const fs = require("fs");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const app = express();
const upload = multer({ storage });

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.urlencoded({ extended: false }));

app.post("/upload", upload.single("excelFile"), (req, res) => {
    if (!req.file) {
        return res.status(400).send("No files were uploaded.");
    }

    // console.log("File uploaded:", req.file.filename);
    // const csvFilePath = req.file.path;

    csvtojson()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            
            //upload jsonobj to database
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
        })
        .catch((err) => {
            console.error("Error converting CSV to JSON:", err);
            return res.status(500).send("Error converting CSV to JSON.");
        });
});
