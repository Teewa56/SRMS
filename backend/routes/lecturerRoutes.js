const router = require('express').Router();
const { 
    signIn,
    getProfile, 
    getCoursesTaking, 
    getCourseStudents, 
    uploadCourseResult,
    getCourseResult,
    editResult
} = require('../controllers/lecturerController');

router.post('/signin', signIn);
router.get('/profile/:lecturerId', getProfile);
router.get('/:lecturerId/courses-taking', getCoursesTaking);
router.get('/course/:courseCode/students', getCourseStudents);
router.post('/:lecturerId/upload-result', uploadCourseResult);
router.get('/:lecturerId/course-result', getCourseResult);
router.put('/result/edit/:lecturerId', editResult);

module.exports = router;