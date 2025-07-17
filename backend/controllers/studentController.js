const Student = require('../models/studentModel');
const Result = require('../models/resultModel');

module.exports = {
    async signIn(req, res) {
        try{
            const { email, password } = req.body;
            const student = await Student.findOne({ schoolEmail: email });
            if (!student) {
                return res.status(404).json({ message: 'Student not found' });
            }
            if (student.matricNumber.toLocaleLowerCase() !== password.toLocaleLowerCase()) {
                return res.status(401).json({ message: 'Invalid Matric Number' });
            }
            res.status(200).json({
                message: 'Sign in successful',
                student
            });
        }catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
    },
    async getAllResults(req, res) {
        const { studentId } = req.params;
        try {
            const student = await Student.findById(studentId);
            if (!student) {
                return res.status(404).json({ message: 'Student not found' });
            }
            const results = await Result.find({ student: studentId, isReleased: true });
            
            if (!results.length) return res.status(404).json({ 
                message: "No results found" 
            });
            const groupedResults = {};
            results.forEach(result => {
                const semester = result.semester;
                if (!groupedResults[semester]) {
                    groupedResults[semester] = [];
                }
                groupedResults[semester].push(result);
            });
            const semesterResults = Object.keys(groupedResults).map(semester => ({
                semester,
                courses: groupedResults[semester]
            }));
            res.status(200).json({ 
                message: "All results retrieved successfully", 
                semesterResults 
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: error.message });
        }
    },
    async getProfile(req, res) {
        try {
            const studentId = req.params.studentId;
            const student = await Student.findById(studentId);
            if (!student) {
                return res.status(404).json({ message: 'Student not found' });
            }
            res.status(200).json(student);
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: error.message });
        }
    },
    async getResult(req, res) {
        const { studentId } = req.params;
        const {data} = req.body;
        const { level, semester } = data;
        try {
            const student = await Student.findById(studentId);
            if (!student) return res.status(404).json({ message: "Student not found" });
            const results = await Result.find({ student: studentId, level: level, semester: semester, isReleased: true});
            if (!results.length) return res.status(404).json({ message: "No results found for this semester" });
            const carryOverCourses = results
                .filter(result => {
                    const totalScore = result.testScore + result.examScore;
                    return totalScore < 40; 
                })
                .map(result => result.courseCode);
            student.carryOverCourses = [...new Set([...student.carryOverCourses, ...carryOverCourses])];
            await student.save();
            return res.status(200).json({ 
                message: "Result retrieved successfully and carryover courses updated", 
                results, 
                carryOverCourses: student.carryOverCourses 
            });
        } catch (error) {
            console.error('Error in result:', error.message);
            return res.status(500).json({ message: "Internal server error", error });
        }
    },
    async getGPA(req, res) {
        const { studentId } = req.params;
        try {
            const student = await Student.findById(studentId);
            if (!student) return res.status(404).json({ message: "Student not found" });

            return res.status(200).json({
                message: "GPA fetched successfully",
                gpData: {
                    gpa: student.semesterGPA,
                    cgpa: student.cgpa
                }
            });
        } catch (error) {
            console.error('Error in getGPA:', error.message);
            return res.status(500).json({ message: "Internal server error", error: error.message });
        }
    },
    async carryOverCourses(req, res) {
        const { studentId } = req.params;
        try {
            const student = await Student.findById(studentId).populate('carryOverCourses');
            if (!student) return res.status(404).json({ message: "Student not found" });
            return res.status(200).json({ message: "Carry over courses retrieved successfully", courses: student.carryOverCourses });
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    },
}