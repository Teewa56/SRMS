const Admin = require('../models/adminModel');
const Lecturer = require('../models/lecturerModel');
const Student = require('../models/studentModel');
const Result = require('../models/resultModel');
const bcrypt = require('bcrypt');
const coursesData = require('../coursesInfo.json');

const getPoints = (score) => {
    if (score >= 70) return { point: 5 };
    if (score >= 60) return { point: 4 };
    if (score >= 50) return { point: 3 };
    if (score >= 45) return { point: 2 };
    if (score >= 40) return { point: 1 };
    return { grade: 'F', point: 0 };
};

module.exports = {
    async getAllAdmins(req, res) {
        try {
            const admins = await Admin.find();
            res.status(200).json(admins);
        } catch (error) { 
            res.status(500).json({ message: 'Error fetching admins', error });
        }
    },
    async signIn(req, res) {
        const { email, password } = req.body;
        try {
            const admin = await Admin.findOne({ workEmail: email });
            if (!admin) {
                return res.status(404).json({ message: 'Admin not found' });
            }
            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Wrong Password' });
            }
            res.status(200).json({ message: 'Sign in successful', admin });
        } catch (error) {
            res.status(500).json({ message: 'Error signing in', error });
        }
    },
    async createAccount(req, res) {
        const { fullName,  workEmail, password, adminId, profilePic, phone } = req.body;
        try {
            const existingAdmin = await Admin.findOne({ workEmail, adminId });
            if (existingAdmin) {
                return res.status(400).json({ message: 'Admin already exists' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newAdmin = new Admin({
                fullName,                
                workEmail,
                adminId,
                profilePic,
                phone,
                password: hashedPassword,
            });
            await newAdmin.save();
            res.status(201).json({ message: 'Admin account created successfully', admin: newAdmin });
        } catch (error) {
            console.error('Error creating admin account:', error);
            res.status(500).json({ message: 'Error creating admin account', error });
        }
    },
    async getProfile(req, res) {
        try {
            const admin = await Admin.findById(req.params.id);
            if (!admin) {
                return res.status(404).json({ message: 'Admin not found' });
            }
            res.status(200).json(admin);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching admin profile', error });
        }
    },
    async releaseResults(req, res) {
        try {
            const results = await Result.find({ isReleased: false });
            if (!results.length) {
                return res.status(404).json({ message: 'No results available to release' });
            }
            const studentsToUpdate = new Set(results.map(r => r.student.toString()));
            for (const studentId of studentsToUpdate) {
                const student = await Student.findById(studentId);
                if (!student) continue;
                const studentResults = await Result.find({ student: studentId, isReleased: false });
                if (studentResults.length > 0) {
                    await Promise.all(studentResults.map(async result => {
                        result.isReleased = true;
                        await result.save();
                    }));
                    let totalWeightedPoints = 0;
                    let totalUnits = 0;
                    for (const result of studentResults) {
                        const courseInfo = Object.values(coursesData)
                            .flatMap(faculty => Object.values(faculty))
                            .flatMap(dept => Object.values(dept))
                            .flatMap(level => Object.values(level))
                            .flat()
                            .find(course => course.code === result.courseCode);

                        const units = courseInfo ? courseInfo.units : 0;
                        const { point } = getPoints(result.testScore + result.examScore);
                        totalWeightedPoints += point * units;
                        totalUnits += units;
                    }
                    const semesterGPA = totalUnits > 0 ? (totalWeightedPoints / totalUnits) : 0;
                    const newSemstersCompleted = student.semestersCompleted + 1;
                    const newCGPA = +(((student.cgpa * student.semestersCompleted) + semesterGPA) / newSemstersCompleted).toFixed(2);
                    student.semesterGPA = semesterGPA;
                    student.cgpa = newCGPA;
                    student.semestersCompleted = newSemstersCompleted;
                    await student.save();
                }
            }
            res.status(200).json({ message: 'Results released successfully', results });
        } catch (error) {
            res.status(500).json({ message: 'Error releasing results', error });
        }
    },
    async getAllLecturers(req, res) {
        try {
            const lecturers = await Lecturer.find();
            res.status(200).json(lecturers);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching lecturers', error });
        }
    },
    async getAllStudents(req, res) {
        try {
            const students = await Student.find();
            res.status(200).json(students);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching students', error });
        }
    },
    async newStudent(req, res) {
        const { fullName, matricNumber, schoolEmail, department, profilePic, phone, currentSession, faculty } = req.body;
        try {
            const existingStudent = await Student.findOne({ matricNumber, schoolEmail });
            if (existingStudent) {
                return res.status(400).json({ message: 'Student already exists' });
            }
            let registeredCourses = [];
            const currentLevel = '100 Level';
            const currentSemester = 'First Semester';
        
            registeredCourses = coursesData[faculty][department][currentLevel][currentSemester].map(
                course => course['code']
            );
            const newStudent = new Student({
                fullName,
                matricNumber,
                schoolEmail,
                department,
                profilePic,
                phone,
                registeredCourses,
                currentLevel,
                currentSemester,
                currentSession,
                faculty,              
            });
            await newStudent.save();
            res.status(201).json({ message: 'Student account created successfully', student: newStudent });
        } catch (error) {
            console.log('Error creating student account:', error);
            res.status(500).json({ message: 'Error creating student account', error });
        }
    },
    async newLecturer(req, res) {
        const { fullName, workEmail, workId, department, profilePic, phone, coursesTaking } = req.body;
        try {
            const existingLecturer = await Lecturer.findOne({ workId, workEmail });
            if (existingLecturer) {
                return res.status(400).json({ message: 'Lecturer already exists' });
            }
            const alreadyAssignedCourses = await Lecturer.find({ coursesTaking: {$in:  coursesTaking }});
            if (alreadyAssignedCourses && alreadyAssignedCourses.length > 0) {
                return res.status(400).json({ message: 'Some Courses already assigned to another lecturer'});
            }
            const newLecturer = new Lecturer({
                fullName,
                workEmail,
                department,
                profilePic,
                phone,
                workId,
                coursesTaking: coursesTaking || []
            });
            await newLecturer.save();
            res.status(201).json({ message: 'Lecturer account created successfully', lecturer: newLecturer });
        } catch (error) {
            res.status(500).json({ message: 'Error creating lecturer account', error });
        }
    },
    async previewResult(req, res) {
        const { data } = req.body;
        const { level, department, semester } = data;
        try {
            const students = await Student.find({
                currentLevel: level,
                department,
                currentSemester: semester
            });

            const results = await Promise.all(students.map(async (student) => {
                const studentResults = await Result.find({
                    student: student._id,
                    level,
                    semester
                });

                return {
                    studentId: student._id,
                    fullName: student.fullName,
                    matricNo: student.matricNo,
                    cgpa: student.cgpa,
                    results: studentResults
                };
            }));

            res.status(200).json({
                message: 'Results retrieved successfully',
                results
            });

        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: `Server error: ${error.message}` });
        }
    },
    async registerCoursesForSemester(req, res) {
        try {
            const students = await Student.find();
            for (const student of students) {
                const { department, currentLevel, currentSemester } = student;
                const courses = coursesData[department]?.[currentLevel]?.[currentSemester] || [];
                student.registeredCourses = courses.map(course => course['code']);
                await student.save();
            }
            return res.status(200).json({ message: 'Courses registered for all students' });
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({ message: `Server error: ${error.message}` });
        }
    },
    async updateStudentSemesterLevel(req, res) {
        try {
            const students = await Student.find();
            for (const student of students) {
                if (student.currentLevel === 'Graduated') continue;
                if (student.currentLevel === '500 Level' && student.currentSemester === 'Second Semester') {
                    student.currentLevel = 'Graduated';
                    student.currentSemester = 'Graduated';
                    student.currentSession = 'Graduated';
                    student.levelsCompleted += 1;
                } else if (student.currentSemester === 'Second Semester' && student.currentLevel !== '500 Level') {
                    student.currentLevel = `${parseInt(student.currentLevel) + 100} Level`;
                    student.currentSemester = 'First Semester';
                    student.currentSession = `${parseInt(student.currentSession.split('/')[0]) + 1}/${parseInt(student.currentSession.split('/')[1]) + 1}`;
                    student.levelsCompleted += 1;
                } else {
                    student.currentSemester = 'Second Semester';
                }
                await student.save();
            }
            return res.status(200).json({ message: 'Student semester and level updated' });
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({ message: `Server error: ${error.message}` });
        }
    },
    async getCurrentSemester(req, res) {
        try {
            const student = await Student.findOne();
            if (!student) return res.status(404).json({ message: 'No student found' });
            const currentSemester = student.currentSemester;
            return res.status(200).json({ message: 'Current Semester', currentSemester }); 
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({ message: `Server error: ${error.message}` });
        }
    }
}