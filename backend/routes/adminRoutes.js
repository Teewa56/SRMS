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
    getCurrentSemester
} = require('../controllers/adminController');

// Admin routes
router.get('/admins', getAllAdmins);
router.post('/admins/signin', signIn);
router.post('/admins/create', createAccount);
router.get('/admins/profile/:id', getProfile);

// Lecturer routes
router.get('/lecturers', getAllLecturers);
router.post('/lecturers/create', newLecturer);

// Student routes
router.get('/students', getAllStudents);
router.post('/students/create', newStudent);

// Results and courses
router.post('/results/release', releaseResults);
router.post('/results/preview', previewResult);
router.post('/courses/register', registerCoursesForSemester);
router.post('/students/update-semester', updateStudentSemesterLevel);

// Misc
router.get('/semester/current', getCurrentSemester);

module.exports = router;