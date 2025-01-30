const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: Date,
        required: true,
    },
    maxStudent: {
        type: Number,
        required: true,
    },
    studentId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'studentInfo',
    }],
});

const Schedule = mongoose.model('schedule', scheduleSchema);
module.exports = Schedule;