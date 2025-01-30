const cron = require('node-cron');
const StudentInfo = require('../models/applicationModel');
const Schedule = require('../models/scheduleModel');

cron.schedule('0 0 * * *', async () => {
    try {
        const oneDay = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const studentsToBeDelete = await StudentInfo.find({ 
            expiredAt: { $lt: oneDay },
            verified: false
        });

        const deletedStudents = studentsToBeDelete.map(doc => doc._id);

        await StudentInfo.deleteMany({ 
            _id: { $in: deletedStudents }
        });

        const remainingStudent = await Schedule.distinct('studentId', { studentId: { $in: deletedStudents } });

        if(remainingStudent.length > 0) {
            await Schedule.deleteMany({ studentId: { $in: remainingStudent } });
        }
        
        console.log('Expired tokens with verification status false data have been removed successfully.');
    } catch(e) {
        console.log(e.message);
    }
});