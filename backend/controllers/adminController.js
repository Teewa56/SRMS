const Admin = require('../models/adminModel');
const Lecturer = require('../models/lecturerModel');
const Student = require('../models/studentModel');
const Result = require('../models/resultModel');
const bcrypt = require('bcrypt');
const coursesData = require('../coursesInfo.json');
const { generatePdf ,sendResult } = require('../services/emailServices')

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
    async deleteStudent(req, res){
        try {
            const { studentId } = req.params;
            if(!studentId) return res.status(400).json({message: "Invalid student Id"})
            const isExisting = await Student.findById(studentId);
            if(!isExisting) return res.status(404).json({message : "Student does not exist"});
            await Student.findByIdAndDelete(studentId);
            res.status(200).json({message: "Succesfully deleted Student"})
        } catch (error) {
            console.error('Error deleting students account:', error);
            res.status(500).json({ message: 'Error deleting students account', error });
        }
    },
    async deleteLecturer(req, res){
        try {
            const { lecturerId } = req.params;
            if(!lecturerId) return res.status(400).json({message: "Invalid lecturer Id"})
            const isExisting = await Lecturer.findById(lecturerId);
            if(!isExisting) return res.status(404).json({message : "lecturer does not exist"});
            await Lecturer.findByIdAndDelete(lecturerId);
            res.status(200).json({message: "Succesfully deleted lecturer"})
        } catch (error) {
            console.error('Error deleting lecturers account:', error);
            res.status(500).json({ message: 'Error deleting lecturers account', error });
        }
    },
    async deleteAdmin(req, res){
        try {
            const { adminId } = req.params;
            if(!adminId) return res.status(400).json({message: "Invalid admin Id"})
            const isExisting = await Admin.findById(adminId);
            if(!isExisting) return res.status(404).json({message : "admin does not exist"});
            await Admin.findByIdAndDelete(adminId);
            res.status(200).json({message: "Succesfully deleted admin"})
        } catch (error) {
            console.error('Error deleting admins account:', error);
            res.status(500).json({ message: 'Error deleting admins account', error });
        }
    },
    async editStudent(req, res){
        const { studentId } = req.params;
        const data  = req.body;
        try {
            const student = await Student.findByIdAndUpdate(studentId, data, { new: true });
            if (!student) return res.status(404).json({ message: 'Student not found' });

            return res.status(200).json({ message: 'Student information updated successfully', student });
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({ message: `Server error: ${error.message}` });
        }
    },
    async editLecturer(req, res) {
        const { lecturerId } = req.params;
        const data  = req.body;
        try {
            const alreadyAssignedCourses = await Lecturer.find({ 
                _id: {$ne: lecturerId},
                coursesTaking: {$in:  data.coursesTaking }
            });
            if (alreadyAssignedCourses && alreadyAssignedCourses.length > 0 ) {
                return res.status(400).json({ message: 'Some Courses already assigned to another lecturer'});
            }
            const existingId = await Lecturer.findOne({
                _id: {$ne: lecturerId},
                workId: data.workId
            });
            if(existingId) {
                return res.status(400).json({message: "Lecturer Id already Exists"})
            }
            const lecturer = await Lecturer.findByIdAndUpdate(lecturerId, data, { new: true });
            if (!lecturer) return res.status(404).json({ message: 'Lecturer not found' });
            return res.status(200).json({ message: 'Lecturer information updated successfully', lecturer });
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({ message: `Server error: ${error.message}` });
        }
    },
    async editAdmin(req, res) {
        const { adminId } = req.params;
        const  data  = req.body;
        try {
            const updatedAdmin = await Admin.findByIdAndUpdate(adminId, data, { new: true });
            if (!updatedAdmin) return res.status(404).json({ message: 'admin not found' });

            return res.status(200).json({ message: 'admin information updated successfully', updatedAdmin });
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({ message: `Server error: ${error.message}` });
        }
    },
    async getProfile(req, res) {
        try {
            const admin = await Admin.findById(req.params.adminId);
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
                    const carryOverCourses = studentResults
                        .filter(result => {
                            const totalScore = result.testScore + result.examScore;
                            return totalScore < 40;
                        })
                        .map(result => result.courseCode);
                    student.carryOverCourses = [...new Set([...student.carryOverCourses, ...carryOverCourses])];
                    await student.save();
                }
                const pdfPath = await generatePdf(student, studentResults);
                await sendResult(student, pdfPath);
            }
            res.status(200).json({ message: 'Results released successfully', results });
        } catch (error) {
            console.log(error)
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
                course => course.code
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
                department: department,
                currentSemester: semester
            });
            if (!students.length) {
                return res.status(404).json({ message: 'No students found for the specified criteria' });
            }
            const results = await Promise.all(students.map(async (student) => {
                const studentResults = await Result.find({
                    student: student._id,
                    level,
                    semester
                });

                return {
                    studentId: student._id,
                    fullName: student.fullName,
                    matricNumber: student.matricNumber,
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
                const { department, currentLevel, currentSemester, faculty } = student;
                const courses = coursesData[faculty]?.[department]?.[currentLevel]?.[currentSemester] || [];
                student.registeredCourses = courses.map(course => course.code);
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