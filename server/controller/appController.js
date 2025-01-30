const multer = require('multer');
const path = require('path');
const  StudentInfo  = require('../models/applicationModel');
const Schedule = require('../models/scheduleModel');
const sendEmail = require('../utils/sendEmail');
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const { format } = require('date-fns');
const crypto = require('crypto');
const fs = require('fs').promises;
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + file.originalname);
    },
});


const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'));
        }
    } 
});


const getApplication = async (req, res) => {
    upload.array('files', 4)(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            console.error('Multer Error:', err);
            return res.status(500).send('File upload error.');
        } else if (err){
            console.error('Error:', err);
            return res.status(500).send('Please Check your upload file, Only PDF are allowed!');
        }

        const fileNames = req.files.map(file => path.basename(file.path));

        const studentJson = {
            firstName: req.body.firstName,
            middleName: req.body.middleName,
            lastName: req.body.lastName,
            extensionName: req.body.extensionName,
            age: req.body.age,
            sex: req.body.sex,
            civilStatus: req.body.civilStatus,
            religion: req.body.religion,
            dob: req.body.dob,
            placeOfBirth: req.body.placeOfBirth,
            address: req.body.address,
            citizenship: req.body.citizenship,
            lrn: req.body.lrn,
            email: req.body.email,
            phone: req.body.phone,
            zipCode: req.body.zipCode,
            parentName: req.body.parentName,
            occupation: req.body.occupation,
            parentPhone: req.body.parentPhone,
            school: req.body.school,
            schoolAddress: req.body.schoolAddress,
            course: req.body.course,
            files: fileNames,
            studentStatus: req.body.studentStatus,
            createdAt: new Date()
        };
       
     
        try {
            const randAppNumber = Math.floor(100000 + Math.random() * 900000);
            const studentExist = await StudentInfo.findOne({ firstName: studentJson.firstName, lastName: studentJson.lastName });
            
            if (studentExist) {
                return res.status(400).send('This user has already submitted an application!');
            }
        
            const token = crypto.randomBytes(32).toString('hex');
            const expiration = new Date();
            expiration.setHours(expiration.getHours() + 24);
        
            const newStudent = await StudentInfo.create({...studentJson, applicationNumber: randAppNumber, verifyToken: token, expiredAt: expiration});
            const studentId = newStudent._id;
        
            const verificationLink = `${process.env.BASE_URL}application/verify/${token}/${studentId}`;
            await sendEmail(studentJson.email, 'Email Verification', verificationLink);
        
            const responseObj = {
                message: "Successfully email sent!",
                email: studentJson.email,
                id: studentId
            };
            res.status(201).send(responseObj);
        } catch (e) {
            console.log('Error:', e);
            res.status(500).send('Something went wrong, Please try again...');
        }        
    });
}


const selectSchedule = async (req, res) => {
    const { id } = req.params;
    const studentId = req.body.studentId;

    try {
        const updatedSchedule = await Schedule.findByIdAndUpdate(id, { $push: { studentId: studentId } }, { new: true });

        if (!updatedSchedule) {
            return res.status(404).send('Schedule not found');
        }

        res.status(200).send('Schedule selected successfully.');
        console.log('Schedule updated successfully!');
    } catch (e) {
        console.error('Error:', e);
        res.status(500).send('Failed to select schedule.');
    }
}


const getApplicationSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.find();

        return res.status(200).json(schedule);
    } catch(e) {
        console.error('Error:', e);
        return res.status(500).send('Something went wrong...');
    }
}


