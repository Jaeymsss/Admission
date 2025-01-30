const Settings = require('../models/settingsModel');
const Announcement = require('../models/announcementModel');

 const getSettings = async (req, res) => {
    try {
        const settings = await Settings.findOne();

        return res.status(200).json(settings);
    } catch(e) {
        console.error('Error:', e);
        return res.status(500).send('Something went wrong...');
    }
 };

const createSettings = async (req, res) => {
    const settingsData = {
        schoolTerm: req.body.schoolTerm,
        schoolYear: req.body.schoolYear
    };

    const settings = new Settings(settingsData);

    try {
        const newSettings = await settings.save();
        res.status(201).json(newSettings);
    } catch (e) {
        console.log('Error:', e);
        res.status(400).send('Something went wrong, Please try again...');
    }
};

const editSettings = async (req, res) => {
    try {
        const settings = await Settings.findById(req.params.id);
        if (!settings) {
            return res.status(404).send('Something went wrong, Please try again...');
        }

        settings.schoolTerm = req.body.schoolTerm;
        settings.schoolYear = req.body.schoolYear;

        const updatedSettings = await settings.save();
        res.json(updatedSettings);
    } catch (error) {
        console.log('Error:', e);
        res.status(400).send('Something went wrong, Please try again...');
    }
};

const announcementSettings = async (req, res) => {
    const { title, content } = req.body;

    try {
        const existingAnnouncement = await Announcement.findOne();

        if (existingAnnouncement) {
            existingAnnouncement.title = title;
            existingAnnouncement.content = content;
            existingAnnouncement.createdAt = new Date();
            await existingAnnouncement.save();
        } else {
            const newAnnouncement = new Announcement({
                title,
                content,
            });
            await newAnnouncement.save();
        }

        return res.status(200).send('Announcement successfully created.');
    } catch (e) {
        console.error('Error:', e);
        return res.status(500).send('Something went wrong...');
    }
}

const getAnnouncements = async (req, res) => {
    try {
        const latestAnnouncement = await Announcement.findOne().sort({ createdAt: -1 }).exec();
        if (latestAnnouncement) {
        res.json(latestAnnouncement);
        } else {
        res.status(404).send('No announcements found');
        }
    } catch(e) {
        console.error('Error:', e);
        return res.status(500).send('Something went wrong...');
    }
}

module.exports = {
    getSettings,
    createSettings,
    editSettings,
    announcementSettings,
    getAnnouncements
}