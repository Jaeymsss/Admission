const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    schoolTerm: {
        type: String,
        required: true,
    },
    schoolYear: {
        type: String,
        required: true,
    },
});

const Settings = mongoose.model('settings', settingsSchema);
module.exports = Settings;