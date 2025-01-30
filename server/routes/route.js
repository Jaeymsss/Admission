const router = require('express').Router();
const { getApplication, selectSchedule, getApplicationSchedule, getVerifyApplication, getStudents, getStudentInfo, updateStudentInfo, deleteStudent, createSchedule, getSchedule, deleteSchedule, getScheduleView, viewGeneratedPDF } = require('../controller/appController.js');
const { login, getUser, editUser, userPass, signup } = require('../controller/authController.js');
const { getSettings, createSettings, editSettings, announcementSettings, getAnnouncements } = require('../controller/settingsController.js');
const { viewPDF } = require('../controller/viewPDFController.js');

// HTTP Request
router.post('/application', getApplication);

router.get('/application/schedule', getApplicationSchedule);

router.put('/application/select/:id', selectSchedule);

router.get('/application/verify/:token/:id', getVerifyApplication);

router.post('/signup', signup); //only for admin create

router.post('/login', login);

router.get('/getUser/:id', getUser);

router.put('/editUser/:id', editUser);

router.put('/user/password/:id', userPass);

router.post('/schedule/create', createSchedule);

router.get('/schedule', getSchedule);

router.delete('/schedule-delete/:id', deleteSchedule);

router.get('/schedule/view/:id', getScheduleView);

router.get('/students', getStudents);

router.get('/student/:id', getStudentInfo);

router.put('/student/edit/:id', updateStudentInfo);

router.delete('/students/:id', deleteStudent);

router.get('/viewPdf/:filename', viewPDF);

router.post('/viewGeneratedPDF', viewGeneratedPDF);

router.get('/settings', getSettings);

router.post('/newSettings', createSettings);

router.put('/settings/:id', editSettings);

router.post('/announcement', announcementSettings);

router.get('/getAnnouncement', getAnnouncements);

module.exports = router;