const  StudentInfo  = require('../models/applicationModel');
const path = require('path');
const fs = require('fs');


const viewPDF = async (req, res) => {
    const { filename } = req.params;

    try {
        const studentInfo = await StudentInfo.findOne({ files: filename });
        if (!studentInfo) {
            console.log('PDF not found:', filename);
            return res.status(404).send('PDF not found');
        }

        const filePath = path.join(__dirname, '../uploads', filename);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

        fs.createReadStream(filePath).pipe(res);
    } catch (error) {
        console.error('Error fetching PDF:', error);
        res.status(500).send('Internal server error');
    }
}

module.exports = {
    viewPDF
}