const router = require('express').Router();
const {
    getAllStudents,
    getAllAdmins,
    getAllLecturers,
    getProfile,
    signIn,
    createAccount,
    releaseResults,
    newStudent,
    newLecturer,
    previewResult,
    registerCoursesForSemester,
    updateStudentSemesterLevel,
    getCurrentSemester,
    deleteLecturer,
    deleteStudent,
    deleteAdmin,
    editStudent,
    editLecturer,
    editAdmin,
} = require('../controllers/adminController');

// Admin routes
router.get('/admins', getAllAdmins);
router.post('/admins/signin', signIn);
router.post('/admins/create', createAccount);
router.get('/admins/profile/:adminId', getProfile);
router.delete('/admins/delete/:adminId', deleteAdmin);
router.put('/admins/edit/:adminId', editAdmin);

// Lecturer routes
router.get('/lecturers', getAllLecturers);
router.post('/lecturers/create', newLecturer);
router.delete('/lecturers/delete/:lecturerId', deleteLecturer);
router.put('/lecturers/edit/:lecturerId', editLecturer);

// Student routes
router.get('/students', getAllStudents);
router.post('/students/create', newStudent);
router.delete('/students/delete/:studentId', deleteStudent);
router.put('/students/edit/:studentId', editStudent);

// Results and courses
router.post('/results/release', releaseResults);
router.post('/results/preview', previewResult);
router.post('/courses/register', registerCoursesForSemester);
router.post('/students/update-semester', updateStudentSemesterLevel);

// Misc
router.get('/semester/current', getCurrentSemester);

module.exports = router;