const generatePDF = async (studentData) => {
    // const getLogo = await fs.readFile('../../client/src/assets/ccc.jpg');
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    const fontRegular = 9;
    const fontMedium = 11;
    const fontLarge = 12;

    const schoolName = "BUTONG ELEMENTARY SCHOOL";
    const schoolAddress = "74RP+2M5, Purok 3 Unnamed Rd, Cabuyao, 4025 Laguna";
    const title = "APPLICATION FORM";
    const title2 = "ADMISSION INTERVIEW";

    // const logo = await pdfDoc.embedPng(getLogo);
    // const logoWidth = 60;
    // const logoHeight = (logo.height / logo.width) * logoWidth;

    // page.drawImage(logo, {
    //     x: 30,
    //     y: height - logoHeight - 50,
    //     width: logoWidth,
    //     height: logoHeight,
    // });
    

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const schoolNameWidth = font.widthOfTextAtSize(schoolName, fontMedium);
    page.drawText(schoolName, {
        x: (width - schoolNameWidth) / 2,
        y: height - 5 * fontMedium,
        size: fontMedium,
        color: rgb(0, 0, 0),
    });
    
    const schoolAddressWidth = font.widthOfTextAtSize(schoolAddress, fontRegular);
    page.drawText(schoolAddress, {
        x: (width - schoolAddressWidth) / 2,
        y: height - 6 * fontMedium,
        size: fontRegular,
        color: rgb(0, 0, 0),
    });

    const titleWidth = font.widthOfTextAtSize(title, fontLarge);
    page.drawText(title, {
        x: (width - titleWidth) / 2,
        y: height - 10 * fontMedium,
        size: fontLarge,
        color: rgb(0, 0, 0),
        font: fontBold,
    });

    const title2Width = font.widthOfTextAtSize(title2, fontLarge);
    page.drawText(title2, {
        x: (width - title2Width) / 2,
        y: height - 11 * fontMedium,
        size: fontLarge,
        color: rgb(0, 0, 0),
        font: fontBold,
    });

    const pictureWidth = 100;
    const pictureHeight = 100;
    page.drawRectangle({
        x: width - 130,
        y: height - pictureHeight - 11,
        width: pictureWidth,
        height: pictureHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
    });


    const firstBoxWidth = 235;
    const firstBoxHeight = 60;
    page.drawRectangle({
        x: 30,
        y: height - 11 * fontMedium - firstBoxHeight - 20,
        width: firstBoxWidth,
        height: firstBoxHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
    });

    const boxOneText = [
        "TO THE APPLICANT, PARENT/GUARDIAN:",
        "Print clearly and legibly all required information.",
        "Place check marks in the appropriate boxes. Application",
        "forms not fully accomplished will not be processed"
    ];
    const lineHeight = 15;
    let boxOneY = height - 11 * fontMedium - firstBoxHeight - 15 + (firstBoxHeight - lineHeight);
    boxOneText.forEach((text) => {
        page.drawText(text, {
            x: 32,
            y: boxOneY,
            size: fontRegular,
            color: rgb(0, 0, 0),
            font: font,
        });
        boxOneY -= lineHeight;
    });
    

    const secondBoxWidth = 280;
    const secondBoxHeight = 120;
    page.drawRectangle({
        x: width - secondBoxWidth - 30,
        y: height - 11 * fontMedium - secondBoxHeight - 20,
        width: secondBoxWidth,
        height: secondBoxHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
    });

    const boxTwoText = [
        "FOR AUTHORIZED ADMISSION PERSONNEL ONLY",
        "TO RECEIVE AND PROCESS APPLICATIONS",
    ];
    let boxTwoY = height - 11 * fontMedium - secondBoxHeight - 15 + (secondBoxHeight - lineHeight);
    boxTwoText.forEach((text) => {
        page.drawText(text, {
            x: width - secondBoxWidth - 28,
            y: boxTwoY,
            size: fontRegular,
            color: rgb(0, 0, 0),
            font: font,
        });
        boxTwoY -= lineHeight;
    });
    page.drawRectangle({
        x: width - secondBoxWidth - -60,
        y: height - 10 * fontMedium - secondBoxHeight - 0,
        width: 180,
        height: 60,
        borderWidth: 1,
        borderColor: rgb(0, 0, 0),
    });
    page.drawText(`${studentData.applicationNumber}`, {
        x: width - secondBoxWidth / 3 - 60,
        y: height - 12 * fontMedium - secondBoxHeight / 2 - fontRegular / 2,
        size: fontLarge,
        color: rgb(0, 0, 0),
        font: fontBold,
    });
    const appNumberLineY = height - 8 * fontMedium - secondBoxHeight - 12 + fontRegular / 2;
    page.drawLine({
        start: { x: width - secondBoxWidth - 190 + 250, y: appNumberLineY },
        end: { x: width - secondBoxWidth - 10 + 250, y: appNumberLineY },
        color: rgb(0, 0, 0),
        thickness: 1,
    });
    page.drawText("Application Number", {
        x: width - secondBoxWidth + 110,
        y: height - 9 * fontMedium - secondBoxHeight - 7,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(`Received by:`, {
        x: width - secondBoxWidth - 20,
        y: height - 11 * fontMedium - secondBoxHeight - 10,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    const createdDate = new Date(studentData.createdAt);
    const optionsDate = { month: 'long', day: 'numeric', year: 'numeric' };
    const formattedCreated = createdDate.toLocaleDateString('en-US', optionsDate);
    page.drawText(`Date: ${formattedCreated}`, {
        x: width - secondBoxWidth + 150,
        y: height - 11 * fontMedium - secondBoxHeight - 10,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });

    const fieldY = height - 11 * fontMedium - firstBoxHeight - 30;
    const fieldWidth = 200;
    const fieldHeight = 20;

    page.drawText("Name of Student:", {
        x: 32,
        y: fieldY,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText("Last:", {
        x: 50,
        y: fieldY - fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(`${studentData.lastName}`, {
        x: 90,
        y: fieldY - fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    const lineY = fieldY - fieldHeight - 6;
    page.drawLine({
        start: { x: 90, y: lineY },
        end: { x: 30 + firstBoxWidth, y: lineY },
        color: rgb(0, 0, 0),
        thickness: 1,
    });


    page.drawText("First:", {
        x: 50,
        y: fieldY - 2 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(`${studentData.firstName}`, {
        x: 90,
        y: fieldY - 2 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    const line2Y = fieldY - 2 * fieldHeight - 6;
    page.drawLine({
        start: { x: 90, y: line2Y },
        end: { x: 30 + firstBoxWidth, y: line2Y },
        color: rgb(0, 0, 0),
        thickness: 1,
    });


    page.drawText("Middle:", {
        x: 50,
        y: fieldY - 3 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(`${studentData.middleName}`, {
        x: 90,
        y: fieldY - 3 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    const line3Y = fieldY - 3 * fieldHeight - 6;
    page.drawLine({
        start: { x: 90, y: line3Y },
        end: { x: 30 + firstBoxWidth, y: line3Y },
        color: rgb(0, 0, 0),
        thickness: 1,
    });

    page.drawText("Age:", {
        x: 50,
        y: fieldY - 4 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(`${studentData.age}`, {
        x: 80,
        y: fieldY - 4 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });

    page.drawText("Sex:", {
        x: 90 + 50,
        y: fieldY - 4 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(`${studentData.sex}`, {
        x: 90 + 80,
        y: fieldY - 4 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });


    page.drawText("LRN No:", {
        x: 90 + 300,
        y: fieldY - 4 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(`${studentData.lrn}`, {
        x: 100 + 330,
        y: fieldY - 4 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });

    
    const dobDate = new Date(studentData.dob);
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const formattedDate = dobDate.toLocaleDateString('en-US', options);
    page.drawText("Date of Birth:", {
        x: 50,
        y: fieldY - 5 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(formattedDate, {
        x: 120,
        y: fieldY - 5 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });

    page.drawText("Email Address:", {
        x: 80 + 280,
        y: fieldY - 5 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(`${studentData.email}`, {
        x: 100 + 330,
        y: fieldY - 5 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });

    page.drawText("Place of Birth:", {
        x: 50,
        y: fieldY - 6 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(`${studentData.placeOfBirth}`, {
        x: 120,
        y: fieldY - 6 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText("Permanent Address:", {
        x: 100 + 140,
        y: fieldY - 6 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(`${studentData.address}`, {
        x: 100 + 230,
        y: fieldY - 6 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });

    page.drawText("Civil Status:", {
        x: 50,
        y: fieldY - 7 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(`${studentData.civilStatus}`, {
        x: 120,
        y: fieldY - 7 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    
    page.drawText("Citizenship:", {
        x: 100 + 140,
        y: fieldY - 7 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(`${studentData.citizenship}`, {
        x: 100 + 200,
        y: fieldY - 7 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText("Religion:", {
        x: 200 + 230,
        y: fieldY - 7 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(`${studentData.religion}`, {
        x: 200 + 280,
        y: fieldY - 7 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });


    page.drawText("Contact No:", {
        x: 50,
        y: fieldY - 8 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(`${studentData.phone}`, {
        x: 120,
        y: fieldY - 8 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText("Zip Code:", {
        x: 100 + 140,
        y: fieldY - 8 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(`${studentData.zipCode}`, {
        x: 100 + 200,
        y: fieldY - 8 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });

    page.drawText("Parent Name:", {
        x: 50,
        y: fieldY - 9 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(`${studentData.parentName}`, {
        x: 120,
        y: fieldY - 9 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    
    page.drawText("Occupation:", {
        x: 100 + 140,
        y: fieldY - 9 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(`${studentData.occupation}`, {
        x: 100 + 200,
        y: fieldY - 9 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText("Contact No:", {
        x: 200 + 230,
        y: fieldY - 9 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(`${studentData.parentPhone}`, {
        x: 200 + 280,
        y: fieldY - 9 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });


    let schoolNameTextFreshmen = "";
    let schoolAddressTextFreshmen = "";
    let schoolNameTextTransferee = "";
    let schoolAddressTextTransferee = "";

    if(studentData.studentStatus === "Freshmen") {
        schoolNameTextFreshmen = `${studentData.school}`;
        schoolAddressTextFreshmen = `${studentData.schoolAddress}`;
    } else if(studentData.studentStatus === "Transferee") {
        schoolNameTextTransferee = `${studentData.school}`;
        schoolAddressTextTransferee = `${studentData.schoolAddress}`;
    } 
    page.drawText("For currently enrolled Upper Primary Education Students:", {
        x: 50,
        y: fieldY - 10 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText("Write full name of Elementary where you are currently enrolled.", {
        x: 120,
        y: fieldY - 11 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(schoolNameTextFreshmen, {
        x: 120,
        y: fieldY - 12 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText("Address of School:", {
        x: 120,
        y: fieldY - 13 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(schoolAddressTextFreshmen, {
        x: 200,
        y: fieldY - 13 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });

    page.drawText("For Transferee:", {
        x: 50,
        y: fieldY - 14 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText("Previous School:", {
        x: 120,
        y: fieldY - 15 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(schoolNameTextTransferee, {
        x: 200,
        y: fieldY - 15 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText("Address of School:", {
        x: 120,
        y: fieldY - 16 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(schoolAddressTextTransferee, {
        x: 200,
        y: fieldY - 16 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });

    const signatureBoxWidth = 200;
    const signatureBoxHeight = 50;
    page.drawRectangle({
        x: 365,
        y: height - 41 * fontMedium - secondBoxHeight - 20 - signatureBoxHeight - 10,
        width: signatureBoxWidth,
        height: signatureBoxHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
    });
    const signatureLineY = height - 41 * fontMedium - secondBoxHeight - 30 - signatureBoxHeight - 10 + signatureBoxHeight / 2;
    page.drawLine({
        start: { x: 365, y: signatureLineY },
        end: { x: 365 + signatureBoxWidth, y: signatureLineY },
        color: rgb(0, 0, 0),
        thickness: 1,
    });
    page.drawText("Signature of Applicant", {
        x: 420,
        y: height - 41 * fontMedium - secondBoxHeight - 20 - signatureBoxHeight - 10 + 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });

    return pdfDoc;
};


// ADMIN VIEWING PDF
const adminGeneratedPDF = async (studentData) => {
    // const getLogo = await fs.readFile('../../client/src/assets/ccc.jpg');
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    const fontRegular = 9;
    const fontMedium = 11;
    const fontLarge = 12;

    const schoolName = "BUTONG ELEMENTARY SCHOOL";
    const schoolAddress = "74RP+2M5, Purok 3 Unnamed Rd, Cabuyao, 4025 Laguna";
    const title = "APPLICATION FORM";
    const title2 = "ADMISSION INTERVIEW";

    // const logo = await pdfDoc.embedPng(getLogo);
    // const logoWidth = 60;
    // const logoHeight = (logo.height / logo.width) * logoWidth;

    // page.drawImage(logo, {
    //     x: 30,
    //     y: height - logoHeight - 50,
    //     width: logoWidth,
    //     height: logoHeight,
    // });
    

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const schoolNameWidth = font.widthOfTextAtSize(schoolName, fontMedium);
    page.drawText(schoolName, {
        x: (width - schoolNameWidth) / 2,
        y: height - 5 * fontMedium,
        size: fontMedium,
        color: rgb(0, 0, 0),
    });
    
    const schoolAddressWidth = font.widthOfTextAtSize(schoolAddress, fontRegular);
    page.drawText(schoolAddress, {
        x: (width - schoolAddressWidth) / 2,
        y: height - 6 * fontMedium,
        size: fontRegular,
        color: rgb(0, 0, 0),
    });

    const titleWidth = font.widthOfTextAtSize(title, fontLarge);
    page.drawText(title, {
        x: (width - titleWidth) / 2,
        y: height - 10 * fontMedium,
        size: fontLarge,
        color: rgb(0, 0, 0),
        font: fontBold,
    });

    const title2Width = font.widthOfTextAtSize(title2, fontLarge);
    page.drawText(title2, {
        x: (width - title2Width) / 2,
        y: height - 11 * fontMedium,
        size: fontLarge,
        color: rgb(0, 0, 0),
        font: fontBold,
    });

    const pictureWidth = 100;
    const pictureHeight = 100;
    page.drawRectangle({
        x: width - 130,
        y: height - pictureHeight - 11,
        width: pictureWidth,
        height: pictureHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
    });


    const firstBoxWidth = 235;
    const firstBoxHeight = 60;
    page.drawRectangle({
        x: 30,
        y: height - 11 * fontMedium - firstBoxHeight - 20,
        width: firstBoxWidth,
        height: firstBoxHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
    });

    const boxOneText = [
        "TO THE APPLICANT, PARENT/GUARDIAN:",
        "Print clearly and legibly all required information.",
        "Place check marks in the appropriate boxes. Application",
        "forms not fully accomplished will not be processed"
    ];
    const lineHeight = 15;
    let boxOneY = height - 11 * fontMedium - firstBoxHeight - 15 + (firstBoxHeight - lineHeight);
    boxOneText.forEach((text) => {
        page.drawText(text, {
            x: 32,
            y: boxOneY,
            size: fontRegular,
            color: rgb(0, 0, 0),
            font: font,
        });
        boxOneY -= lineHeight;
    });
    

    const secondBoxWidth = 280;
    const secondBoxHeight = 120;
    page.drawRectangle({
        x: width - secondBoxWidth - 30,
        y: height - 11 * fontMedium - secondBoxHeight - 20,
        width: secondBoxWidth,
        height: secondBoxHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
    });

    const boxTwoText = [
        "FOR AUTHORIZED ADMISSION PERSONNEL ONLY",
        "TO RECEIVE AND PROCESS APPLICATIONS",
    ];
    let boxTwoY = height - 11 * fontMedium - secondBoxHeight - 15 + (secondBoxHeight - lineHeight);
    boxTwoText.forEach((text) => {
        page.drawText(text, {
            x: width - secondBoxWidth - 28,
            y: boxTwoY,
            size: fontRegular,
            color: rgb(0, 0, 0),
            font: font,
        });
        boxTwoY -= lineHeight;
    });
    page.drawRectangle({
        x: width - secondBoxWidth - -60,
        y: height - 10 * fontMedium - secondBoxHeight - 0,
        width: 180,
        height: 60,
        borderWidth: 1,
        borderColor: rgb(0, 0, 0),
    });
    page.drawText(`${studentData.applicationNumber}`, {
        x: width - secondBoxWidth / 3 - 60,
        y: height - 12 * fontMedium - secondBoxHeight / 2 - fontRegular / 2,
        size: fontLarge,
        color: rgb(0, 0, 0),
        font: fontBold,
    });
    const appNumberLineY = height - 8 * fontMedium - secondBoxHeight - 12 + fontRegular / 2;
    page.drawLine({
        start: { x: width - secondBoxWidth - 190 + 250, y: appNumberLineY },
        end: { x: width - secondBoxWidth - 10 + 250, y: appNumberLineY },
        color: rgb(0, 0, 0),
        thickness: 1,
    });
    page.drawText("Application Number", {
        x: width - secondBoxWidth + 110,
        y: height - 9 * fontMedium - secondBoxHeight - 7,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(`Received by:`, {
        x: width - secondBoxWidth - 20,
        y: height - 11 * fontMedium - secondBoxHeight - 10,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    const createdDate = new Date(studentData.createdAt);
    const optionsDate = { month: 'long', day: 'numeric', year: 'numeric' };
    const formattedCreated = createdDate.toLocaleDateString('en-US', optionsDate);
    page.drawText(`Date: ${formattedCreated}`, {
        x: width - secondBoxWidth + 150,
        y: height - 11 * fontMedium - secondBoxHeight - 10,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });

    const fieldY = height - 11 * fontMedium - firstBoxHeight - 30;
    const fieldWidth = 200;
    const fieldHeight = 20;

    page.drawText("Name of Student:", {
        x: 32,
        y: fieldY,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText("Last:", {
        x: 50,
        y: fieldY - fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(`${studentData.lastName}`, {
        x: 90,
        y: fieldY - fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    const lineY = fieldY - fieldHeight - 6;
    page.drawLine({
        start: { x: 90, y: lineY },
        end: { x: 30 + firstBoxWidth, y: lineY },
        color: rgb(0, 0, 0),
        thickness: 1,
    });


    page.drawText("First:", {
        x: 50,
        y: fieldY - 2 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(`${studentData.firstName}`, {
        x: 90,
        y: fieldY - 2 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    const line2Y = fieldY - 2 * fieldHeight - 6;
    page.drawLine({
        start: { x: 90, y: line2Y },
        end: { x: 30 + firstBoxWidth, y: line2Y },
        color: rgb(0, 0, 0),
        thickness: 1,
    });


    page.drawText("Middle:", {
        x: 50,
        y: fieldY - 3 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(`${studentData.middleName}`, {
        x: 90,
        y: fieldY - 3 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    const line3Y = fieldY - 3 * fieldHeight - 6;
    page.drawLine({
        start: { x: 90, y: line3Y },
        end: { x: 30 + firstBoxWidth, y: line3Y },
        color: rgb(0, 0, 0),
        thickness: 1,
    });

    page.drawText("Age:", {
        x: 50,
        y: fieldY - 4 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(`${studentData.age}`, {
        x: 80,
        y: fieldY - 4 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });

    page.drawText("Sex:", {
        x: 90 + 50,
        y: fieldY - 4 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(`${studentData.sex}`, {
        x: 90 + 80,
        y: fieldY - 4 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });


    page.drawText("LRN No:", {
        x: 90 + 300,
        y: fieldY - 4 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(`${studentData.lrn}`, {
        x: 100 + 330,
        y: fieldY - 4 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });

    
    const dobDate = new Date(studentData.dob);
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const formattedDate = dobDate.toLocaleDateString('en-US', options);
    page.drawText("Date of Birth:", {
        x: 50,
        y: fieldY - 5 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(formattedDate, {
        x: 120,
        y: fieldY - 5 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });

    page.drawText("Email Address:", {
        x: 80 + 280,
        y: fieldY - 5 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(`${studentData.email}`, {
        x: 100 + 330,
        y: fieldY - 5 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });

    page.drawText("Place of Birth:", {
        x: 50,
        y: fieldY - 6 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(`${studentData.placeOfBirth}`, {
        x: 120,
        y: fieldY - 6 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText("Permanent Address:", {
        x: 100 + 140,
        y: fieldY - 6 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(`${studentData.address}`, {
        x: 100 + 230,
        y: fieldY - 6 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });

    page.drawText("Civil Status:", {
        x: 50,
        y: fieldY - 7 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(`${studentData.civilStatus}`, {
        x: 120,
        y: fieldY - 7 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    
    page.drawText("Citizenship:", {
        x: 100 + 140,
        y: fieldY - 7 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(`${studentData.citizenship}`, {
        x: 100 + 200,
        y: fieldY - 7 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText("Religion:", {
        x: 200 + 230,
        y: fieldY - 7 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(`${studentData.religion}`, {
        x: 200 + 280,
        y: fieldY - 7 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });


    page.drawText("Contact No:", {
        x: 50,
        y: fieldY - 8 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(`${studentData.phone}`, {
        x: 120,
        y: fieldY - 8 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText("Zip Code:", {
        x: 100 + 140,
        y: fieldY - 8 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(`${studentData.zipCode}`, {
        x: 100 + 200,
        y: fieldY - 8 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });

    page.drawText("Parent Name:", {
        x: 50,
        y: fieldY - 9 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(`${studentData.parentName}`, {
        x: 120,
        y: fieldY - 9 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    
    page.drawText("Occupation:", {
        x: 100 + 140,
        y: fieldY - 9 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(`${studentData.occupation}`, {
        x: 100 + 200,
        y: fieldY - 9 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText("Contact No:", {
        x: 200 + 230,
        y: fieldY - 9 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(`${studentData.parentPhone}`, {
        x: 200 + 280,
        y: fieldY - 9 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });


    let schoolNameTextFreshmen = "";
    let schoolAddressTextFreshmen = "";
    let schoolNameTextTransferee = "";
    let schoolAddressTextTransferee = "";

    if(studentData.studentStatus === "Freshmen") {
        schoolNameTextFreshmen = `${studentData.school}`;
        schoolAddressTextFreshmen = `${studentData.schoolAddress}`;
    } else if(studentData.studentStatus === "Transferee") {
        schoolNameTextTransferee = `${studentData.school}`;
        schoolAddressTextTransferee = `${studentData.schoolAddress}`;
    } 
    page.drawText("For currently enrolled Upper Primary Education students:", {
        x: 50,
        y: fieldY - 10 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText("Write full name of Elementary where you are currently enrolled.", {
        x: 120,
        y: fieldY - 11 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(schoolNameTextFreshmen, {
        x: 120,
        y: fieldY - 12 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText("Address of School:", {
        x: 120,
        y: fieldY - 13 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(schoolAddressTextFreshmen, {
        x: 200,
        y: fieldY - 13 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });

    page.drawText("For Transferee:", {
        x: 50,
        y: fieldY - 14 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText("Previous School:", {
        x: 120,
        y: fieldY - 15 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(schoolNameTextTransferee, {
        x: 200,
        y: fieldY - 15 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText("Address of School:", {
        x: 120,
        y: fieldY - 16 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });
    page.drawText(schoolAddressTextTransferee, {
        x: 200,
        y: fieldY - 16 * fieldHeight - 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });


    const signatureBoxWidth = 200;
    const signatureBoxHeight = 50;
    page.drawRectangle({
        x: 365,
        y: height - 41 * fontMedium - secondBoxHeight - 20 - signatureBoxHeight - 10,
        width: signatureBoxWidth,
        height: signatureBoxHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
    });
    const signatureLineY = height - 41 * fontMedium - secondBoxHeight - 30 - signatureBoxHeight - 10 + signatureBoxHeight / 2;
    page.drawLine({
        start: { x: 365, y: signatureLineY },
        end: { x: 365 + signatureBoxWidth, y: signatureLineY },
        color: rgb(0, 0, 0),
        thickness: 1,
    });
    page.drawText("Signature of Applicant", {
        x: 420,
        y: height - 41 * fontMedium - secondBoxHeight - 20 - signatureBoxHeight - 10 + 5,
        size: fontRegular,
        color: rgb(0, 0, 0),
        font: font,
    });

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
};

const viewGeneratedPDF = async (req, res) => {
    try {
        const studentData = req.body;
        const pdfBytes = await adminGeneratedPDF(studentData);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=generated.pdf',
        });
        res.send(Buffer.from(pdfBytes));
    } catch (error) {
        console.error('Error:', e);
        return res.status(500).json({success: false, message: 'Error generating PDF, Please try again...'});
    }
};


const getVerifyApplication = async (req, res) => {
    const { token, id } = req.params;

    if (!token || !id) {
        return res.status(403).json({ success: false, message: 'Token and id are required.' });
    } 
   

    try {
        const student = await StudentInfo.findOne({verifyToken: token, _id: id});

        if(!student) {
            return res.status(404).json({ success: false, message: 'Invalid token or ID.' });
        }

        if (student.verified) {
            return res.status(200).json({ success: true, message: 'Email has already been verified.' });
        }

        await StudentInfo.findOneAndUpdate(
            { verifyToken: token, _id: id },
            { verified: true, $unset: { expiredAt: 1 } }
        );

        const schedule = await Schedule.findOne({ studentId: id});

        if(!schedule) {
            return res.status(404).json({ success: false, message: 'Schedule not found' });
        }

        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: Number(process.env.EMAIL_PORT),
            secure: Boolean(process.env.SECURE),
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailGenerator = new Mailgen({
            theme: 'default',
            product: {
                name: 'Admission',
                link: 'http://localhost:5173/',
            }
        });

        const formatDate = format(schedule.date, "MMMM dd, yyyy");
        const formatTime = format(schedule.time, "hh:mm a");

        const emailBody = {
            body: {
                greeting: `Hello ${student.lastName}`,
                intro: "Schedule details:",
                table: {
                    data: [
                        {
                            Date: formatDate,
                            Time: formatTime,
                        },
                    ],
                },
                outro: 'Thank you for submitting your application.'
            }
        };

        const emailTemplate = mailGenerator.generate(emailBody);

        const pdfDoc = await generatePDF(student);

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: student.email,
            subject: 'Email Verified',
            html: emailTemplate,
            attachments: [
                {
                    filename: 'admission-form.pdf',
                    content: await pdfDoc.save(),
                }
            ]
        });

        return res.status(200).json({ success: true, message: 'Application Verified Successfully.' });
    } catch(e) {
        console.error('Error:', e);
        return res.status(500).json({success: false, message: 'Something went wrong, Please try again...'});
    }
}


const getStudents = async (req, res) => {
    try {
        const students = await StudentInfo.find({verified: true});

        return res.status(200).json(students);
    } catch(e) {
        console.error('Error:', e);
        return res.status(500).send('Something went wrong...');
    }
}


const getStudentInfo = async (req, res) => {
    const id = req.params.id;

    try {
        const student = await StudentInfo.findById(id);

        if (!student) {
            return res.status(404).send('Student not found');
        }

        return res.status(200).json(student);
    } catch(e) {
        console.error('Error:', e);
        return res.status(500).send('Something went wrong...');
    }
}


const updateStudentInfo = async (req, res) => {
    const id = req.params.id;
    const updatedInfo = {
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        extensionName: req.body.extensionName,
        age: req.body.age,
        sex: req.body.sex,
        civilStatus: req.body.civilStatus,
        religion: req.body.religion,
        dob: req.body.dob,
        placeOfBirth: req.body.placeOfBirth,
        address: req.body.address,
        citizenship: req.body.citizenship,
        lrn: req.body.lrn,
        email: req.body.email,
        phone: req.body.phone,
        zipCode: req.body.zipCode,
        parentName: req.body.parentName,
        occupation: req.body.occupation,
        parentPhone: req.body.parentPhone,
        school: req.body.school,
        schoolAddress: req.body.schoolAddress,
        course: req.body.course,
    };

    try {
        const student = await StudentInfo.findByIdAndUpdate(id, updatedInfo, {new: true});

        if (!student) {
            return res.status(404).send('Student not found');
        }
        
        return res.status(201).send('Student data has been updated.');
    } catch(e) {
        console.error('Error:', e);
        return res.status(500).send('Failed to update data');
    }
}


const deleteStudent = async (req, res) => {
    try {
        const deletedStudent = await StudentInfo.findByIdAndDelete(req.params.id);
        await Schedule.updateMany({ studentId: deletedStudent._id }, { $pull: { studentId: deletedStudent._id } });
        res.status(200).send('Student application has been deleted.');
    } catch(e) {
        console.error('Error:', e);
        return res.status(500).send('Error deleting student application');
    }
}


const createSchedule = async (req, res) => {
    const scheduleJson = {
        date: req.body.date,
        time: req.body.time,
        maxStudent: req.body.maxStudent,
        createAt: new Date()
    }

    try {
        const scheduleExist = await Schedule.findOne({ date: scheduleJson.date, time: scheduleJson.time });

        if (scheduleExist) {
            return res.status(400).send('This date and time is already exist!');
        }

        await Schedule.create(scheduleJson);
        return res.status(201).send('New schedule has been created');
    } catch(e) {
        console.error('Error:', e);
        return res.status(500).send('Failed creating schedule, Please try again...');
    }
}


const getSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.find();

        return res.status(200).json(schedule);
    } catch(e) {
        console.error('Error:', e);
        return res.status(500).send('Something went wrong...');
    }
}


const deleteSchedule = async (req, res) => {
    try {
        await Schedule.findByIdAndDelete(req.params.id);
        res.status(200).send('Schedule has been deleted.');
    } catch(e) {
        console.error('Error:', e);
        return res.status(500).send('Error deleting schedule');
    }
}


const getScheduleView = async (req, res) => {
    const id = req.params.id;

    try {
        const schedule = await Schedule.findById(id);

        if (!schedule) {
            return res.status(404).send('ScheduleId not found');
        }

        const studentIds = schedule.studentId;
        const studentData = await StudentInfo.find({ _id: { $in: studentIds } });

        if (!studentData) {
            return res.status(404).send('Student not found');
        }

        return res.status(200).json(studentData);
    } catch(e) {
        console.error('Error:', e);
        return res.status(500).send('Something went wrong...');
    }
}


module.exports = {
    getApplication,
    selectSchedule,
    getApplicationSchedule,
    getVerifyApplication,
    getStudents,
    getStudentInfo,
    updateStudentInfo,
    deleteStudent,
    createSchedule,
    getSchedule,
    deleteSchedule,
    getScheduleView,
    viewGeneratedPDF
}