const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lecturerSchema = new Schema({
  fullName:         { type: String, required: true },
  workEmail:        { type: String, unique: true, sparse: true },
  workId:           { type: String, unique: true, required: true},
  department:       { type: String },
  profilePic:       { type: String, default: null },
  phone:            { type: String },
  coursesTaking:    [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Lecturer', lecturerSchema);