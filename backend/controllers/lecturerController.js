const Lecturer = require('../models/lecturerModel');
const Student = require('../models/studentModel');
const Result = require('../models/resultModel');

module.exports = {

    async signIn(req, res){
        try {
            const { email, password } = req.body;
            const lecturer = await Lecturer.findOne({ workEmail: email });
            if (!lecturer) {
                return res.status(404).json({ message: 'Lecturer not Found, Please see an admin' });
            }
            if (lecturer.workId.toLocaleLowerCase() !== password.toLocaleLowerCase()) {
                return res.status(401).json({ message: 'Invalid Matric Number' });
            }
            res.status(200).json({
                message: 'Sign in successful',
                lecturer
            });
        } catch (error) {
            console.error('Error during sign in:', error);
            res.status(500).json({ message: error.message });
        }
    },
    async getProfile(req, res) {
        try {
            const lecturerId = req.params.lecturerId;
            const lecturer = await Lecturer.findById(lecturerId);
            if (!lecturer) {
                return res.status(404).json({ message: 'lecturer not found' });
            }
            res.status(200).json(lecturer);
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: error.message });
        }
    },
    async getCoursesTaking(req, res) {
        try {
            const lecturerId = req.params.lecturerId;
            const lecturer = await Lecturer.findById(lecturerId);
            if (!lecturer) {
                return res.status(404).json({ message: 'Lecturer not found for this course' });
            };
            const courses = lecturer.coursesTaking;
            if (!courses || courses.length === 0) {
                return res.status(404).json({ message: 'No courses found for this lecturer' });
            };
                       
            return res.status(200).json({ 
                message: 'Course retrieved successfully', 
                courses, 
            });
        } catch (error) {
            return res.status(500).json({ message: `Server error: ${error.message}` });
        }
    },
    async getCourseStudents(req, res) {
        const {courseCode} = req.params;
        try {
            const students = await Student.find({
                registeredCourses: courseCode
            })
            return res.status(200).json({
                message: 'Registered students retrieved',
                students
            });
        } catch (error) {
            return res.status(500).json({ message: `Server error: ${error.message}` });
        }
    },
    async uploadCourseResult(req, res) {
        const { lecturerId } = req.params;
        const data  = req.body;
        const { results } = data || {};
        try {
            if (!results || !Array.isArray(results)) {
                return res.status(400).json({ 
                    message: 'Invalid request format: results array is required' 
                });
            }
            const lecturer = await Lecturer.findById(lecturerId);
            if (!lecturer) {
                return res.status(404).json({ message: 'Lecturer not found' });
            }
            const uploadedResults = [];
            for (const result of results) {
                const student = await Student.findById(result.studentId);
                if (!student) return res.status(400).json({
                    message: "Some information missing, make sure all data is complete"
                });
                const newResult = await Result.create({
                    student: result.studentId,
                    courseCode: result.courseCode,
                    semester: student.currentSemester,
                    level: student.currentLevel,
                    testScore: result.testScore,
                    examScore: result.examScore,
                    grade: result.grade,
                    lecturer: lecturerId,
                    isUploaded: true
                })
                uploadedResults.push(newResult);
            }
            return res.status(200).json({
                message: 'Results processing completed',
                resultsUploaded: uploadedResults.length
            });
        } catch (error) {
            console.error('Error in uploadCourseResults:', error.message);
            return res.status(500).json({ message: `Server error: ${error.message}` });
        }
    },
    async getCourseResult(req, res) {
        const { lecturerId } = req.params;
        const { courseCode } = req.query;
        try {
            const students = await Student.find({ registeredCourses: courseCode });
            if (!students || students.length === 0) {
                return res.status(404).json({ message: 'No students currently registered for this course' });
            }
            const { currentSemester, currentLevel } = students[0];
            const results = await Result.find({
                courseCode,
                lecturer: lecturerId,
                semester: currentSemester,
                level: currentLevel
            }).populate('student');
            if (!results.length) {
                return res.status(404).json({ message: 'No results found for this course in the current semester/level' });
            }
            return res.status(200).json({
                message: 'Course results retrieved successfully',
                results
            });
        } catch (error) {
            console.error('Error in getCourseResults:', error.message);
            return res.status(500).json({ message: `Server error: ${error.message}` });
        }
    },  
}