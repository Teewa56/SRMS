const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  fullName:         { type: String, required: true },
  workEmail:        { type: String, required: true },
  adminId:          { type: String, unique: true, required: true },
  phone:            { type: String },
  profilePic:       { type: String, default: null },
  password:         { type: String, required: true}
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);