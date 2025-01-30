const mongoose = require('mongoose');

const studentInfoSchema = new mongoose.Schema({
    applicationNumber: { type: Number, unique: true },
    firstName: String,
    middleName: String,
    lastName: String,
    extensionName: String,
    age: String,
    sex: String,
    civilStatus: String,
    religion: String,
    dob: String,
    placeOfBirth: String,
    address: String,
    citizenship: String,
    lrn: String,
    email: String,
    phone: Number,
    zipCode: String,
    parentName: String,
    occupation: String,
    parentPhone: Number,
    school: String,
    schoolAddress: String,
    course: String,
    files: [String],
    studentStatus: String,
    verified: { type: Boolean, default: false },
    verifyToken: String,
    expiredAt: Date,
    createdAt: Date,
});

const StudentInfo = mongoose.model('studentInfo', studentInfoSchema);

module.exports = StudentInfo;