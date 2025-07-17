const router = require('express').Router();
const { 
    signIn, 
    getAllResults, 
    getProfile, 
    getResult,
    getGPA,
    carryOverCourses
} = require('../controllers/studentController');

router.post('/signin', signIn);
router.get('/results/:studentId', getAllResults);
router.get('/profile/:studentId', getProfile);
router.get('/results/:studentId', getResult);
router.get('/gpa/:studentId', getGPA);
router.get('/carry-over-courses/:studentId', carryOverCourses);

module.exports = router;