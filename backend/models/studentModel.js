const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    fullName:             {type: String, required: true, trim: true},
    schoolEmail:          {type: String,required: true,unique: true, trim: true,lowercase: true},
    matricNumber:         {type: String,required: true,unique: true,trim: true},
    currentLevel:         { type: String },
    currentSemester:      { type: String },
    department:           { type: String, required: true },
    faculty:              { type: String, required: true },
    semesterGPA:          { type: Number, default: 0 },
    currentSession:       { type: String },
    cgpa:                 { type: Number, default: 0 }, 
    levelsCompleted:      { type: Number, default: 0 }, 
    semestersCompleted:   { type: Number, default: 0 },
    profilePic:           { type: String, default: null },
    phoneNumber:          { type: String },
    yearOfAdmission:      { type: String },
    yearOfGraduation:     { type: String }, 
    carryOverCourses:     [{ type: String, default: [] }], 
    registeredCourses:    [{ type: String, default: [] }],
}, {timestamps: true});


module.exports = mongoose.model('Student', studentSchema);