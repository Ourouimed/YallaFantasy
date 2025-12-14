const Settings = require('../models/settings');
const db = require('../config/db');
const getSettings = async (req, res) => {
    try {
        const settings = await Settings.getSettings();

        // Also fetch deadline if round set
        let deadline = null;
        if (settings && settings.current_round_id) {
            const [round] = await db.query('SELECT round_deadline FROM rounds WHERE round_id = ?', [settings.current_round_id]);
            if (round && round[0]) deadline = round[0].round_deadline;
        }

        res.json({ ...settings, deadline });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

const updateSettings = async (req, res) => {
    let { current_round_id, goal_points, assist_points, clean_sheet_points } = req.body;

    // Handle empty string for foreign key
    if (current_round_id === '') {
        current_round_id = null;
    }

    try {
        const updated = await Settings.updateSettings(current_round_id, goal_points, assist_points, clean_sheet_points);
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = { getSettings, updateSettings };
